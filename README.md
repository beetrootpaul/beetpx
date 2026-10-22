# BeetPx

A framework for making tiny pixel-art games.

This branch is an early, in-development rewrite of BeetPx in
[Odin](https://odin-lang.org/), targeting the browser through WebAssembly and
native desktop.

**‼️ It is not usable yet. ‼️**

The previous TypeScript, browser-only line (v0.56.1) remains available and is
licensed under MIT.

## Examples

Example "games", along with how to run them, live in
[`examples/`](examples/README.md).

## Scripts

Check the BeetPx code: `./scripts/check.sh`.

Test the BeetPx code: `./scripts/test.sh`.

Add `--watch` to the check or test script to re-run it every time an `.odin`
file it depends on changes, until you stop it with Ctrl+C. Watching requires
[watchexec](https://watchexec.github.io/) to be installed, e.g. with
`brew install watchexec`.

Print the docs of the BeetPx public API: `./scripts/doc.sh`. Its output is
colored in a terminal; add `--no-color` to turn that off.

Format the BeetPx code (requires `odinfmt` on your `PATH`):
`./scripts/format.sh`.

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
