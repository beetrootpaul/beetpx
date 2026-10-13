package beetpx_internal

import "base:runtime"
import "core:fmt"

// Logs go to `context.logger` if the game has set one. Otherwise, they are
// printed: info to stdout, warnings and errors to stderr.
//
// Like with `core:log`, levels below `context.logger.lowest_level` are
// skipped.

log_info :: proc(args: ..any, location := #caller_location) {
	_log(.Info, args, location)
}

log_warn :: proc(args: ..any, location := #caller_location) {
	_log(.Warning, args, location)
}

log_error :: proc(args: ..any, location := #caller_location) {
	_log(.Error, args, location)
}

@(private = "file")
_log :: proc(
	level: runtime.Logger_Level,
	args: []any,
	location: runtime.Source_Code_Location,
) {
	logger := context.logger
	if level < logger.lowest_level {
		return
	}

	message := fmt.tprint(..args)

	// `runtime.default_logger_proc` does nothing. It is also what
	// `log.nil_logger` uses, so the two cannot be told apart.
	if logger.procedure != nil &&
	   logger.procedure != runtime.default_logger_proc {
		logger.procedure(
			logger.data,
			level,
			fmt.tprint("BeetPx:", message),
			logger.options,
			location,
		)
		return
	}

	// The `ln` procs end the line with `\n`. On the web, a line without it
	// does not show up in the console.
	switch level {
	case .Debug, .Info:
		fmt.println("BeetPx:", message)
	case .Warning:
		fmt.eprintln("BeetPx warning:", message)
	case .Error, .Fatal:
		fmt.eprintln("BeetPx error:", message)
	}
}
