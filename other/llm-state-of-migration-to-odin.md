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

- **Package layout**
  - The engine is one `beetpx_core` package split into several files.
    Sub-packages (`color/`) hold only what games import directly.
  - `beetpx_core/bpx.odin` is the facade: it holds every public declaration
    of the package, and nothing else in the package is public. Every other
    file starts with `#+private file`, so games cannot reach it. Facade procs
    forward to private ones (`start` to `_core_start`, `draw_clear_canvas`
    to `_draw_clear_canvas`).
  - The private files are named by topic: `core`, `game_loop` and `draw`. A
    `_darwin` or `_js` suffix marks the platform-specific half of a topic,
    which Odin compiles only for that target. A topic with only
    platform-specific files (`core`, `draw`) defines the same names in each
    platform file, so a platform missing one fails to compile.
  - Visibility is as narrow as possible by default (the rule is written
    down in `AI.md`, "Code conventions"):
    - Used only inside its own file: file-private (the `#+private file`
      default), with no topic prefix but still a leading `_`, e.g.
      `_TICK_HZ`, `_accumulated_s`.
    - Used by any other file: marked `@(private = "package")` and prefixed
      with the topic, e.g. `_game_loop_advance`, `_core_start`,
      `_draw_clear_canvas`.
- **Game loop**
  - Games register callbacks with `set_on_update` and `set_on_draw`, then
    call `start`.
  - `beetpx_core/game_loop.odin` holds the file-private tick constants and
    time accumulator, and the shared `_game_loop_on_update` and
    `_game_loop_on_draw` callbacks (empty procs by default, as in v0.56.1's
    `GameLoop.ts`), `_game_loop_frame_number`, and `_game_loop_advance`. The
    platform code calls `_game_loop_advance` once per host frame.
  - `_game_loop_advance(delta_s)` accumulates real time, runs at most
    `_MAX_CATCHUP_TICKS` (5) updates, then draws and renders exactly once.
    If the cap is hit, the rest of the backlog is dropped (the accumulator is
    reset to 0), as in v0.56.1's `GameLoop.ts`.
  - Ticks can land unevenly on host frames, which shows as stutter. This is
    known and not fixed; the problem and a possible fix are written up in the
    braindump's "Tick spacing on host frames" section.
  - Games read the frame number through the `frame_number()` proc, so they
    cannot change it. It is incremented right before each `on_update`, so the
    first update sees `1`.
  - Canvas size (64x64, public) and tick rate (30 Hz, private) are
    compile-time constants.
- **Colors** (`beetpx_core/color/`)
  - `color.Rgb :: [3]u8`, plus a partial PICO-8 palette in
    `palettes/pico8.odin`.
- **Web platform** (`beetpx_core/*_js.odin`)
  - `_core_start` in `core_js.odin` creates a WebGL context on the
    `<canvas id="beetpx_canvas">` from `beetpx_examples/index.html`, then
    returns. The page scales the canvas to 512x512 CSS pixels with
    `image-rendering: pixelated`. `_core_render`, in the same file, ends
    each frame with `gl.Flush()`.
  - Odin's `odin.js` calls the runtime's exported `_start`, which runs the
    game's `main`. It then calls the `step` proc from `game_loop_js.odin` once
    per animation frame, and `step` passes the delta on to
    `_game_loop_advance`. `step` is `@(export)`ed to the WASM but file-private
    to Odin code, so neither games nor other engine files can call it.
- **macOS platform** (`beetpx_core/*_darwin.odin`)
  - `_core_start` in `core_darwin.odin` opens a resizable SDL3 window at 8x
    scale, with letterboxed logical presentation and vsync. It then calls
    `_game_loop_run` in `game_loop_darwin.odin`, which runs the event and
    tick loop, so `start` blocks until the window is closed. Frame deltas are
    measured with `sdl.GetTicksNS()`. The SDL renderer is kept in
    `_core_sdl_renderer`. `_core_render`, in the same file, shows each
    frame with `sdl.RenderPresent`.
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

- `draw_clear_canvas` is implemented per platform, as `_draw_clear_canvas`
  in `draw_darwin.odin` and `draw_js.odin`, and calls the SDL renderer or
  WebGL directly. It is meant to move into the core and draw pixel by pixel;
  WebGL is not meant to be used for drawing at all.
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

- Should `_accumulated_s` in `game_loop.odin` really be a float?
- Should the canvas element ID be configurable, or validated at build time
  against the HTML page?

## Not started

Compared with the v0.56.1 engine: an in-memory framebuffer and pixel-level
drawing, input, drawing primitives, camera and clipping, sprites and assets,
text and fonts, audio (miniaudio on macOS), persistence, pause and debug
features, tests (`odin test`), the CLI, and native hot reload.

## Next steps

Not recorded yet. Ask the user rather than inferring them from the braindump.
