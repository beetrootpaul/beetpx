package beetpx_cli

import "core:fmt"

// Formats the game's code with `odinfmt`, which has to be on `PATH`.
@(private)
_format :: proc(args: []string) -> bool {
	if len(args) > 0 {
		_fail_with_usage(fmt.tprintf("Unknown argument: '%s'.", args[0]))
	}

	fmt.printfln("Formatting '%s' ...", _SRC_DIR)
	return _exec({"odinfmt", "-w", _SRC_DIR})
}
