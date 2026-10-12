// The BeetPx CLI. It checks, formats, and runs a game.
//
// Run it from the game's root directory, which has the game's code in `src/`
// and the web page in `index.html`:
//
//     odin run path/to/beetpx/cli -- <command> [args]
//
// Odin builds it on the fly, so it needs no separate install. It always uses
// the BeetPx it comes with.
package beetpx_cli

import "core:fmt"
import "core:os"

// TODO: Support more targets, e.g. `linux_amd64` and `windows_amd64`.
@(private)
_TARGETS :: [?]string{"darwin_arm64", "js_wasm32"}

@(private = "file")
_USAGE :: `Usage: beetpx <command> [args]

Commands:
  check [--watch]   Checks the game for every target.
  format            Formats the game's code.
  run <target>      Builds and runs the game for <target>.

Targets: darwin_arm64, js_wasm32.`

// The game's code, relative to the game's root directory.
@(private)
_SRC_DIR :: "./src"

// TODO: Name the output files after the game ID or something.
@(private)
_GAME_NAME :: "beetpx_game"

main :: proc() {
	if len(os.args) < 2 {
		_fail_with_usage("No command.")
	}
	command := os.args[1]
	args := os.args[2:]

	ok: bool
	switch command {
	case "check":
		ok = _check(args)
	case "format":
		ok = _format(args)
	case "run":
		ok = _run(args)
	case "help", "-h", "-help", "--help":
		fmt.println(_USAGE)
		ok = true
	case:
		_fail_with_usage(fmt.tprintf("Unknown command: '%s'.", command))
	}

	if !ok {
		os.exit(1)
	}
}

// The root of the `beetpx` collection, i.e. the parent of this directory.
@(private)
_beetpx_dir :: proc() -> string {
	dir, err := os.clean_path(#directory + "..", context.temp_allocator)
	if err != nil {
		return #directory + ".."
	}
	return dir
}

@(private)
_fail_with_usage :: proc(message: string) -> ! {
	fmt.eprintln(message)
	fmt.eprintln()
	fmt.eprintln(_USAGE)
	os.exit(1)
}
