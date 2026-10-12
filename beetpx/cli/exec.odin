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

// Returns whether a program can be found on `PATH`.
@(private)
_is_on_path :: proc(program: string) -> bool {
	path_var := os.get_env("PATH", context.temp_allocator)
	dirs, err := os.split_path_list(path_var, context.temp_allocator)
	if err != nil {
		return false
	}
	file_name := program
	when ODIN_OS == .Windows {
		file_name = strings.concatenate(
			{program, ".exe"},
			context.temp_allocator,
		)
	}
	for dir in dirs {
		path, _ := os.join_path({dir, file_name}, context.temp_allocator)
		if os.is_file(path) {
			return true
		}
	}
	return false
}
