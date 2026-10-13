# Native hot reload: findings so far

> A working note, not a decision. Written on 2026-10-13. Like every Markdown
> file here, it is updated only when the user asks for it.

The goal: on desktop, rebuild the game's code while it runs, and keep its
state. The web keeps "rebuild, then reload the page" (see the braindump).

## What is in place

- `bpx.start` takes the game's state type and its callbacks:
  `bpx.start(State, canvas_size, tick_rate, on_started, on_update, on_draw)`.
  BeetPx allocates `State` zeroed and passes `^State` to each callback.
- All of the framework's data is in one `internal.State`, behind
  `internal.state()`. The callbacks are kept out of it, since they point
  into the game's code. The SDL renderer and texture are still package
  globals in `platform_sdl.odin` (see "Open design choice" below).
- `spikes/hot_reload/` is a throwaway model of the reload loop, with a
  stand-in `fw` package in place of `bpx`. Run it with
  `spikes/hot_reload/run.sh`. It is not part of any check script.

## The model the spike tests

- **Host:** a long-lived exe. It owns the framework state and loads the
  game as a shared library (`hot_*` exports, read with
  `dynlib.initialize_symbols`).
- **Library:** a generated wrapper package that imports the game package and
  calls its `main` after every load. With `-define:FW_HOT=true`, `start`
  only records the callbacks and checks the game state; it does not run the
  loop.
- **Guard:** `start` keeps the old game state when its size and shape hash
  match. Otherwise it frees it, allocates a new one, and runs `on_started`
  again (a full restart).

`run.sh` builds three versions of a game (v2 changes only code, v3 adds a
state field) and loads them in turn in one host process: first keeping old
libraries loaded, then unloading them.

## Findings (Linux, Odin `dev-2026-09`)

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
   (`SIGSEGV`) right after v1 → v2, on a string literal that v1 had stored in
   the state. String literals, `@(rodata)` data and proc values in the state
   all point into the library that made them.
6. **Odin bug: a library skips its runtime startup on Linux.** Odin passes
   `-Wl,-init,'_odin_entry_point'` to the linker as one argument with literal
   quotes, so `ld` looks for a symbol whose name has quotes, and the library
   gets no `DT_INIT`. Then `@(init)` procs do not run, and `fmt` writes go
   nowhere (stdout is not set up). Odin's `master` passes it without quotes,
   so a later release may have fixed it. `-extra-linker-flags` cannot fix it:
   Odin's own (broken) flag comes later and wins. The spike works around it:
   the library exports `hot_runtime_started()`, and the host calls
   `_odin_entry_point` itself when that returns `false`.

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

- **macOS is not checked.** Neither the startup bug (6), nor `dlopen` and
  code signing behavior of rebuilt `.dylib` files, nor whether the
  `_odin_entry_point` lookup in the host finds the symbol there.
- **The shape hash does not look through pointers.** A changed type behind a
  `^T`, a slice, or a map in `State` keeps the old hash. The new code then
  reads old data with the new layout. Going through pointers needs cycle
  detection. Maybe a documented rule is enough.
- **The shape hash ignores some kinds**, e.g. it prints `bit_set`, `matrix`
  and `bit_field` types by name only. Not checked which of them would hide
  a layout change.
- **Allocators across the boundary.** In the spike both sides use the default
  heap allocator, which is `malloc` on both, so freeing across the boundary
  works. A tracking allocator, or a custom one, in the host would need to be
  passed into the library through `context`. Not tried.
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

## Open design choice

Where the platform code lives:

- **A:** everything, SDL code too, in the library. The host only reloads it.
  Least code, but every framework global, SDL handles included, must live in
  `internal.State`.
- **B:** the host is the SDL adapter, and the library has the game and the
  framework. The boundary is the braindump's data-only platform contract
  (input and time in, framebuffer and audio commands out). More work up
  front, but the contract gets real use and tests.

The leaning so far is B. The contract is still tiny (time in, framebuffer
out), so this is the cheapest moment to draw it.

## Next exploratory steps

1. **Run the spike on macOS.** Check the "runtime startup did not run" line,
   and whether reloading rebuilt `.dylib` files works at all.
2. **Check a newer Odin release** for the startup bug. If it is still there,
   consider reporting it to Odin.
3. **Watch mode in the spike.** The host polls the library's mtime and
   reloads while running. Covers a half-written file (copy, then load) and a
   failed build (keep the old library).
4. **Measure the loop time.** How long `odin build -build-mode:dll` takes for
   ayp, from save to the new code running. Hot reload is worth it only if
   this is short.
5. **A real `bpx` in the library.** A `when` branch in `bpx.start` for hot
   builds, the shape hash and settings guard moved into `bpx`, and `ayp`
   built through a wrapper. Shows what `-disable-non-constant-globals` and
   the other check flags say.
6. **Draw the platform contract (option B)** as a proc table that the release
   build fills statically and the dev host fills from the library. Then move
   the SDL handles out of `bpx` into the adapter.
7. **Allocators.** Pass the host's allocator (e.g. a tracking one) through
   `context` into the library, and see what leaks or double frees across
   reloads.
8. **A restart key** (e.g. F6) in the host, and restarts on a canvas size or
   tick rate change.
