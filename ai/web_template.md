# Web HTML template

A non-binding design note. Where the code already decided something, the code
wins.

## Decision

A hidden built-in template plus a full-file eject. No partial customization
slots: games always end up wanting to change a part that is not exposed, and
then they work around the slots.

## Today

- `examples/index.html` hosts the web build. Games copy it (e.g. Avoid Your
  Past has a copy that differs only in `<title>`).
- The canvas element ID and the WASM file name are hard-coded.
- v0.56.1 had one hidden template of about 1000 lines. Its CLI filled 3
  placeholders (title, icon, background color), there was no override, and
  its JS needed about 20 fixed element IDs.

## Proposal

1. **Default.** The template lives inside BeetPx, and games do not touch it.
   Title, icon and background color come from the game config. These are game
   data, not parts of the template.
2. **Eject.** A CLI command (e.g. `beetpx eject web`) copies the built-in
   template of the game's SDK version into `web/index.html`. If that file
   exists, the build uses it instead. From then on, the game owns the whole
   file.
3. **Contract, not slots.** The template stays thin: markup and CSS only. All
   logic lives in `beetpx.js`, so it gets fixes with the SDK. The contract:
   - Required: one `<canvas data-beetpx-canvas>` and the boot script.
   - Optional: `data-beetpx-*` elements (start, mute, fullscreen, touch
     buttons, error box). `beetpx.js` uses them if they exist and skips them
     if they do not.
   - State goes out as classes on `<body>` (`loaded`, `started`, `muted`,
     `error`), so CSS can style anything.
   - Placeholders such as `{{title}}` also work in an ejected file. The game
     can keep them or hard-code the values.

## Why eject, not a link to the template on GitHub

A link can point to a version that does not match the game's SDK. Eject copies
the exact file the SDK has. A link is still useful in the docs.

## Risk

An ejected file does not get template fixes. With a thin template and the
logic in `beetpx.js`, little can drift. The template can carry a contract
version comment, and the CLI can warn on a mismatch.

Godot ("Custom HTML Shell") and Emscripten (`--shell-file`) work the same way:
a full-file override with a few placeholders.
