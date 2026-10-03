# State of the migration to Odin

A snapshot of where the Odin rewrite stands, recording only what the code does
not say on its own: intent, reasons, known problems, and verification status.
The intended direction is in `rewrite_braindump.md`, a non-binding draft.

Last updated: 2026-10-03.

## Summary

A 64x64 canvas runs on the web (`js_wasm32`, Canvas2D) and on macOS (SDL3).
A fixed-timestep loop calls the game's update and draw callbacks. The only
drawing operations are clearing the canvas and drawing a pixel. There is no
input, audio, assets, persistence, or CLI yet. Only `ping_pong` has tests.

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
- **Platforms.** `core/platform_js.odin` and `core/platform_sdl.odin` define
  the same names, so a platform that misses one fails to compile. On desktop,
  `start` blocks until the window is closed.

## Known problems

- Ticks can land unevenly on host frames, which shows as stutter. See the
  braindump's "Tick spacing on host frames" section.
- The check scripts run `odin check` single-threaded to avoid an intermittent
  crash of the compiler.
- The `--watch` mode of the check and test scripts works on macOS only.
- Tests run on the host only, never on `js_wasm32`, because `core:testing`
  does not compile there.

## Temporary shortcuts

- Draw calls are not restricted to `on_draw`.
- Logging uses `fmt`; a custom logger is planned.
- The WASM file name and the canvas element ID are hard-coded.
- The scripts are Bash-only and meant to be replaced by a BeetPx CLI.
- The PICO-8 palette defines only a few colors.
- The SDL3 calls have not been checked against the SDL3 docs yet.

Smaller open questions are left as `TODO`s in the code.

## Not started

Input, drawing primitives beyond clear and pixel, camera and clipping,
sprites and assets, text, audio, persistence, pause and debug features,
tests beyond `ping_pong`, the CLI, native hot reload, and Linux and Windows
builds.

## Next steps

Not recorded. Ask the user rather than inferring them from the braindump.
