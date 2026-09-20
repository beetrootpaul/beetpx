# BeetPx cross-platform rewrite

Snippets in this document express intended ergonomics and semantics, not
final, copy-paste-stable symbol spellings. Before an API is released, choose
its exact Odin syntax once, document it, and preserve it within this
rewrite's compatibility promise.

## Why

BeetPx (currently v0.56.1) is a browser-first TypeScript framework with an
excellent Vite-based development loop. Its core rendering ultimately draws
pixels, but the framework currently directly depends on browser APIs: DOM
canvas, Web Audio, browser input, localStorage, fullscreen, and HTML
overlays.

The cross-platform rewrite makes a game's runtime portable: the same
game/framework source runs in a browser through WASM and natively on macOS.
A future Switch host should require implementing a platform adapter against
Nintendo's SDK — not rewriting individual games.

This is a from-scratch rewrite of the runtime. Preserve the current
(v0.56.1) package and already-published games unchanged; minimize game API
changes where they do not conflict with portability.

## Repository state and migration approach

Develop the rewrite on its own branch, separate from the current mainline.
The current (v0.56.1) material is parked under `../v0.56.1-for-reference/` so
developers and future LLM sessions can inspect and run its behavior while
porting it:

```text
v0.56.1-for-reference/
  beetpx/                         current source, CLI, dist, docs, tests, playground
  beetpx-examples/                current example games
  beetpx-npm-init-game/           current create-game generator and template
```

`../v0.56.1-for-reference/beetpx-examples/` and
`../v0.56.1-for-reference/beetpx-npm-init-game/` are plain snapshots — no
`.git`, no history, no `node_modules`/`dist`/`.beetpx` build output. Their
original repositories remain the source of truth for that history. Do not
delete or change the existing public repositories/packages until the rewrite
is verified and released, and do not modify external published games as part
of the rewrite's bootstrap.

`../v0.56.1-for-reference/beetpx/` still carries its own `.gitignore`,
`.husky/`, and `pre_commit_hook.sh`. Those hooks no longer fire from the
repository root, which is fine — it's reference material, not an actively
committed project.

### Licensing and contributions

The rewrite is released under the zlib license (root `LICENSE`), rather than
the MIT license the current (v0.56.1) line uses. zlib binds only source
redistribution: a game shipped as a WASM or macOS binary carries no
attribution obligation at all, which removes a term jam authors would
otherwise routinely violate. It is also the prevailing convention for game
frameworks — SDL and raylib both use it. The current (v0.56.1) line stays MIT
where it is published, and the snapshots under `../v0.56.1-for-reference/`
keep their own `LICENSE` files unchanged.

The zlib grant covers code only. `README.md` separately reserves the "BeetPx"
name and logo, explicitly permitting "built with BeetPx" phrasing while asking
that forks and derived frameworks not reuse the name or branding. Trademark is
the instrument that preserves credit and identity under a permissive code
license; the license itself is not.

Adapter dependencies must stay permissive enough to ship inside a
closed-source commercial game. SDL3 (zlib) and miniaudio (dual MIT-0 / public
domain) satisfy this; copyleft dependencies do not and are out of scope.

Contributions are not solicited during prerelease development, and there is no
`CONTRIBUTING.md` yet. Add one as part of Phase 5, when the first ready-to-use
release is prepared and outside contributors realistically start showing up.
It should require a Developer Certificate of Origin sign-off — contributors
add a `Signed-off-by` trailer via `git commit -s`, ideally enforced by an
automated check on pull requests.

The reason for DCO is provenance, not relicensing: it produces a written
affirmation that the contributor is entitled to submit the code under zlib,
which is the guard against code copied out of another engine or LLM output
reproducing a copyleft implementation. A CLA would be the wrong instrument
here. Under zlib, contributed code can already be shipped in binary and
commercial form without any further grant, so the heavier process would buy
almost nothing while deterring the small drive-by fixes that make up most
contributions to a framework this size.

## Language and runtime: Odin

The rewrite is an Odin-native pixel-game framework with a small, flat
`bpx.*` façade and a deterministic, platform-independent runtime. Browser and
macOS platform adapters host that runtime; the macOS adapter uses SDL3 and
miniaudio internally. It prioritizes web/itch.io while providing universal
macOS `.app` ZIP builds.

Design consequences of building on Odin rather than a comptime-heavy
language like Zig:

- **No single dot-chained facade.** Odin packages don't nest as struct
  fields, so `bpx.draw.sprite(...)` becomes a flat, prefixed call in one
  `beetpx` package: `bpx.draw_sprite(...)`. This preserves "game imports only
  one thing" at the cost of nested-namespace readability.
- **No implicit callback discovery.** Odin has no compile-time duck-typing
  over arbitrary declarations, so `bpx.run` cannot discover which optional
  lifecycle methods a game type happens to implement. Instead the game passes
  its callbacks explicitly as procedure values in a config struct. Slightly
  more ceremony at the call site; fully explicit, which is arguably more in
  the spirit of "no hidden control flow."
- **Ambient allocators come for free.** Odin's `context.allocator` and
  `context.temp_allocator` are native ambient state every procedure receives
  implicitly. No bespoke memory-scoping facade is needed — the framework
  calls `free_all(context.temp_allocator)` after each callback and documents
  that convention.
- **Weaker compile-time enforcement than a full-comptime language.** Odin's
  parametric polymorphism and `when` cover a good deal of ground, but nothing
  like full comptime execution. Compile-time-checked save-schema versioning,
  typed asset IDs generated from `assets.json`, and validated input maps are
  all still achievable, but rely on more hand-written scaffolding and carry
  weaker static guarantees than a comptime-based design could claim.
- **No package manager, no programmable build graph.** There is no Odin
  equivalent of a content-hash-pinned dependency manifest or a build-system
  command runner. BeetPx ships and versions its own standalone CLI rather
  than being a thin layer over toolchain features.
- **Native hot-reload is a first-class desktop capability from the start.** Odin has a
  well-established community pattern for state-preserving native hot reload
  (thin platform host + game code as a swappable shared library), so this is
  in scope for the initial release rather than deferred. It does not extend
  to the browser target — WASM has no `dlopen` equivalent, so the web adapter
  keeps a "rebuild, then explicit reload" flow.
- **Native vector ergonomics.** Odin's fixed-size arrays support
  `.x`/`.y`/`.z`/`.w` component access natively (`v: [2]f64; v.x`), so
  `bpx.Vec2` needs no hand-written struct.

One caveat: the browser adapter's `js_wasm32` target is less traveled than
some alternatives, though Odin does ship a first-party `vendor:wasm/js`-style
binding layer intended for exactly this hand-rolled-DOM-glue style, which
fits this architecture's "no Emscripten, no engine baggage" preference
reasonably well. Treat it as workable but less battle-tested, and budget
extra spike time to confirm Canvas2D/WebGL2 presentation and Web Audio
scheduling behave identically to the native adapter.

## Architecture and layer boundaries

Three layers, one-way dependency direction, and a narrow, data-only
framework-to-adapter contract. The framework is the stable boundary game
authors target; a platform adapter is replaceable plumbing below it. SDL3,
miniaudio, DOM/Web APIs, Canvas2D, WebGL2, and future console SDKs must never
leak upward into either the game API or portable framework code.

```text
┌──────────────────────────────────────────────────────┐
│                         GAME                         │
│                      Odin game code                  │
│   player.odin · enemy.odin · level.odin · main.odin  │
│                                                      │
│             imports only the `beetpx` package        │
└───────────────────────────┬──────────────────────────┘
                            │ simple, stable `bpx.*` API
┌───────────────────────────▼──────────────────────────┐
│                   BEETPX FRAMEWORK                   │
│  public façade · game lifecycle · deterministic core │
│  graphics/framebuffer · audio commands · input state │
│  assets · save abstractions · world/math · timing    │
│                                                      │
│      Odin; no DOM, SDL3, miniaudio, or vendor SDK    │
└───────────────────────────┬──────────────────────────┘
                            │ narrow platform contract
┌───────────────┬───────────┴────────────┬─────────────┐
│ Browser adapter│ Native desktop adapter │ Future adapter│
│ js_wasm32 + DOM│ SDL3 + miniaudio       │ Nintendo, etc.│
│ /Web APIs      │ (macOS first)          │ vendor tooling│
└───────────────┴────────────────────────┴──────────────┘
```

The only framework-to-adapter contract is data-oriented: lifecycle control,
fixed input snapshots, fixed simulation ticks, completed `RGBA8` framebuffer
bytes, bounded audio commands, and opaque asset/save bytes. It contains no
platform objects, callbacks into game code, strings, JS values, or Odin
pointers escaping the process boundary. The framework owns game-visible audio
scheduling and transport state; adapters decode/mix/present it through their
platform facilities. Adapters may translate platform events and services into
that contract, but must not add game-visible behavior that differs by target.

Dependency direction is one-way: game → framework → platform contract →
adapter/backend. Test-only code may inspect layers, but production code must
not reverse that direction. Game modules and portable framework code never
import SDL3/miniaudio/browser/vendor packages; adapters never interpret game
state or issue per-draw game calls.

"ABI-friendly" here means a future host (including a console host built with
vendor C/C++ tooling) can drive exactly the same framework using a small
stable binary contract. It does **not** make game authors write C-like code:
their API remains pleasant Odin and the SDK hides the adapter.

## Core game API

- Standard game shape: a `Game_State` struct plus explicit procedure values
  passed to `bpx.run`.
- Lifecycle callbacks return a `Game_Error` (a plain enum, zero value `.None`
  means success). Uncaught non-`.None` results stop safely and use detailed
  development or configurable release diagnostics.
- `bpx` is a flat, single-package façade (`import bpx "beetpx"`), valid only
  on the host callback path (`on_started`, `update`, `draw`, and synchronous
  procedures they call). This keeps the convenient singleton-style API
  without pretending it is safe from arbitrary threads or detached work.
- Persistent allocation uses Odin's own `context.allocator`; per-callback
  scratch allocation uses `context.temp_allocator`, which the framework
  resets via `free_all(context.temp_allocator)` after every callback. Shared
  configurable 8–256 MiB cap, default 64 MiB, applies to whatever backing
  allocator the platform adapter installs into `context.allocator` at
  startup.
- Use `f64` game vectors (`[2]f64`, with native `.x`/`.y` component access),
  `math.round` from `core:math` at raster boundaries, screen-clockwise turns
  (`0` right, `0.25` down), fixed 30/60 Hz simulation, and a global
  deterministic `bpx.random_*` family.
- Add `bpx.time_tick()`/`bpx.time_delta()`/`bpx.time_seconds()`, diagnostic
  render count, repeatable input actions, timers, animations, pause state,
  and typed async operation handles.
- The framework and its game code own all game-visible behavior. Adapters
  exchange only numeric/binary data across the platform contract: lifecycle
  control, a fixed input state, fixed ticks, RGBA framebuffer bytes,
  fixed-capacity audio commands, and opaque save/asset bytes. No strings, JS
  objects, or per-draw calls cross the boundary.

### Intended game shape

```odin
// src/main.odin
package game

import bpx "beetpx"
import "game/player"

Game_State :: struct {
    score: u32,
}

on_started :: proc(self: ^Game_State) -> bpx.Game_Error {
    return player.spawn() // May itself call bpx.*.
}

update :: proc(self: ^Game_State) -> bpx.Game_Error {
    player.update()
    if bpx.input_pressed(.Reset_Game) do self.score = 0
    return .None
}

draw :: proc(self: ^Game_State) {
    bpx.draw_clear(.Black)
    player.draw()
    bpx.draw_text(.Ui, 2, 2, "Score: %d", self.score)
}

main :: proc() {
    bpx.run(bpx.Game_Config(Game_State){
        state      = Game_State{},
        on_started = on_started,
        update     = update,
        draw       = draw,
    })
}
```

```odin
// src/game/player.odin — no API parameter is necessary.
package player

import bpx "beetpx"

velocity: [2]f64
position: [2]f64

update :: proc() {
    if bpx.input_down(.Left) do velocity.x -= 1
    if bpx.input_pressed(.Jump) do bpx.audio_play(.Jump)
}

draw :: proc() {
    bpx.draw_sprite(.Player, math.round(position.x), math.round(position.y))
}
```

The `Game_Config($State: typeid)` struct carries `state`, plus `on_started`,
`update`, `draw`, and `deinit` as `proc` values — the ones left as `nil` are
treated as absent, giving "optional callbacks" without needing reflection to
find them.

```odin
package aiming

import bpx "beetpx"

aim_at :: proc(player_pos, pointer: [2]f64) -> [2]f64 {
    angle := bpx.math_turns_between(player_pos, pointer)
    return bpx.math_from_turns(angle) // 0 right; 0.25 down.
}

draw :: proc(player_pos: [2]f64) {
    // Rasterization is explicit and idiomatic: `math.round` from core:math, no special helper.
    bpx.draw_pixel(int(math.round(player_pos.x)), int(math.round(player_pos.y)), .Red)
}
```

Startup order is part of the contract: create state, preload boot assets and
browser saves, obtain the web audio gesture when required, call `on_started`
once, then enter fixed updates and draws. `deinit` runs once on normal
shutdown/restart. A pollable async handle never invokes a game callback on
its own; the game observes it from `update`.

### Rendering and simulation contract

The framework owns one canonical `RGBA8` framebuffer at the selected logical
canvas resolution. Game-facing colors are opaque RGB values; drawing never
blends semi-transparent pixels. PNG source alpha is ignored in the initial
release, so
artists should prepare opaque RGB sprites (use BeetPx sprite/color-mapping
features, rather than alpha blending, where a drawing effect needs it). The
alpha byte of every written framebuffer pixel is `255`. This preserves simple
pixel-art rules while keeping the presentation and PNG/screenshot transport
conventional.

Drawing is immediate. Every drawing call changes the framebuffer before the
next call, which is required for canvas snapshots and their color
mappings. Normal drawing must not become a deferred command queue.

```odin
draw :: proc(self: ^Game_State) {
    bpx.draw_clear(.Black)
    bpx.draw_rect({2, 2, 10, 10}, .Red)

    before_player := bpx.draw_take_canvas_snapshot()
    // Reads the red rectangle as it existed exactly above.
    bpx.draw_sprite(.Player, 4, 4, {
        color_mapping = bpx.snapshot_map(before_player, {{.Red, .Orange}}),
    })
}
```

Platform adapters only present the completed framebuffer: Canvas2D copies it
with image smoothing disabled; WebGL2 uploads it as a texture; SDL3 uploads
it to its streaming texture. WebGL2 is therefore optional acceleration for
presentation, not an alternate drawing model. A renderer setup/presentation
failure logs a clear warning and uses the available Canvas2D/software path.

Simulation is fixed-step and host-independent:

1. Poll host events and produce one input state for the host iteration.
2. Accumulate monotonic elapsed time and run `update` at the configured 30 or
   60 Hz.
3. Run at most five catch-up updates; discard additional backlog to avoid a
   death spiral.
4. Call `draw` and present once per host iteration after the updates.

`bpx.time_delta()` is the fixed tick duration, never host frame duration. No
interpolation is exposed in the initial release. A scripted input sequence and the same
assets must produce byte-identical framework framebuffer bytes at the same
ticks on `js_wasm32` and native macOS. This guarantee depends on cross-target
verification of Odin's floating-point codegen and `math.round` behavior.
Make the clock/event source injectable in framework tests.

## Project, platform adapters, and configuration

- BeetPx ships its own standalone `beetpx` CLI binary (prebuilt per host OS,
  or self-built once from source). Users install it once; it is not invoked
  through a compiler build command.
- `beetpx.json` is canonical: dotted stable game ID such as
  `beetrootpaul.avoidyourpast`, title, canvas preset, tick rate, memory cap,
  assets/groups, system tools, template, icon, hooks, and build constants.
- SDK pinning is a hand-rolled lockfile, `beetpx.lock.json`, recording
  `{ "version": "...", "commit": "...", "sha256": "..." }`. `beetpx upgrade`
  fetches a new release archive, verifies its checksum itself, and rewrites
  the lockfile — the CLI owns this verification step end to end.
- The pinned SDK source is vendored into a fixed local path (e.g. `.beetpx/`,
  CLI-managed, git-ignored) and mapped into the Odin compiler's import
  resolution via `-collection:beetpx=.beetpx` on every `odin build`
  invocation the CLI performs internally. Game code still just writes
  `import bpx "beetpx"`.
- Use the CLI as `beetpx dev|itch|macos|upgrade|doc|test`. Internally it
  shells out to `odin build`/`odin test`/`odin doc` with the right
  `-target:`/`-collection:` flags plus platform-specific packaging steps
  (zipping for itch, `lipo`-combining two macOS builds into a universal
  binary, optional codesigning/notarization).
- Optional asset hooks are command arrays in `beetpx.json`; the CLI runs
  build hooks and supervises watch hooks. Node/Aseprite/ffmpeg are optional
  external commands — the SDK itself does not require Node.
- Browser adapter: custom DOM/JS around a `js_wasm32` build — Canvas2D first,
  swappable WebGL2 presenter, nearest-neighbor integer scaling, letterboxing,
  custom device-skin templates, touch controls, Web Audio, IndexedDB,
  enhanced gamepad mapping.
- macOS native adapter: SDL3 for window/input/gamepad/presentation, miniaudio
  to decode, mix, and output the framework's audio schedule. Use accelerated
  streaming textures with software fallback warnings. These are adapter-only
  dependencies, never game or portable-framework dependencies.
- Native windows are resizable and letterboxed; initial scale is
  canvas-preset-derived, with optional override. Public macOS builds are
  universal `.app` bundles in ZIPs; signing/notarization is optional but
  integrated into `beetpx macos`.
- Canvas dimensions are selected from framework-provided presets only
  (including square and 16:9 choices), not arbitrary user dimensions.
  Templates may rely on the chosen preset's aspect ratio to lay out
  responsive device-like touch controls.
- An itch build is a self-contained static HTML distribution: `index.html`,
  WASM/JS, and declared assets are shipped together in the ZIP and fetched by
  the browser from that archive/site. This works with itch.io's normal
  HTML-game embedding and does not require a server API.
- All stable releases follow SemVer, with long alpha/beta development before
  the first stable release of the rewrite; treat the rewrite as ongoing
  prerelease work rather than a reason to make casual breaking changes.

### Native hot-reload

- Game code compiles to a shared library (`game.dylib` on macOS) separate
  from a thin, long-lived platform host process that owns the window, audio
  device, and input.
- All mutable game state lives in one struct allocated once by the host and
  passed across the reload boundary as a raw pointer; the game library never
  keeps its own static/global state that would be lost on reload.
- `beetpx dev` on macOS watches `game.dylib`'s mtime, and on change: keeps
  the process and its state alive, closes and reopens the library handle,
  re-resolves the `update`/`draw`/`on_started` symbols, and optionally calls
  a `game_hot_reloaded(state: rawptr)` hook so the game can re-run any
  one-time setup that must not run on cold start.
- This does not extend to the browser target: WASM has no `dlopen`
  equivalent, so the web adapter keeps a "rebuild, then explicit reload"
  flow. Treat native hot reload as a macOS-first developer-experience win,
  not a cross-platform guarantee.
- A changed declared asset may separately be rebuilt by a watch hook and
  swapped into a running game on either platform, without a full restart.

### Intended standalone game layout

```text
my-game/
  beetpx.json                  # game/product configuration
  beetpx.lock.json             # pins BeetPx SDK version/commit + checksum
  .beetpx/                     # CLI-managed vendored SDK source (git-ignored)
  src/
    main.odin
    game/                      # arbitrary, deeply nested game packages
  assets/
    assets.json
    art/ audio/ levels/
  web/                         # optional custom template and its CSS
  scripts/                     # optional Aseprite/LDtk/etc. hooks
```

The generated project must work after installing only the pinned Odin
toolchain and the `beetpx` CLI; JavaScript is optional solely for project
hooks.

The BeetPx repository itself keeps portable framework, browser adapter,
native adapter, CLI/bootstrap template, examples, and the published-consumer
fixture as separate implementation areas. Neither a game nor the portable
framework imports DOM, SDL3, miniaudio, Web Audio, browser storage, or a
console SDK directly.

### Example project configuration

This is a deliberately human-editable configuration. Built-in identifiers
carry an explicit namespace, so they cannot be mistaken for local paths.

```json
{
  "id": "beetrootpaul.avoidyourpast",
  "title": "Avoid Your Past",
  "canvas": "preset:320x180",
  "tick_rate": 60,
  "memory_mib": 64,
  "renderer": "canvas2d",
  "template": "builtin:touch-16x9",
  "assets": "assets/assets.json",
  "system_tools": {
    "development": {
      "pause": "Semicolon", "restart": "KeyR",
      "capture_screenshot": "BracketRight", "browse_screenshots": "Shift+BracketRight"
    },
    "release": {
      "pause": null, "restart": null,
      "capture_screenshot": "BracketRight", "browse_screenshots": "Shift+BracketRight"
    }
  },
  "hooks": {
    "build": [["node", "scripts/syncAssets.js"]],
    "watch": [["watchexec", "-w", "art", "--", "node", "scripts/syncAssets.js"]]
  }
}
```

To replace a built-in shell, use an equally explicit local identifier — for
example, `"template": "custom:./web/index.html"`. During template validation
the CLI reports missing required markers (canvas, and screenshot-gallery when
screenshots are enabled) as a build error. Optional recognized controls
receive listeners and pressed/muted state classes or data attributes from the
host; unrecognized HTML remains entirely the game author's own page chrome.

Typical commands, run through the standalone CLI:

```sh
beetpx dev
beetpx itch
beetpx macos
beetpx upgrade
```

For a custom browser shell, BeetPx owns the canvas and recognizes optional
host controls rather than game-specific HTML. The template can present
device-like buttons such as A/B/Menu and attach them to actions through data
attributes.

```html
<canvas data-beetpx-canvas></canvas>
<button data-beetpx-action="confirm">A</button>
<button data-beetpx-action="cancel">B</button>
<button data-beetpx-system="mute">Mute</button>
<section data-beetpx-screenshot-gallery hidden></section>
```

## Runtime features

- Assets are declared locally and grouped. Boot assets preload; deferred
  groups load through pollable handles and release explicitly.
  Missing/unloaded use is a no-op with rate-limited console/native
  diagnostics.
- Existing audio playback survives group release; new use is forbidden.
  Game-owned parsed/copied data remains valid.
- Runtime assets: PNG/bitmap fonts, WAV/MP3, and opaque data. No remote
  runtime loading in the initial release.
- Music sequences are typed Odin descriptors: parallel layers are mixed into
  one prepared PCM transport with optional intro and loop sections.
  Preparation is async/pollable; playhead, host suspension, mute/unmute, and
  fades remain synchronized across adapters. BeetPx exposes no framework
  volume control: device/platform volume remains authoritative.
- Voice policy: 2 music transports, 2 UI voices, 8 SFX voices; priority
  scheduling, per-sound simultaneous limits, deterministic stealing, and 64
  post-scheduling audio commands per frame.
- Web audio games show a Play overlay after boot assets load; interaction
  enables audio before `on_started`. Audio-free games start immediately.
- Input has 64 named digital actions, keyboard/touch/pointer/gamepad
  bindings, deterministic repeat, remapping primitives, and all connected
  controllers aggregated into one logical player.
- System tools are configured per development/release build. Pause can be
  controlled from game code; restart is host-key-only. Game keymaps override
  system bindings with visible build warnings.
- Screenshot capture is enabled by default in generated release projects as a
  configurable host system tool. Web captures PNGs without downloading,
  retains the latest 16 Blob screenshots per game/origin, and opens a pausing
  HTML gallery whose links download only when clicked. Custom templates must
  provide gallery markers. Native captures PNGs to a documented screenshots
  folder.
- Reserve an adapter-independent final-frame tap for future bounded GIF/MP4
  instant replay; do not implement recording in the initial release.

### Examples: assets, input, and audio

```json
{
  "assets": [
    { "id": "player", "path": "art/player.png", "group": "boot" },
    { "id": "jump", "path": "audio/jump.wav", "group": "boot", "max_simultaneous": 2 },
    { "id": "level_03", "path": "levels/03.bin", "group": "level-03" },
    { "id": "song", "path": "audio/song.mp3", "group": "level-03" }
  ]
}
```

```odin
package level3

import bpx "beetpx"

level_load: bpx.Group_Handle

enter :: proc() {
    level_load = bpx.assets_load_group(.Level_03)
}

update_loading :: proc() -> bpx.Game_Error {
    done := bpx.assets_poll(level_load) or_return
    if done {
        bpx.music_play(.Song, {
            intro_seconds     = 8.25,
            loop_start_seconds = 8.25,
            loop_end_seconds   = 42.0,
        })
        state = .Playing
    }
    return .None
}

clear :: proc() {
    // Playing voices retain their prepared data; new uses of this group's IDs fail safely.
    bpx.assets_release_group(.Level_03)
}
```

`or_return` above is Odin's built-in sugar for propagating a fallible
multi-return result out of the current procedure. An optional non-looping
intro transitions sample-accurately into a loop. The game can read the
transport clock for beat-synced visuals.

```odin
beat := bpx.music_seconds(.Song) * 2.0 // 120 BPM: two beats per second.
pulse := 1.0 + 0.1 * math.sin(beat * (2 * math.PI))
```

Input names and bindings live in a game Odin package, not in the HTML
template or a web-only action manifest. Each named action is bound to any
number of physical inputs. The custom HTML shell only requests already-defined
action names through its `data-beetpx-action` attributes.

```odin
input_map := bpx.Input_Map{
    .Left       = {keys = {.A, .Arrow_Left}, gamepad = .Dpad_Left},
    .Inventory  = {keys = {.I}, gamepad = .North},
    .Confirm    = {keys = {.Z, .Enter}, gamepad = .South},
    .Reset_Game = {keys = {.Backspace}},
}
```

The host aggregates controllers into this action map. Sixty-four is
capacity, not a restriction to menu-style Confirm/Cancel actions. Larger
capacity raises fixed bookkeeping, replay-state, mapping, and ABI surface
costs; it does not make input more expressive per action.

Audio requests are scheduled by priority into a small voice budget; a frame
with hundreds of explosions cannot crowd out a victory cue or create hundreds
of overlapping sounds.

```odin
bpx.audio_play(.Explosion, {priority = .Low})
bpx.audio_play(.Win_Fanfare, {priority = .Critical})
```

## Persistence, docs, testing, and milestones

- Save slots are declared, versioned tagged binary schemas with
  order-independent fields, nested records/lists, and a 256 KiB maximum per
  slot. Schema-version exhaustiveness is enforced by the union `switch` at
  read time; treat this as a soft, not hard, safety net.
- Browser saves preload from IndexedDB before game start; fall back to
  localStorage only when IndexedDB cannot open. Later write failures remain
  attached to their save operation handle. Storage is naturally
  origin-scoped; save tampering is outside the rewrite's threat model.
- Documentation generation uses `odin doc` against public doc comments, plus
  authored guides for manifest, templates, CLI, itch.io, migration, and
  examples, generated per prerelease and stable release.
- Testing uses Odin's built-in `core:testing` package and `odin test`,
  invoked by `beetpx test`, for deterministic replay fixtures across
  framework, `js_wasm32`, and native macOS builds with raw framebuffer
  hashes. Add browser input/template tests, Canvas2D/WebGL parity
  screenshots, macOS presentation tests, itch ZIP smoke tests,
  storage/audio/asset lifecycle tests, and developer ASCII/PNG/diff
  diagnostics.
- Implement as vertical capability slices across framework + Canvas2D +
  WebGL2 + macOS parity:
  1. Static pixel, primitives, loop, input, then the complete rewrite
     equivalent of the current (v0.56.1) `basic`.
  2. Add tests immediately after `basic`.
  3. Migrate in order: canvas snapshot, fonts, pause-and-restart, const
     injection, then input tester.
  4. Add richer assets, persistence, music sequencing, screenshots, docs,
     public consumer fixture, and release packaging as their capabilities
     become ready.
- Maintain a public consumer fixture that uses only a published prerelease
  SDK (fetched and pinned via `beetpx.lock.json`), proving the generated
  standalone-project experience end to end, including the native hot-reload
  loop.

### Examples: save schema, tools, and verification

```odin
Save_V1 :: struct {
    coins:           u32,
    unlocked_level:  u16,
}

Save_V2 :: struct {
    coins:           u32,
    unlocked_level:  u16,
    settings:        struct { music_muted: bool },
    collected:       []u16,
}

saves := bpx.save_declare(bpx.Save_Slots{
    slot1 = {version = 2, schema = Save_V2},
    slot2 = {version = 2, schema = Save_V2},
    slot3 = {version = 2, schema = Save_V2},
})

// Operations are asynchronous because the browser backend is asynchronous.
op := bpx.save_write(.Slot1, Save_V2{
    coins = 12, unlocked_level = 3,
    settings = {}, collected = {1, 4, 9},
})
```

The declared version is mandatory. A read returns the schema appropriate to
the stored version; migration to the current schema is explicit game code,
so a `Save_V1` value cannot accidentally be treated as a `Save_V2` value:

```odin
Loaded_Save :: union { Save_V1, Save_V2 }

loaded := bpx.save_read(.Slot1)
current: Save_V2
switch v in loaded {
case Save_V1:
    current = Save_V2{coins = v.coins, unlocked_level = v.unlocked_level, settings = {}, collected = {}}
case Save_V2:
    current = v
}
```

Pause is intentionally game-callable, while restart is intentionally not.
System tool bindings yield to the game input map and emit a development
build warning when they collide.

```odin
if bpx.input_pressed(.Pause_Menu) do bpx.pause_set(true)
// There is no bpx.restart(): only a configured host development shortcut can restart.
```

The test harness is framework-owned. Game authors can also request a
readable capture when diagnosing a scenario, without making them responsible
for cross-adapter framebuffer parity.

```text
$ beetpx test --replay fixtures/basic.walk.json --ascii-frame
frame 120 (320x180, framebuffer hash 8f42…)
....RRR................................
....RRR................................
```

The browser build compares Canvas2D and WebGL2 presentation against the same
framework framebuffer; WebGL2 remains a swappable presenter, not a
shader-driven game API. If GPU presentation cannot initialize, the host warns
and uses Canvas2D/software fallback.

## Phased build-out

- **Phase 0 — workspace, no changes to the current engine.** The current
  (v0.56.1) codebase stays parked under `../v0.56.1-for-reference/`, still
  typechecking/testing/building unmodified from there; set up the rewrite's
  repo/toolchain scaffolding (Odin toolchain pinning, `beetpx` CLI skeleton)
  without touching it.
- **Phase 1 — portable framework proof.** Minimum slice: fixed loop, input
  bitmask, clear, pixel, framebuffer readout, deterministic test clock, no
  browser or SDL3 dependency. Verify: a framework test runs a known input
  sequence and asserts exact framebuffer bytes and frame/tick counters.
  Includes the fixed-timestep contract: poll input → accumulate → run at 30
  or 60 ticks/sec → at most five catch-up updates then discard backlog →
  render/present once per host iteration; no delta time or interpolation
  exposed to game code; clock/event source injectable in tests.
- **Phase 2 — browser/WASM proof.** `js_wasm32` build plus a minimal browser
  adapter; one input transfer per host frame, one framebuffer presentation
  per rendered frame; a tiny example game from the rewrite's template. Verify: runs
  in a browser, source edits trigger a reliable restart/reload, output
  matches the framework snapshot fixture.
- **Phase 3 — macOS/SDL3 proof.** Native adapter linking SDL3/miniaudio;
  window/input/framebuffer presentation and the native accumulator loop; a
  runnable macOS debug executable before signing/notarization; run the exact
  Phase 2 example natively. Verify: web and macOS runs consume the same
  scripted inputs and produce byte-identical framebuffer output at chosen
  ticks; keyboard/controller mappings tested; native display uses point
  filtering and correct letterboxing.
- **Phase 4 — expand behavior compatible with the current engine.** Port
  drawing primitives one family at a time: lines, rectangles, ellipses,
  patterns, clipping/camera, sprites, text, animation. Port snapshots before
  any snapshot-dependent color-mapping APIs. Add portable asset IDs, audio
  command queues, storage serialization, pause/debug, host capability checks.
  Maintain an API mapping document from the current (v0.56.1) engine to the
  rewrite; prefer a one-time bootstrap/script/config change over
  widespread per-call game rewrites. Verify: port selected examples
  incrementally, each with deterministic framebuffer golden tests plus
  browser and macOS integration runs.
- **Phase 5 — productize.** `beetpx` CLI/generator produces the rewrite's
  workspace/game layout, run commands, SDK pinning; examples become
  workspace integration tests and documentation; coordinated
  versioning/release scripts for the SDK, Odin toolchain checks, web
  production bundles, and macOS artifacts; add `CONTRIBUTING.md` with the DCO
  sign-off requirement described above; publish the rewrite under new
  package/version identifiers while the current (v0.56.1) line remains
  available. Verify: from a clean checkout, generate a game with the
  rewrite, run it on web and macOS, build its web release, and verify all
  pinned dependency versions resolve without local-path hacks.

## Non-goals and defaults

- No embedded JavaScript engine for native targets.
- No raw per-draw-call JS↔WASM boundary.
- No direct console implementation before official SDK access.
- No GPU command renderer in the initial framework; the RGBA framebuffer is
  canonical.
- No mandatory state-preserving hot reload on the web target — WASM has no
  `dlopen` equivalent, so the browser adapter keeps a rebuild-then-reload
  flow. Native macOS hot reload is explicitly in scope from the start.
- No modification to external current (v0.56.1) games as part of the
  rewrite's bootstrap.
- Native macOS signing, notarization, Windows/Linux distribution, and console
  certification are follow-up packaging projects after the platform contract
  and deterministic rendering proof are complete.
