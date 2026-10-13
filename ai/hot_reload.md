# Native hot reload: findings so far

> A working note, not a decision. Written on 2026-10-13. Like every Markdown
> file here, it is updated only when the user asks for it. It is meant to be
> enough to continue the work without any other context.

## Goal

On desktop, rebuild the game's code while the game runs, and keep its state.
The braindump (`ai/rewrite_braindump.md`, "Native hot reload") plans a thin,
long-lived host that owns the window, audio, and input, with the game code
as a shared library and all game state in one struct. The web keeps
"rebuild, then reload the page": WASM has no `dlopen`.

## Where the work is

| Repo | Branch | Base | Commits |
|---|---|---|---|
| `beetpx` | `cc/t-9fvdi8` | `odin` at `b95da9d` | `53192e4` (API and state struct), the spike and this note |
| `avoid-your-past-beetpx-odin` (ayp) | `cc/t-9fvdi8` | `dev` at `2f4f3db` | `6cd9066` (ayp on the new API) |

The two branches go together: ayp on its branch compiles only against
beetpx on its branch.

Verified: `scripts/check_code.sh`, `scripts/test.sh`,
`examples/check_all.sh`, and ayp's `scripts/check.sh` pass, `basic` builds
for `js_wasm32`, and the spike runs on Linux. **Not verified: nothing has
run with a window** (no `run.sh` on macOS or in a browser).

Not updated yet: `ai/rewrite_status.md` and the READMEs still describe
`set_on_update` / `set_on_draw`.

## Reference: Karl2D's hot reload template

https://github.com/karl-zylinski/karl2d-hot-reload-template (checked on
2026-10-13, `master`):

- The game **and the Karl2D library** are built into one `game.dll`. The host
  exe (`main_hot_reload/`, ~190 lines) loads it, calls `game_update()` in a
  loop, and reloads it when its mtime changes, copying it to
  `game_<n>.dll` first.
- The library's state is one `^k2.State`. After a reload, the game calls
  `k2.set_internal_state(state)`, so the new code uses the old state.
- The game's state is one `^Game_Memory`. If `game_memory_size()` changed,
  the host does a full restart instead of a reload.
- `dynlib.initialize_symbols(&api, path, "game_")` fills an API struct from
  every `game_*` export.
- Old libraries are never unloaded until exit.

## Step 1, done: one state for the game, one for the framework

What blocked hot reload in BeetPx:

1. Framework data lived in package globals (frame number, time accumulator,
   tick length, framebuffer, callbacks, SDL handles). A newly loaded library
   starts with all of them zeroed. E.g. a `bpx.Timer` stores the tick it
   started at; if `frame_number()` restarts at 0, the timer breaks.
2. Games kept state in package globals too (ayp's `_curr_screen`).
3. `start` owns the loop and blocks on desktop. A library needs an entry
   point that returns.

What changed (`beetpx/bpx/game_loop.odin`, `beetpx/internal/state.odin`,
`beetpx/internal/canvas.odin`, the examples, ayp's `src/main.odin`):

```odin
State :: struct {
	color: bpx.Rgb,
}

main :: proc() {
	bpx.start(
		State,
		canvas_size = .Square_64,
		tick_rate = .Hz_30,
		on_started = on_started, // proc(s: ^State)
		on_update = on_update,
		on_draw = on_draw,
	)
}
```

- BeetPx allocates `State` zeroed (`new(S)`) and passes `^State` to each
  callback. Every callback is optional. `on_started` runs once, called by
  each platform (`_game_loop_start`) after its setup, before the first
  frame.
- The callbacks are stored as `proc(rawptr)` (via `transmute`), outside the
  framework state, since they point into the game's code.
- All other framework data is in `internal.State`, behind `internal.state()`.
  For now it is a static global, so the 256 KiB framebuffer still needs no
  allocation. For hot reload, `state()` would return a pointer that the
  host owns.
- Left as they were: the SDL renderer and texture in
  `beetpx/bpx/platform_sdl.odin`. Where they go depends on option A or B
  below.

Rejected alternative: keep `set_on_update` / `set_on_draw` and add only
`bpx.set_state(&s)`. Less churn, but the "all mutable state in `State`" rule
would be easy to break without noticing.

## Open design choice: where the platform code lives

- **A, as in Karl2D:** game, `bpx`, and the SDL code all in the library. The
  host only loads and reloads it. Least code, but every framework global,
  SDL handles included, must be in `internal.State`, and one forgotten
  global is a silent bug after a reload.
- **B, the host is the platform adapter:** the host is the SDL code (window,
  vsync, input, audio device, timing). The library has the game and the
  framework, without `vendor:sdl3`. The boundary is the braindump's
  data-only platform contract: input and elapsed time in, RGBA8 framebuffer
  and audio commands out. A proc table, filled statically in a release
  build, and by `dynlib.initialize_symbols` in the dev host. More work up
  front, but the contract gets real use, and a future console host would
  drive the same contract.

The leaning so far is **B**: the contract is still tiny (time in,
framebuffer out), so this is the cheapest moment to draw it. The state work
from step 1 is the same for both, so nothing is lost if A is picked.

## The spike

`spikes/hot_reload/` is a throwaway model of the reload loop. It is not part
of any check script. Run it with `spikes/hot_reload/run.sh` (Linux or
macOS; it builds into `spikes/hot_reload/out/`).

- `fw/` - a stand-in for `bpx`: one `fw.State`, `start($S, ...)`, and the
  restart guard with `shape_hash`. `FW_HOT` (`-define:FW_HOT=true`) makes
  `start` only record the callbacks instead of running frames.
- `game_v1/`, `game_v2/`, `game_v3/` - three versions of one game. v2 changes
  only code (`+100` instead of `+1`); v3 adds a state field.
- `hot/` - what the CLI would generate: a wrapper that imports `../game`,
  calls `game.main()` on every load, and exports `hot_*` procs.
  `run.sh` points the `game` symlink at each version in turn.
- `host/` - loads each library given as an argument, in turn, in one process,
  keeping the framework state, and runs 3 frames after each load.
  `--unload-old` unloads the previous library after loading the next one.

Expected output on Linux: "fw: game state kept" for v1 → v2, with the
counter going on from 3 by `+100`; "fw: game state changed, restarting" for
v2 → v3; then, in the `--unload-old` run, a segmentation fault (exit 139)
right after v1 → v2 (see finding 5).

## Findings (Linux, Odin `dev-2026-09-nightly:a2fb372`)

1. **A wrapper can import `package main`.** `import game "../game"` and
   `game.main()` work, so games keep a normal `main` for every target.
2. **`typeid` cannot tell two versions of `State` apart.** It stayed the
   same after renaming, reordering, and retyping fields. It changed only
   with the package name. So it is likely derived from the type's name.
3. **A reflection hash can.** `fw.shape_hash` walks `type_info_of(S)` (field
   names, offsets, types; through arrays, unions, enums; not through
   pointers) and hashes the text with FNV-64. It changed on each of the
   edits above, and stayed the same for code-only changes.
4. **Reload keeps state.** v1 → v2 kept the game state and the frame number,
   and v2's code ran on them. v2 → v3 restarted. Package globals in the
   library reset on every load, as expected.
5. **Old libraries must stay loaded.** With them unloaded, the host crashed
   right after v1 → v2, on a string literal that v1 had stored in the state.
   String literals, `@(rodata)` data, and proc values in the state all point
   into the library that made them.
6. **Odin bug: a library skips its runtime startup on Linux.** Odin passes
   `-Wl,-init,'_odin_entry_point'` to the linker as one argument with literal
   quotes (it runs the linker without a shell), so `ld` looks for a symbol
   whose name has quotes, and the library gets no `DT_INIT`. Then `@(init)`
   procs do not run, and `fmt` writes go nowhere (stdout is not set up).
   - Reproduce: build any package with `-build-mode:dll`, then
     `readelf -d <lib>.so | grep -E '\((INIT|FINI)\)'` prints nothing. Seen
     with `strace -f -e trace=execve odin build ...`. Linking the same
     objects by hand with `-Wl,-init,_odin_entry_point` gives `(INIT)`.
   - `src/linker.cpp` on Odin's `master` (2026-10-13) passes the flag without
     quotes, so a later release may have fixed it.
   - `-extra-linker-flags` cannot fix it: Odin's own flag comes later and
     wins.
   - Workaround in the spike: the library exports `hot_runtime_started()`
     (set by an `@(init)` proc), and the host calls `_odin_entry_point`
     itself when that returns `false`.

## Assumptions

- Desktop only. No state-preserving reload on the web.
- Games keep all mutable state in their `State`, not in package globals.
  Nothing enforces it; a global silently resets on reload.
- The planned CLI (`beetpx dev`) generates the wrapper package, builds the
  library, and copies each build to its own file name. `dlopen` returns the
  already loaded library for a path it has seen.
- Keeping every old library loaded until exit is fine for a dev session.
  Each one costs memory; not measured.
- A wrapper importing a `package main` stays allowed in future Odin versions.
  Nothing in the docs promises it.

## Doubts

- **macOS is not checked.** Neither the startup bug (6), nor reloading
  rebuilt `.dylib` files (code signing, caching), nor whether the host's
  `_odin_entry_point` lookup finds the symbol there.
- **The shape hash does not look through pointers.** A changed type behind a
  `^T`, a slice, or a map in `State` keeps the old hash. The new code then
  reads old data with the new layout. Going through pointers needs cycle
  detection. Maybe a documented rule is enough.
- **The shape hash prints some kinds by name only**, e.g. `bit_set`,
  `matrix`, `bit_field`. Not checked which of them would hide a layout
  change.
- **Allocators across the boundary.** In the spike both sides use the default
  heap allocator, `malloc` on both, so freeing across the boundary works. A
  tracking or custom allocator in the host would need to be passed into the
  library through `context`. Not tried.
- **`@(init)` procs run again on every load** (once the startup runs). Any
  side effect in them repeats.
- **Restart triggers beyond the state type:** a changed canvas size or tick
  rate also needs a restart, and a canvas size change needs the host to
  recreate the SDL texture. Not modeled in the spike.
- **`transmute` between `proc(^S)` and `proc(rawptr)`** in `bpx.start` relies
  on both having the same calling convention and argument passing. True
  today for the `odin` calling convention; not documented as a guarantee.
- **`new(S)` of an empty struct returns `nil`.** Callbacks then get a `nil`
  pointer. Harmless while the struct has no fields.

## Next exploratory steps

Steps 1 and 4 first: if macOS breaks or the loop is slow, the rest can wait.

1. **Run the spike on macOS.** Check for the "runtime startup did not run"
   line, and whether reloading rebuilt `.dylib` files works at all.
2. **Check a newer Odin release** for the startup bug. If it is still there,
   consider reporting it to Odin.
3. **Watch mode in the spike.** The host polls the library's mtime and
   reloads while running. Covers a half-written file (copy, then load) and a
   failed build (keep the old library).
4. **Measure the loop time.** How long `odin build -build-mode:dll` takes for
   ayp, from save to the new code running. Hot reload is worth it only if
   this is short.
5. **A real `bpx` in the library.** A `when` branch in `bpx.start` for hot
   builds, the shape hash and settings guard moved from `fw` into `bpx`, and
   ayp built through a wrapper. Shows what `-disable-non-constant-globals`
   and the other check flags say.
6. **Draw the platform contract (option B)** as a proc table that the release
   build fills statically and the dev host fills from the library. Then move
   the SDL handles out of `bpx` into the adapter.
7. **Allocators.** Pass the host's allocator (e.g. a tracking one) through
   `context` into the library, and see what leaks or double frees across
   reloads.
8. **A restart key** (e.g. F6) in the host, and restarts on a canvas size or
   tick rate change. The braindump makes restart a host-only system tool.
