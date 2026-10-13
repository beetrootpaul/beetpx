package beetpx_bpx

import "core:fmt"
import "core:mem"

// Whether the engine runs every frame with a tracking allocator as
// `context.allocator`. Off by default; enable it with
// `-define:BPX_TRACK_MEMORY=true`, e.g. through `--track-memory` of the run
// scripts.
//
// It then:
// - after each frame, prints the memory in use if it changed since the last
//   print. A print on every frame, with ever higher numbers, points to a leak.
// - panics on a free of memory it did not allocate, such as a double free.
// - on app exit, lists every allocation that is still not freed. Desktop
//   only: a web page does not get to run code when it is closed.
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

// Prints the memory in use whenever it differs from the last print. Meant to
// run once per frame.
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
