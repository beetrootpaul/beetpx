# BeetPx cross-platform rewrite

A non-binding design draft. Snippets show intended ergonomics, not final
spellings; where the code already decided something, the code wins.

## Why

BeetPx v0.56.1 is a browser-first TypeScript framework that depends directly
on browser APIs (DOM canvas, Web Audio, input, localStorage, HTML overlays).
The rewrite makes the runtime portable: the same game source runs in a
browser through WASM and natively on macOS, and a future console host only
needs a new platform adapter, not changes to games.

It is a from-scratch rewrite. The v0.56.1 package and its published games
stay unchanged; game API changes are kept small where portability allows.

## Licensing and contributions

- The rewrite uses zlib instead of MIT. zlib binds only source
  redistribution, so a shipped game binary carries no attribution
  obligation. SDL and raylib use it too.
- `README.md` reserves the "BeetPx" name and logo separately. That, not the
  code license, protects the project's identity.
- Adapter dependencies must be permissive enough for closed-source commercial
  games: SDL3 (zlib) and miniaudio (MIT-0 / public domain) are.
- Contributions are not solicited yet. With the first usable release, add a
  `CONTRIBUTING.md` requiring a DCO sign-off (`git commit -s`). DCO is about
  provenance, not relicensing; a CLA would add friction for almost no gain
  under zlib.

## Odin: consequences for the design

- **No nested namespaces.** Odin packages do not nest, so games get one
  short facade, `bpx`, with prefixed names (`bpx.d_pixel`) instead of
  `bpx.draw.pixel`.
- **No free check that drawing happens inside `draw`.** A separate drawing
  namespace gave that for free; the flat facade needs an explicit runtime
  check if the rewrite wants one.
- **Callbacks are passed explicitly**, since Odin cannot discover which
  procs a game defines.
- **Ambient allocators come for free.** The framework resets
  `context.temp_allocator` after each callback and documents it.
- **Weaker compile-time guarantees** than a comptime-heavy language, e.g. for
  typed asset IDs or save schemas.
- **No package manager or build graph**, so BeetPx ships its own CLI.
- **Native hot reload** (game as a swappable shared library) is in scope
  from the start on desktop. WASM has no `dlopen`, so the web keeps
  "rebuild, then reload".
- **Native vectors.** `[2]f64` has `.x`/`.y`, so no hand-written vector type.

`js_wasm32` is less battle-tested than other targets; budget extra time to
confirm that the web and native adapters behave the same.

## Architecture

Three layers with a one-way dependency: game → framework → adapter.

```text
GAME        Odin game code; imports only `beetpx:bpx`
  │  simple, stable bpx API
FRAMEWORK   lifecycle, framebuffer, audio commands, input state, assets,
            saves, timing; no DOM, SDL3, miniaudio, or vendor SDK
  │  narrow, data-only platform contract
ADAPTERS    browser (js_wasm32 + DOM) · desktop (SDL3 + miniaudio) · future
```

The platform contract is data only: lifecycle control, input snapshots,
fixed ticks, the finished RGBA8 framebuffer, bounded audio commands, and
opaque asset/save bytes. No platform objects, strings, JS values, or per-draw
calls cross it. Adapters translate platform events into it, but never add
game-visible behavior that differs by target. Keeping the contract small and
binary-friendly lets a future console host, possibly written in C/C++, drive
the same framework.

## Game API

- A game has a state struct and passes its lifecycle procs (`on_started`,
  `update`, `draw`, `deinit`) explicitly; unset ones are skipped.
- Lifecycle procs may return an error enum; an error stops the game safely
  with diagnostics.
- `bpx` is valid only on the callback path, not from other threads.
- `f64` vectors, rounding at the raster boundary, angles in turns
  (`0` right, `0.25` down), fixed 30 or 60 Hz ticks, and a deterministic
  `bpx` random family.
- Planned helpers: time (tick, delta, seconds), repeatable input actions,
  timers, animations, pause state, and pollable async handles. Async handles
  never call game code on their own; the game polls them from `update`.

Startup order: create state, preload boot assets and saves, get the web audio
gesture if needed, call `on_started`, then run ticks and draws.

## Rendering and simulation

- The framework owns one RGBA8 framebuffer at the chosen canvas preset.
  Colors are opaque RGB; nothing is alpha-blended, and PNG alpha is ignored
  at first.
- Drawing is immediate, not a deferred command queue, so canvas snapshots
  (e.g. color mapping based on what was drawn before) work.
- Adapters only present the framebuffer (Canvas2D, optionally WebGL2, SDL3
  texture). A failed GPU setup falls back to Canvas2D with a warning.
- Each host frame: poll input, accumulate time, run up to 5 catch-up ticks
  (drop the rest of the backlog), then draw and present once.
- `delta` is always the fixed tick duration; no interpolation at first.
- Goal: the same inputs and assets give byte-identical framebuffers on web
  and macOS. This needs cross-target checks of Odin's float codegen, and an
  injectable clock for tests.

### Tick spacing on host frames

A known, unfixed issue.

**Problem.** At 30 Hz ticks on a 60 Hz display, ticks should run every
second frame. But the accumulator sits almost exactly on the tick threshold
on those frames, so tiny jitter in the measured delta moves a tick one frame
earlier or later. Ticks then land 1, 2, or 3 frames apart, which shows as
stutter on anything moving 1 px per tick. Game time itself stays correct.

**Possible fix.** In `game_loop_advance`, snap a delta that is within
~0.5 ms of the display's frame interval (or a multiple of it) to that exact
value. Real hitches are not snapped, and the catch-up cap still applies.
SDL3 reports the refresh rate; the web has no API for it, so snap to common
rates or estimate from recent deltas. Variable refresh rate displays simply
fall back to today's behavior. Tyler Glaiel's article "How to make your game
run at 60fps" (2018) describes the technique; no code is taken from it.

**Testing.** Extract the "how many ticks for this delta" logic into a pure
proc and feed it synthetic delta sequences in `odin test`.

**Rejected.** Starting the accumulator at an offset works for one refresh
rate only. Interpolating in `draw` gives sub-pixel positions and forces games
to keep their previous state.

## Project, CLI, and platforms

- A standalone `beetpx` CLI: `beetpx dev|itch|macos|upgrade|doc|test`. It
  calls `odin build/test/doc` with the right flags and does the packaging
  (itch ZIP, universal macOS `.app`, optional signing and notarization).
- `beetpx.json` configures the game: stable dotted ID, title, canvas preset,
  tick rate, memory cap, assets, system tools, web template, hooks.
- `beetpx.lock.json` pins the SDK version and checksum. The CLI vendors the
  SDK into a git-ignored `.beetpx/` and passes it as the `beetpx` collection.
- Optional asset hooks (e.g. Aseprite, ffmpeg) are commands in
  `beetpx.json`; the SDK itself does not need Node.
- Web: custom DOM/JS around the WASM build, integer scaling, letterboxing,
  custom HTML templates (BeetPx owns the canvas and recognizes optional
  `data-beetpx-*` controls), touch controls, Web Audio, IndexedDB.
- macOS: SDL3 for window, input, and presentation; miniaudio for audio.
  Resizable, letterboxed windows.
- Canvas sizes come from framework presets only (square and 16:9), so
  templates can rely on the aspect ratio.
- An itch build is a self-contained static HTML ZIP.
- SemVer, with a long alpha/beta period before the first stable release.

Intended game project:

```text
my-game/
  beetpx.json  beetpx.lock.json  .beetpx/
  src/main.odin  src/game/...
  assets/assets.json  assets/...
  web/      # optional custom template
  scripts/  # optional asset hooks
```

### Native hot reload

Game code is a shared library loaded by a thin, long-lived host that owns
the window, audio, and input. All game state lives in one struct owned by
the host. `beetpx dev` reloads the library when it changes and may call a
`game_hot_reloaded` hook. Changed assets can be swapped in on both platforms.

## Runtime features

- **Assets** are declared in groups. Boot assets preload; other groups load
  through pollable handles and are released explicitly. Using a missing
  asset is a no-op with a rate-limited warning. PNG, bitmap fonts, WAV/MP3,
  and opaque data; no remote loading at first.
- **Audio:** music as typed descriptors (layers, intro, loop) mixed into one
  stream; a small priority-based voice budget (2 music, 2 UI, 8 SFX);
  no framework volume control. On the web, audio games show a Play overlay
  to get the user gesture.
- **Input:** up to 64 named actions bound to keyboard, touch, pointer, and
  gamepad, defined in Odin code; all controllers act as one player.
- **System tools** (pause, restart, screenshots) configured per development
  and release build. Pause is game-callable; restart is host-only.
- **Screenshots** to a gallery on the web, to a folder on macOS. A GIF/MP4
  replay is reserved for later.

## Persistence, docs, and testing

- **Saves:** declared, versioned binary schemas, up to 256 KiB per slot.
  Migration between versions is explicit game code over a union of schema
  versions. Web saves use IndexedDB, falling back to localStorage.
- **Docs:** `odin doc` for the API, plus written guides.
- **Tests:** `odin test` with deterministic replay fixtures that compare
  framebuffer hashes across web and macOS, plus adapter-level tests and
  readable ASCII/PNG frame dumps for debugging.

## Phased build-out

0. Workspace and toolchain set up; v0.56.1 parked for reference.
1. Portable framework proof: loop, input, clear, pixel, framebuffer, test
   clock; a test asserts exact framebuffer bytes.
2. Browser proof: WASM build and a minimal web adapter running a tiny
   example.
3. macOS proof: SDL3 adapter running the same example, with byte-identical
   output.
4. Port features one family at a time (primitives, camera and clipping,
   sprites, text, snapshots, assets, audio, saves, pause and debug), with
   golden tests, and keep a v0.56.1 → rewrite API mapping document.
5. Productize: CLI and project generator, release packaging, docs,
   `CONTRIBUTING.md`, and a published-SDK consumer fixture.

## Non-goals

- No JavaScript engine on native targets.
- No per-draw-call JS↔WASM boundary.
- No console port before official SDK access.
- No GPU command renderer; the RGBA framebuffer is canonical.
- No state-preserving hot reload on the web.
- No changes to existing v0.56.1 games.
- Signing, notarization, Windows/Linux distribution, and console
  certification come after the core is proven.
