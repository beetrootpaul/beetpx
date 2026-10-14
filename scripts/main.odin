// Development scripts of BeetPx, as a single CLI with subcommands. Run it from
// the repository root with:
//
//   odin run scripts -- <command> [args]
package scripts

import "core:fmt"
import "core:os"

@(private = "file")
_USAGE :: `Usage: odin run scripts -- <command> [args]

Commands:
  doc [--no-color]  Prints the public API of BeetPx.
`

main :: proc() {
	// Makes all the paths relative to the repository root, no matter where
	// the CLI is run from.
	if err := os.set_working_directory(#directory + "/.."); err != nil {
		fmt.eprintfln("Cannot enter the repository root: %v", err)
		os.exit(1)
	}

	if len(os.args) < 2 {
		fmt.eprint(_USAGE)
		os.exit(1)
	}

	ok: bool
	switch command := os.args[1]; command {
	case "doc":
		ok = doc(os.args[2:])
	case:
		fmt.eprintfln("Unknown command: '%s'.", command)
		fmt.eprint(_USAGE)
		os.exit(1)
	}

	if !ok {
		os.exit(1)
	}
}

// Runs a command and returns its stdout. Its stderr goes to our stderr.
@(private)
_exec :: proc(
	command: []string,
	allocator := context.allocator,
) -> (
	stdout: string,
	ok: bool,
) {
	state, out, err_out, err := os.process_exec({command = command}, allocator)
	defer delete(err_out, allocator)
	os.write(os.stderr, err_out)
	if err != nil {
		fmt.eprintfln("Cannot run '%s': %v", command[0], err)
		delete(out, allocator)
		return "", false
	}
	if !state.success || state.exit_code != 0 {
		delete(out, allocator)
		return "", false
	}
	return string(out), true
}
