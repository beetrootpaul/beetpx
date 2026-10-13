package beetpx_bpx

import "../internal"

// Nothing else runs the game loop on the "nil" platform. After `start`, which
// returns right away, the game advances only on `nil_platform_step` calls.
@(private)
_platform_nil_start :: proc() {
	internal.canvas_fill({0, 0, 0})
}

@(private)
_platform_nil_render :: proc() {}

when _PLATFORM == "nil" {
	// Runs the ticks owed for `delta_s` seconds of game time, then `on_draw`
	// once, like a single host frame of other platforms.
	//
	// Exists only on the "nil" platform.
	nil_platform_step :: proc(delta_s: f64) {
		_game_loop_advance(delta_s)
	}

	// Returns the pixels of the canvas, row by row, as RGBA8 bytes, e.g. to
	// compare their hash in a test.
	//
	// Exists only on the "nil" platform.
	nil_platform_canvas_rgba8_bytes :: proc() -> []u8 {
		return internal.canvas_rgba8_bytes()
	}
}
