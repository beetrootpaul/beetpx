package beetpx_cli

import "core:fmt"
import "core:os"
import "core:strings"

// Runs a command with the CLI's own stdin, stdout, and stderr, and waits for
// it to finish. Returns whether it succeeded.
@(private)
_exec :: proc(command: []string) -> bool {
	process, start_err := os.process_start({
		command = command,
		stdin   = os.stdin,
		stdout  = os.stdout,
		stderr  = os.stderr,
	})
	if start_err != nil {
		fmt.eprintfln(
			"Failed to start '%s': %v",
			strings.join(command, " ", context.temp_allocator),
			start_err,
		)
		return false
	}

	state, wait_err := os.process_wait(process)
	if wait_err != nil {
		fmt.eprintfln("Failed to wait for '%s': %v", command[0], wait_err)
		return false
	}
	return state.success && state.exit_code == 0
}
