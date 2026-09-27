# State of the migration to Odin

A short snapshot of where the Odin rewrite of BeetPx stands right now. It
exists so that AI assistants do not have to re-derive it from the code and git
history at the start of every session. It describes the present, not the past:
history lives in git, and the intended direction lives in
`cross-platform-rewrite-llm-braindump.md`, which is a non-binding draft.

Last updated: 2026-09-28.

## Summary

The engine opens a 64x64 canvas on both targets, web (`js_wasm32`, Canvas2D)
and macOS (`darwin_arm64`, SDL3). It runs a fixed-timestep loop at 30 ticks
per second and calls the game's `update` and `draw` callbacks. Drawing writes
into an in-memory RGBA8 framebuffer owned by the core, which each platform
only presents. The only drawing operations are clearing the whole canvas and
drawing a single pixel. There is no input, audio, assets, persistence, tests,
or CLI yet.

## What exists

- **Package layout**
  - The engine is one `beetpx_core` package split into several files.
    Sub-packages (`palettes/`) hold only what games import directly.
  - `beetpx_core/bpx.odin` is the facade: it declares every public name of
    the package, and it is the only file without `#+private file`. Facade
    procs forward to private ones (`start` to `_platform_start`,
    `draw_pixel` to `_draw_pixel`). The public types `Xy` and `Rgb` are aliases of the
    package-private `_Xy` in `xy.odin` and `_Color_Rgb` in `color.odin`.
    Odin cannot make a single declaration public inside a `#+private file`
    file, so re-exporting through the facade is the only way out of it.
  - The private files are named by topic: `platform`, `game_loop`, `canvas`
    and `draw`. A `_darwin` or `_js` suffix marks the platform-specific half
    of a topic, which Odin compiles only for that target. A topic with only
    platform-specific files (`platform`) defines the same names in each
    platform file, so a platform missing one fails to compile. All
    platform-specific code lives in the `platform` files, so `game_loop.odin`
    is the only `game_loop` file.
  - Visibility is as narrow as possible by default (the rule is written
    down in `AI.md`, "Code conventions"):
    - Used only inside its own file: file-private (the `#+private file`
      default), with no topic prefix but still a leading `_`, e.g.
      `_TICK_HZ`, `_accumulated_s`.
    - Used by any other file: marked `@(private = "package")` and prefixed
      with the topic, e.g. `_game_loop_advance`, `_platform_start`,
      `_canvas_set`.
- **Game loop**
  - Games register callbacks with `set_on_update` and `set_on_draw`, then
    call `start`.
  - `beetpx_core/game_loop.odin` holds the file-private tick constants and
    time accumulator, and the shared `_game_loop_on_update` and
    `_game_loop_on_draw` callbacks (empty procs by default, as in v0.56.1's
    `GameLoop.ts`), `_game_loop_frame_number`, and `_game_loop_advance`. The
    platform code calls `_game_loop_advance` once per host frame, and
    `_game_loop_advance` calls `_platform_render` back once per call.
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
- **Canvas and drawing**
  - `beetpx_core/canvas.odin` holds the framebuffer: a file-private
    `[CANVAS_WIDTH * CANVAS_HEIGHT][4]u8` array of RGBA8 pixels, row by row
    from the top-left corner, as in v0.56.1's `CanvasForProduction.ts`. An
    `@(init)` proc sets every alpha byte to 255, so the canvas starts as
    opaque black, and every write keeps the alpha at 255.
  - Every drawing operation goes through the canvas procs, which share one
    color-to-pixel conversion: `_canvas_set` (one pixel, asserts it is inside
    the canvas), `_canvas_fill` (every pixel at once, with `slice.fill`), and
    `_canvas_can_set_at` (the bounds check for callers). The platforms read
    the framebuffer only through `_canvas_rgba8_bytes`.
  - `beetpx_core/draw.odin` holds the drawing operations, as v0.56.1's
    `DrawClear.ts` and `DrawPixel.ts`: `_draw_clear_canvas` fills the canvas,
    and `_draw_pixel` rounds its coordinates, then skips a pixel outside the
    canvas and sets it otherwise.
  - Coordinates are passed as `Xy :: [2]f64` rather than as a bare
    `[2]f64`. Engine-private procs use it too, by its public name. It is `f64` rather than
    `f32`, so that float values games declare with `:=`, which Odin types as
    `f64`, mix with it without casts.
  - The public `draw_pixel` takes float coordinates (`xy: Xy`), as
    v0.56.1's `$d.pixel` does. They are rounded to `int` with
    `floor(x + 0.5)`, which matches JavaScript's `Math.round` that v0.56.1
    used (halves round up, so -1.5 becomes -1), except for a few values just
    below a half, such as 0.49999999999999994, which it rounds up. There is
    no camera, clipping region, or drawing pattern yet.
- **Colors**
  - Colors are `Rgb :: [3]u8`, a public type declared in `color.odin` as
    `_Color_Rgb` and re-exported by `bpx.odin`. Engine-private procs use its
    public name.
  - The `beetpx_core/palettes/` package holds a partial PICO-8 palette in
    `pico8.odin`, using v0.56.1's color names. Games import it as
    `beetpx_core:palettes`. It imports `beetpx_core` by relative path
    (`"../"`) for `Rgb`.
- **Web platform** (`beetpx_core/*_js.odin` and `beetpx_core/beetpx.js`)
  - `platform_js.odin` declares two JavaScript procs in a `foreign import
    "beetpx"` block, and `beetpx.js`, the JavaScript half of the platform,
    implements them. Its `window.beetpx.runWasm(wasmPath)` passes them to
    `odin.runWasm` as extra foreign imports, together with a
    `WasmMemoryInterface` that lets them read the WASM memory. WebGL is not
    used.
  - The hosting page (`beetpx_examples/index.html`) holds no engine logic,
    as in v0.56.1: it loads `odin.js` and `beetpx.js`, calls
    `window.beetpx.runWasm`, and shows an error if that fails. It also lays
    out the `<canvas id="beetpx_canvas">` to fill the window below a line
    of text. The canvas's CSS size must not depend on its content, since
    the engine resizes its backing store.
  - `_platform_start` calls `init_canvas` with the element ID and the canvas
    size, then returns. `init_canvas` gets a transparent 2D context on the
    `<canvas>`, sets its CSS background to black, and creates a 64x64
    `OffscreenCanvas` with an opaque 2D context. A `ResizeObserver` keeps
    the `<canvas>` backing store at its size in device pixels, using
    `device-pixel-content-box` where the browser supports it, and CSS size
    times `devicePixelRatio` otherwise.
  - `_platform_render` calls `present_canvas`, which wraps the framebuffer
    bytes in an `ImageData` (a view on the WASM memory, not a copy),
    `putImageData`s it onto the offscreen canvas, and `drawImage`s that
    onto the `<canvas>` without smoothing. It uses the largest whole-number
    scale that fits, centered, with the math of v0.56.1's
    `CanvasForProduction.doRender`. The rest of the `<canvas>` stays
    transparent and shows the black background. With
    `device-pixel-content-box`, this is pixel perfect at any window size and
    browser zoom. v0.56.1 was not: its backing store was a fixed 256x256,
    stretched by CSS.
  - Odin's `odin.js` calls the runtime's exported `_start`, which runs the
    game's `main`. It then calls the `step` proc from `platform_js.odin` once
    per animation frame, and `step` passes the delta on to
    `_game_loop_advance`. `step` is `@(export)`ed to the WASM but file-private
    to Odin code, so neither games nor other engine files can call it.
- **macOS platform** (`beetpx_core/*_darwin.odin`)
  - `_platform_start` in `platform_darwin.odin` opens a resizable, high
    pixel density SDL3 window at 8x scale, with vsync and `INTEGER_SCALE`
    logical presentation, and creates a 64x64 streaming texture (`RGBA32`,
    `NEAREST` scaling). Together they make it pixel perfect: every canvas
    pixel is the same whole number of physical pixels, also on Retina
    displays, and the rest of the window is black bars. It then calls the
    file-private `_run_game_loop`, which runs the event and tick loop, so
    `start` blocks until the window is closed. Frame deltas are measured with
    `sdl.GetTicksNS()`. The renderer and the texture are file-private to
    `platform_darwin.odin`.
  - `_platform_render` uploads the framebuffer with `sdl.UpdateTexture`, clears
    the window (so the letterbox bars are black), draws the texture, and
    calls `sdl.RenderPresent`.
- **Example** (`beetpx_examples/basic/`)
  - Prints the frame number on every 10th update (10, 20, 30, ...), so it
    does not flood the browser console, which is the suspected cause of the
    dev tools lagging. It also switches the clear color every second (30
    frames), and marks three corners of the canvas with single pixels:
    yellow top-left, red top-right, black bottom-left.
- **Scripts** (in `beetpx_examples/basic/`, run for that example only)
  - `run_web.sh` builds the WASM, copies `odin.js`, `beetpx.js` and
    `index.html` into `build/web/` at the repository root, and serves it at
    http://127.0.0.1:8000.
  - `run_macos.sh` builds and runs the native binary in `build/macos/` at
    the repository root.

Both targets passed `odin check` on 2026-09-28 with `dev-2026-09`.
Runtime behavior is verified only when the user runs the scripts.

## Temporary shortcuts

Deliberate stopgaps, each marked with a `TODO` in the code:

- Draw calls can be made from anywhere, and they are flat `draw_*` procs in
  the facade. A dedicated `draw` sub-API that works only inside `draw` is
  planned (`TODO`s in `bpx.odin` and in the example).
- The package structure of drawing and of the palettes is meant to be
  reworked (`TODO`s in `draw.odin` and `pico8.odin`).
- `_draw_pixel`, `_canvas_can_set_at` and `_canvas_set` handle x and y
  separately instead of as one `Xy` (`TODO`s in `draw.odin` and
  `canvas.odin`).
- Logging uses `fmt.println`. A custom logger is planned.
- The WASM file name is hard-coded as `beetpx_game.wasm`, instead of being
  named after the game.
- The canvas element ID is hard-coded on both the Odin and the HTML side.
- The run scripts are Bash-only and are meant to be replaced by a BeetPx CLI.
- The PICO-8 palette defines only `pico8_black`, `pico8_storm`,
  `pico8_ember`, `pico8_lemon` and `pico8_lime`.
- The SDL3 calls have not yet been checked against the SDL3 docs or tuned.

## Open questions

Raised in code comments and not decided yet:

- Should `_accumulated_s` in `game_loop.odin` really be a float?
- Should the canvas element ID be configurable, or validated at build time
  against the HTML page?
- Should the canvas be made opaque by an explicit call, instead of by the
  less obvious `@(init)` proc in `canvas.odin`? And should that proc reuse
  `_canvas_fill`?
- Should `_canvas_set` reuse `_canvas_can_set_at` for its bounds check, and
  should it assert at all?
- Can the compiler be made to inline `_pixel_of` in `canvas.odin`, and is
  that the right approach at all?
- Should `Rgb` become a union that can also be transparent? If not, should
  `color.odin` become `rgb.odin`, with `_Rgb` instead of `_Color_Rgb`?
- Should the `palettes` package also be `#+private file` and re-export its
  colors, to match `beetpx_core`?
- Should `_round` in `draw.odin` be made public for reuse? And should it get
  a more specific name, since its `int` result is meant for indexing the
  framebuffer?
- Should `frame_number` get a shorter name?
- Should the `beetpx_core` collection be renamed to `beetpx`? (Asked in the
  example's `main.odin`.)

## Not started

Compared with the v0.56.1 engine: input, drawing primitives other than clear
and pixel (lines, rects, ellipses, pixels from a string), drawing patterns,
camera and clipping, canvas snapshots, sprites and assets, text and fonts,
audio (miniaudio on macOS), persistence, pause and debug features, tests
(`odin test`), the CLI, and native hot reload.

## Next steps

Not recorded yet. Ask the user rather than inferring them from the braindump.
