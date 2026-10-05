# BeetPx examples

Small "games" that show how to use BeetPx, one per directory:

- [basic](basic/main.odin) - Very minimal example. It sets up the update
  and draw callbacks and fills the canvas with a color that changes every
  frame, so you can see that the game loop is running.

## Running an example

```sh
./run.sh <target> <example>
```

- `<target>` is `js_wasm32` (web) or `darwin_arm64` (macOS).
- `<example>` is the name of an example's directory, e.g. `basic`.

For example: `./run.sh js_wasm32 basic`.

The scripts work from any directory.

On the web, the script builds the example into `./build/web/` and
serves it at <http://127.0.0.1:8000> with Python's built-in HTTP server, so it
needs `python3`. On macOS, it builds the example
into `./build/macos/` and opens it in a window.

## Other scripts

Check all examples, for every supported target:

```sh
./check_all.sh
```

Add `--watch` to re-run the check every time an `.odin` file in the examples
or in BeetPx changes. Watching requires
[watchexec](https://watchexec.github.io/) to be installed.

Format all examples (requires `odinfmt` on your `PATH`):

```sh
./format_all.sh
```


