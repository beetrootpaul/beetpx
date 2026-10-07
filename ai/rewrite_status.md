# State of the migration to Odin

A snapshot of where the Odin rewrite stands, recording only what the code does
not say on its own: intent, reasons, known problems, and verification status.
The intended direction is in `rewrite_braindump.md`, a non-binding draft.

Last updated: 2026-10-08.

## Summary

A canvas runs on the web (`js_wasm32`, Canvas2D) and on macOS (SDL3).
A fixed-timestep loop calls the game's update and draw callbacks. Each game
picks the canvas size (64, 128, or 256 px square) and the tick rate (30 or
60 Hz) in its `start` call. The only drawing operations are clearing the
canvas and drawing a pixel. There is no input, audio, assets, persistence,
or CLI yet. Only `ping_pong` has tests. PICO-8 is the only built-in palette.

Runtime behavior is verified only when the user runs the scripts.

Tests sit next to the code as `*.test.odin` files (conventions in `AI.md`).
Colocated files were chosen over a separate test package, so that tests can
reach package-private code.

## Design notes

- **Packages.** Games import only `beetpx:bpx`; the code lives in the other
  packages under `beetpx/` and `bpx` re-exports it. This gives games a single,
  short import while keeping the engine split by topic.
- **Rendering.** Drawing writes into an RGBA8 framebuffer in `internal`; each
  platform only presents it, pixel perfect at whole-number scales (also on
  Retina and at any browser zoom).
- **Coordinates** are `f64`, so that float values games declare with `:=` mix
  with them without casts. They are rounded to pixels with halves rounded up.
  Whole-pixel values, such as the canvas size, use the public `Xy_Int`.
- **Palettes** are exposed mainly as number-indexed arrays, since many
  palettes have no natural color names; named constants are an extra where
  names exist. `bpx` re-exports each array as an `@(rodata)` variable, because
  a constant array cannot be indexed at run time or sliced. The cost is that
  the compiler does not reject writes: on macOS a write crashes, and on the
  web it probably goes through silently (not verified). A plain mutable
  global was rejected for allowing writes without any crash.
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
- **Platforms.** `core/platform_js.odin` and `core/platform_sdl.odin` define
  the same names, so a platform that misses one fails to compile. On desktop,
  `start` blocks until the window is closed.

## Known problems

- Ticks can land unevenly on host frames, which shows as stutter. See the
  braindump's "Tick spacing on host frames" section.
- The check scripts run `odin check` single-threaded to avoid an intermittent
  crash of the compiler.
- Tests run on the host only, never on `js_wasm32`, because `core:testing`
  does not compile there.

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
  and `nodemon` because it needs Node.js. Not yet verified by running it.
- The SDL3 calls have not been checked against the SDL3 docs yet.
- On macOS, the initial window size is based on the primary display, not
  the one the window opens on. Not yet verified by running it.

Smaller open questions are left as `TODO`s in the code.

## Not started

Input, drawing primitives beyond clear and pixel, camera and clipping,
sprites and assets, text, audio, persistence, pause and debug features,
tests beyond `ping_pong`, the CLI, native hot reload, and Linux and Windows
builds.

## Next steps

Not recorded. Ask the user rather than inferring them from the braindump.
