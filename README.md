# BeetPx

A framework for making tiny pixel-art games.

This branch is an early, in-development rewrite of BeetPx in
[Odin](https://odin-lang.org/), targeting the browser through WebAssembly and
native desktop.

**‼️ It is not usable yet. ‼️**

The previous TypeScript, browser-only line (v0.56.1) remains available and is
licensed under MIT.

## Scripts

Run an example: `./examples/scripts/run.sh <target> <example>`, where
`<target>` is `js_wasm32` (web) or `darwin_arm64` (macOS), and `<example>` is
the name of an example's directory in `./examples/`, e.g.
`./examples/scripts/run.sh js_wasm32 basic`.

Check the BeetPx code: `./scripts/check_core.sh`.

Check all examples: `./examples/scripts/check_all.sh`.

Add `--watch` to either check script to re-run it every time an `.odin` file it
depends on changes, until you stop it with Ctrl+C. Watching works on macOS
only.

## License

Released under the [zlib license](LICENSE). You may use it for any purpose,
including commercial games, and you are not required to credit BeetPx in the
games you ship — though an acknowledgment is always appreciated.

### Name and logo

"BeetPx" and the BeetPx logo are not covered by the zlib license above.

You may freely use, modify, and redistribute the code, and you are welcome to
say that your project is "built with BeetPx" or "based on BeetPx". Please do
not use the BeetPx name or logo as the name or the branding of a fork or a
derived framework, or in any way that suggests it is endorsed by or affiliated
with this project.
