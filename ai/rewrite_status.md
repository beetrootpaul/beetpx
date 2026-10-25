# State of the migration to Odin

> **This file may be outdated.** It is updated only when the user asks for it,
> not along with every change to the code. Where it disagrees with the code,
> trust the code. `AI.md` shows how to list the changes it may not cover yet.

A snapshot of where the Odin rewrite stands, recording only what the code does
not say on its own: intent, reasons, known problems, and verification status.
The intended direction is in `rewrite_braindump.md`, a non-binding draft.

Last updated: 2026-10-25.

## Summary

A canvas runs on the web (`js_wasm32`, Canvas2D) and on macOS (SDL3).
A fixed-timestep loop calls the game's tick and draw callbacks. Each game
picks the canvas size (64, 128, or 256 px square) and the tick rate (30 or
60 Hz) in its `start` call. Drawing covers clearing the canvas, pixels,
rectangles, and filled rectangles, all offset by a camera position. A tick
counter and a first version of a timer built on it exist, but nothing uses
the timer yet. Input covers four direction buttons, bound to the arrow keys
only, which games poll with `pressed` and `just_pressed`. There is no audio,
sprites or other assets, text, persistence, or CLI yet. Only `u_ping_pong`,
`u_round`, and the button state have tests. PICO-8 is the only built-in
palette.

Runtime behavior is verified only when the user runs the scripts.

Tests sit next to the code as `*.test.odin` files that start with `#+test`
(conventions in `AI.md`). Colocated files were chosen so that tests can reach
package-private code. A separate test tree was tried, to keep test procs out
of the `odin doc` output, and rejected, since it limited tests to the public
API. `#+test` keeps the tests out of `odin doc` and of every non-test build
as well: verified on 2026-10-22 with `odin doc` on `bpx`, and with a check
for `js_wasm32` of a package whose test file imports `core:testing`.

## Design notes

- **Packages.** Games import `beetpx:bpx` (the main API) and `beetpx:bpxd`
  (drawing); `internal` holds what both of them share, such as the canvas.
  The public API is declared directly in `bpx` and `bpxd`. Re-exporting it
  from other packages through constant aliases was dropped, because
  `odin doc` (see `scripts/doc.sh`) does not show the documenting comments
  of the aliased declarations. Whether palettes deserve their own package is
  an open `TODO`.
- **Rendering.** Drawing writes into an RGBA8 framebuffer in `internal`; each
  platform only presents it, pixel perfect at whole-number scales (also on
  Retina and at any browser zoom).
- **Coordinates** are `f64`, so that float values games declare with `:=` mix
  with them without casts. They are rounded to pixels with halves rounded up.
  Whole-pixel values, such as the canvas size, use the public `Xy_Int`.
  `f32`, common in Odin game libraries (e.g. raylib, SDL3, Karl2D), was
  rejected. Those libraries use it for GPU vertex data, while BeetPx rounds
  coordinates into a CPU framebuffer, so `f32` would save nothing there.
- **Palettes** are exposed mainly as number-indexed arrays, since many
  palettes have no natural color names; named constants are an extra where
  names exist. Each array is an `@(rodata)` variable, because a constant
  array cannot be indexed at run time or sliced. The cost is that the
  compiler does not reject writes: on macOS a write crashes, and on the web
  it probably goes through silently (not verified). A plain mutable global
  was rejected for allowing writes without any crash.
- **Start settings.** The canvas size and the tick rate are required
  parameters of `start`, picked from enums, because both shape how a game is
  written and should be visible in its code. A settings struct was rejected,
  since Odin cannot require its fields: a missing one silently becomes the
  first enum member. The enums map to numbers with a `switch` that lists
  every member: Odin then rejects a new member that is not mapped, even
  though the `switch` also has a default case (checked on 2026-10-08). The
  canvas size maps to a width and a height, not a single side, to allow
  non-square canvases later.
- **Framebuffer.** Since the canvas size is known only at run time, the
  framebuffer is a static array sized for the largest canvas, so that it
  needs no allocation. Smaller canvases leave most of it unused.
- **Settings at compile time** were deferred, not rejected. The idea: a
  `beetpx.json` read by the planned CLI, passed to the build as `-define`s
  for `#config` constants. Games could then use the canvas size in constant
  expressions, and an `#assert` could enforce the presets. Tried in a
  scratch program on 2026-10-07: it works on macOS and type-checks for
  `js_wasm32`. Its cost is that every build, check, and test command needs
  the same flags, so it waits for the CLI. Embedding `beetpx.json` with
  `#load` and parsing it at run time also works, but a misspelled key or an
  unknown value silently falls back to the zero value.
- **Buttons.** `pressed` still reports a button that went down and back up
  between two ticks, so that a short tap is not lost.
- **Platforms.** `bpx/platform_js.odin` and `bpx/platform_sdl.odin` define
  the same names, so a platform that misses one fails to compile. On desktop,
  `start` blocks until the window is closed.

## Known problems

- Ticks can land unevenly on host frames, which shows as stutter. See the
  braindump's "Tick spacing on host frames" section.
- The scripts run the compiler single-threaded to avoid an intermittent
  crash of its checker.
- Tests run and are linted on the host only, never on `js_wasm32`, because
  `core:testing` does not compile there. `odin check` skips `#+test` files,
  and a test build cannot be linked for another target, so `scripts/test.sh`
  lints them while building them, instead of `scripts/check.sh`.

## Temporary shortcuts

- Draw calls are not restricted to `on_draw`.
- Logging uses `fmt`; a custom logger is planned.
- The WASM file name and the canvas element ID are hard-coded.
- The scripts are Bash-only and meant to be replaced by a BeetPx CLI.
- The scripts' `--watch` delegates to `watchexec` (Apache-2.0; a developer
  tool, never shipped in games), which each developer installs on their own.
  It replaced a hand-written polling loop that each script repeated and that
  worked on macOS only. `watch`/`hwatch` were rejected because they re-run on
  a timer rather than on changes, `entr` because it does not run on Windows,
  and `nodemon` because it needs Node.js. In daily use on macOS, working
  well (as of 2026-10-22).
- The SDL3 calls have not been checked against the SDL3 docs yet.
- On macOS, the initial window size is based on the primary display, not
  the one the window opens on. Not yet verified by running it.

Smaller open questions are left as `TODO`s in the code.

## Not started

The `O`, `X`, and `Menu` buttons, key remapping, input other than the
keyboard, sprites and assets, text, audio, persistence, clipping regions,
pause and debug features, tests of drawing, the camera, and the timer, the
CLI, native hot reload, and Linux and Windows builds.

## Next steps

Not recorded. Ask the user rather than inferring them from the braindump.
