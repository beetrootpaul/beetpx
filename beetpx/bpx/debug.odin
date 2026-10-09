package beetpx_bpx

import "core:fmt"

// TODO: Persist the debug mode between game runs.
// TODO: Print debug logs only in the debug mode, once there is a logger.
// TODO: Show FPS on the canvas in the debug mode, once there is text drawing.

@(private = "file")
debug_enabled: bool

// Whether the debug mode is on. Games can use it to draw or log extra things,
// e.g. collision shapes.
debug :: proc() -> bool {
	return debug_enabled
}

// Turns the debug mode on or off. The platform shows it, e.g. with a colored
// border around the canvas on the web.
set_debug :: proc(enabled: bool) {
	debug_enabled = enabled
	// TODO: Use a custom logger.
	fmt.println("BeetPx: debug mode", enabled ? "on" : "off")
	platform_show_debug(enabled)
}

// Toggles the debug mode on the debug key. Runs once per tick.
@(private)
debug_update :: proc() {
	if key_just_pressed(.Semicolon) do set_debug(!debug_enabled)
}
