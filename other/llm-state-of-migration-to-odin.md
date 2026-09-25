# State of the migration to Odin

A short snapshot of where the Odin rewrite of BeetPx stands right now. It
exists so that AI assistants do not have to re-derive it from the code and git
history at the start of every session. It describes the present, not the past:
history lives in git, and the intended direction lives in
`cross-platform-rewrite-llm-braindump.md`, which is a non-binding draft.

Last updated: 2026-09-26.

## Summary

The engine opens a 64x64 canvas on both targets, web (`js_wasm32`, WebGL) and
macOS (`darwin_arm64`, SDL3). It runs a fixed-timestep loop at 30 ticks per
second and calls the game's `update` and `draw` callbacks. The only drawing
operation is clearing the whole canvas to one color, and each platform
implements it separately instead of the core. There is no framebuffer, input,
audio, assets, persistence, tests, or CLI yet.

## What exists

- **Game loop** (`beetpx_core/core.odin`)
  - The game registers callbacks with `set_on_update` and `set_on_draw`, then
    calls `start`.
  - `_advance(delta_s)` accumulates real time, runs at most
    `MAX_CATCHUP_TICKS` (5) updates, then draws and presents exactly once.
    If the cap is hit, the rest of the backlog is dropped (the accumulator is
    reset to 0), as in v0.56.1's `GameLoop.ts`.
  - Ticks can land unevenly on host frames, which shows as stutter. This is
    known and not fixed; the problem and a possible fix are written up in the
    braindump's "Tick spacing on host frames" section.
  - `frame_number` is incremented right before each `on_update`, so the first
    update sees `1`.
  - Canvas size (64x64) and tick rate (30 Hz) are compile-time constants.
- **Colors** (`beetpx_core/color/`)
  - `color.Rgb :: [3]u8`, plus a partial PICO-8 palette in
    `palettes/pico8.odin`.
- **Web platform** (`beetpx_core/platform_js.odin`)
  - Creates a WebGL context on the `<canvas id="beetpx_canvas">` from
    `beetpx_examples/index.html`. The page scales the canvas to 512x512 CSS
    pixels with `image-rendering: pixelated`.
  - The exported `step` proc is called once per animation frame by Odin's
    `odin.js`, and passes the delta on to `_advance`.
- **macOS platform** (`beetpx_core/platform_darwin.odin`)
  - Opens a resizable SDL3 window at 8x scale, with letterboxed logical
    presentation and vsync, and runs its own event and tick loop. `start`
    blocks until the window is closed. Frame deltas are measured with
    `sdl.GetTicksNS()`.
- **Example** (`beetpx_examples/basic/`)
  - Prints the frame number on every update and switches the clear color
    every second (30 frames).
- **Scripts**
  - `scripts/run_web.sh` builds the WASM, copies `odin.js` and `index.html`
    into `build/web/`, and serves it at http://127.0.0.1:8000.
  - `scripts/run_macos.sh` builds and runs the native binary in
    `build/macos/`.

Both targets passed `odin check` on 2026-09-26 with `dev-2026-09`. Runtime
behavior is verified only when the user runs the scripts.

## Temporary shortcuts

Deliberate stopgaps, each marked with a `TODO` in the code:

- `draw_clear_canvas` lives in the platform files and calls the SDL renderer
  or WebGL directly. It is meant to move into the core and draw pixel by
  pixel; WebGL is not meant to be used for drawing at all.
- Draw calls can be made from anywhere. A dedicated draw API that works only
  inside `draw` is planned.
- Logging uses `fmt.println`. A custom logger is planned.
- The WASM file name is hard-coded as `beetpx_game.wasm`, instead of being
  named after the game.
- The canvas element ID is hard-coded on both the Odin and the HTML side.
- The run scripts are Bash-only and are meant to be replaced by a BeetPx CLI.
- The PICO-8 palette defines only `pico8_storm` and `pico8_lime`.
- The SDL3 calls have not yet been checked against the SDL3 docs or tuned.

## Open questions

Raised in code comments and not decided yet:

- Should `_accumulated_s` really be a float?
- Should the canvas element ID be configurable, or validated at build time
  against the HTML page?

## Not started

Compared with the v0.56.1 engine: an in-memory framebuffer and pixel-level
drawing, input, drawing primitives, camera and clipping, sprites and assets,
text and fonts, audio (miniaudio on macOS), persistence, pause and debug
features, tests (`odin test`), the CLI, and native hot reload.

## Next steps

Not recorded yet. Ask the user rather than inferring them from the braindump.
