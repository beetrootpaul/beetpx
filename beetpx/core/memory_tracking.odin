package beetpx_core

import "core:fmt"
import "core:mem"

/*
Memory debugging: how to use it, and what to expect.

There are two complementary tools, both off by default and enabled per build.
`examples/scripts/run.sh` exposes them as options.

1. Tracking allocator (`--track-memory`, i.e. `-define:BPX_TRACK_MEMORY=true`).
   Odin's `mem.Tracking_Allocator`, wired up in this file. It records every
   allocation and free made through `context.allocator` during a frame, and:
   - after each frame, prints "BeetPx: memory in use: ..." if the amount
     changed since the last print. Nothing is printed while nothing is
     allocated. Allocations that are freed within the same frame net to zero
     and print nothing either. A print on every frame, with ever higher
     numbers, points to a leak, e.g. `_ = new(int)` in `on_update`.
   - panics on a free of memory it did not allocate, such as a double free,
     and shows the source location of that free.
   - on app exit, lists every allocation that is still not freed, with the
     source location that made it, or prints "BeetPx: no memory leaks."
     Memory allocated once and kept for the whole run (e.g. loaded assets)
     shows up there too, which is harmless.
   It does not see allocations made in `main` before `start`, nor those made
   through `context.temp_allocator`.

2. LLVM sanitizers (`--sanitize=address` or `--sanitize=thread`, i.e.
   `-sanitize:<name>`, plus `-debug` for file names and line numbers in the
   reports). They instrument the compiled code and stop the app with a report
   on the first error they detect:
   - `address`: out-of-bounds accesses and uses of freed memory, which the
     tracking allocator cannot detect.
   - `thread`: data races between threads.
   Odin allows only one sanitizer per build. A third one, `memory` (reads of
   uninitialized memory), is supported by Odin on Linux and FreeBSD only.
   The tracking allocator and a sanitizer can be combined.

How the platforms differ:
- Desktop (`darwin_arm64`): everything above works. `start` blocks until the
  window is closed, and then the leak list is printed.
- Web (`js_wasm32`): only the per-frame "memory in use" prints, in the browser
  console. A page has no hook that runs when it is closed, so there is no leak
  list, and Odin supports no sanitizers on the web. The tracking allocator is
  set per frame, in `_game_loop_advance`, rather than once in `start`, because
  `odin.js` calls `step` with a fresh default context on every frame, so an
  allocator set in `start` would not carry over.

Tests: `odin test` tracks memory per test on its own, without this file. By
default it only prints leaks; `-define:ODIN_TEST_FAIL_ON_BAD_MEMORY=true`
makes them fail the test.

Type checking: code under `when _TRACK_MEMORY` is skipped unless the define is
on, so `scripts/check_core.sh` checks `core` once more with it enabled.

Example runs, from the repository root:

	./examples/scripts/run.sh darwin_arm64 basic --track-memory
	./examples/scripts/run.sh darwin_arm64 basic --sanitize=address
	./examples/scripts/run.sh darwin_arm64 basic --sanitize=thread
	./examples/scripts/run.sh darwin_arm64 basic --track-memory --sanitize=address
	./examples/scripts/run.sh js_wasm32 basic --track-memory
*/

// Whether the engine runs every frame with a tracking allocator as
// `context.allocator`. It reports the memory that stays allocated, and it
// panics on a free of memory it did not allocate, such as a double free. Off by
// default; enable it with `-define:BPX_TRACK_MEMORY=true`.
//
// It tracks only allocations made through `context.allocator` during a frame,
// which includes `on_update` and `on_draw`. Allocations made before `start`,
// or through `context.temp_allocator`, are not tracked.
@(private)
_TRACK_MEMORY :: #config(BPX_TRACK_MEMORY, false)

@(private = "file")
_tracking_allocator: mem.Tracking_Allocator

@(private = "file")
_last_reported_bytes: i64

@(private)
_memory_tracking_init :: proc() {
	mem.tracking_allocator_init(&_tracking_allocator, context.allocator)
}

@(private)
_memory_tracking_allocator :: proc() -> mem.Allocator {
	return mem.tracking_allocator(&_tracking_allocator)
}

// Prints the memory in use whenever it differs from the last print. It is
// meant to run once per frame, so a print on every frame, with ever higher
// numbers, points to a leak.
@(private)
_memory_tracking_report_change :: proc() {
	current_bytes := _tracking_allocator.current_memory_allocated
	if current_bytes == _last_reported_bytes {
		return
	}
	_last_reported_bytes = current_bytes

	// TODO: Use a custom logger.
	fmt.printfln(
		"BeetPx: memory in use: %m in %v allocations (peak: %m).",
		current_bytes,
		len(_tracking_allocator.allocation_map),
		_tracking_allocator.peak_memory_allocated,
	)
}

// Prints every allocation that is still not freed, then destroys the tracking
// allocator. Meant to run once, on app exit.
@(private)
_memory_tracking_report_leaks :: proc() {
	// TODO: Use a custom logger.
	if len(_tracking_allocator.allocation_map) == 0 {
		fmt.println("BeetPx: no memory leaks.")
	}
	for _, entry in _tracking_allocator.allocation_map {
		fmt.eprintfln("BeetPx: %v: leaked %m.", entry.location, entry.size)
	}

	mem.tracking_allocator_destroy(&_tracking_allocator)
}
