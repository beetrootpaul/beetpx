#+private file
package beetpx_core

import sdl "vendor:sdl3"

// Blocks until the window is closed.
//
// TODO: Read SDL3 docs about everything that happens inside this proc.
@(private = "package")
_game_loop_run :: proc() {
	previous_ticks_ns := sdl.GetTicksNS()
	running := true
	for running {
		event: sdl.Event
		for sdl.PollEvent(&event) {
			if event.type == .QUIT {
				running = false
			}
		}

		current_ticks_ns := sdl.GetTicksNS()
		delta_seconds := f64(current_ticks_ns - previous_ticks_ns) / 1e9
		previous_ticks_ns = current_ticks_ns

		_game_loop_advance(delta_seconds)
	}
}
