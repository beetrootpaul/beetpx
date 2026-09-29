# State of the migration to Odin

A snapshot of where the Odin rewrite of BeetPx stands, so that AI assistants
do not have to re-derive it from the code at the start of every session. It
describes the present only. The intended direction is in
`rewrite_braindump.md`, a non-binding draft.

It records only what the code does not say on its own: intent, reasons, known
problems, and verification status. For details, read the files it points to.

Last updated: 2026-09-29.

## Summary

The engine opens a 64x64 canvas on the web (`js_wasm32`, Canvas2D) and on
desktop (SDL3). Of the desktop targets, only macOS (`darwin_arm64`) is built
and run; `linux_amd64` and `windows_amd64` are only type-checked. A
fixed-timestep loop at 30 ticks per second calls the game's update and draw
callbacks. Drawing writes into an RGBA8 framebuffer owned by the core, and each
platform only presents it. The only drawing operations are clearing the canvas
and drawing a single pixel. There is no input, audio, assets, persistence,
tests, or CLI yet.

## What exists

- **Package layout** (conventions are in `ai/AI.md`)
  - The engine lives in `beetpx_core/bpx/` so that games can write
    `bpx.start()` without an import alias.
  - All platform-specific code is in the `platform_*` files. Each defines the
    same names, so a platform that misses one fails to compile.
  - Every private `bpx` file has `#+vet unused-procedures`, so an unused
    private proc fails the build. `bpx.odin` does not, since games need not
    call every public proc.
- **Game loop** (`game_loop.odin`)
  - After at most 5 ticks in one host frame, the rest of the backlog is
    dropped rather than carried over, matching v0.56.1.
  - Ticks can land unevenly on host frames, which shows as stutter. Known and
    not fixed; the problem and a possible fix are in the braindump's "Tick
    spacing on host frames" section.
  - The first update sees `frame_number() == 1`.
- **Canvas and drawing** (`canvas.odin`, `draw.odin`, `xy.odin`)
  - All pixel writes go through the `_canvas_*` procs, and the platforms read
    the framebuffer only through `_canvas_rgba8_bytes`.
  - Coordinates are `f64` rather than `f32`, so that float values games
    declare with `:=`, which Odin types as `f64`, mix with them without casts.
  - `draw_pixel` takes float coordinates, as v0.56.1's `$d.pixel` does, and
    rounds them with `floor(x + 0.5)`. That matches JavaScript's `Math.round`
    (halves round up, so -1.5 becomes -1), except for a few values just below
    a half, such as 0.49999999999999994, which it rounds up.
  - There is no camera, clipping region, or drawing pattern yet.
- **Colors** (`color.odin`, `beetpx_core/palettes/`)
  - `_draw_pixel` still takes the public `Xy` instead of `_Xy`; every other
    private proc uses the private names.
  - `palettes/pico8.odin` uses v0.56.1's PICO-8 color names. It imports `bpx`
    by relative path (`"../bpx"`).
- **Web platform** (`platform_js.odin`, `beetpx_core/beetpx.js`)
  - The hosting page (`beetpx_examples/index.html`) holds no engine logic. The
    canvas's CSS size must not depend on its content, since the engine resizes
    its backing store to match it.
  - The `<canvas>` backing store follows its size in device pixels, so with
    `device-pixel-content-box` support the output is pixel perfect at any
    window size and browser zoom. Without it, the size is estimated from
    `devicePixelRatio`.
  - WebGL is not used.
- **Desktop platform** (`platform_sdl.odin`)
  - `HIGH_PIXEL_DENSITY` with `INTEGER_SCALE` presentation and a `NEAREST`
    texture makes it pixel perfect, also on Retina displays.
  - `start` blocks until the window is closed.
- **Example** (`beetpx_examples/basic/`) prints only every 10th frame number,
  because printing on every frame is the suspected cause of the browser dev
  tools lagging.
- **Scripts**
  - `beetpx_examples/basic/run_web.sh` and `run_macos.sh` build and run the
    example, vetting only its `main` package.
  - `scripts/check_core.sh` checks `bpx` and `palettes` for all four targets,
    with every vet flag the compiler offers.
  - `format_all.sh` runs `odinfmt`, which is not on PATH in this setup.

Runtime behavior is verified only when the user runs the scripts.

## Temporary shortcuts

Deliberate stopgaps, each marked with a `TODO` in the code:

- Draw calls can be made from anywhere, as flat `draw_*` procs in the facade.
  A dedicated draw API, callable only inside `draw`, is planned.
- The package structure of drawing and of the palettes is to be reworked.
- Logging uses `fmt`. A custom logger is planned.
- The WASM file name is hard-coded as `beetpx_game.wasm`, instead of being
  named after the game.
- The canvas element ID is hard-coded on both the Odin and the HTML side.
- The run scripts are Bash-only and are meant to be replaced by a BeetPx CLI.
- The PICO-8 palette defines only a few colors.
- The SDL3 calls have not yet been checked against the SDL3 docs or tuned.

## Open questions

Raised in `TODO`s in the code and not decided yet:

- Should `_accumulated_s` in `game_loop.odin` be a float?
- Should the canvas element ID be configurable, or checked at build time
  against the HTML page?
- Should `Rgb` become a union that can also be transparent? If not, should
  `color.odin` become `rgb.odin`, with `_Rgb` instead of `_Color_Rgb`?
- Should the `palettes` package also be `#+private file` and re-export its
  colors, as `bpx` does?
- Should `_round` in `draw.odin` be public? Should it get a more specific name?
- Should `frame_number` get a shorter name?

## Not started

Compared with v0.56.1: input, drawing primitives other than clear and pixel
(lines, rects, ellipses, pixels from a string), drawing patterns, camera and
clipping, canvas snapshots, sprites and assets, text and fonts, audio
(miniaudio on desktop), persistence, pause and debug features, tests
(`odin test`), the CLI, and native hot reload. Linux and Windows have no run
script and have never been built or run.

## Next steps

Not recorded yet. Ask the user rather than inferring them from the braindump.
