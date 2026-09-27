package beetpx_core

CANVAS_WIDTH :: 64
CANVAS_HEIGHT :: 64

Xy :: _Xy
Rgb :: _Color_Rgb

On_Update_Proc :: proc()
On_Draw_Proc :: proc()

// Registers a callback to be run once per fixed-timestep tick.
//
// Both `on_update` and `on_draw` should be treated as independent calls.
// Sometimes, `on_update` might be called several times before the next
// `on_draw`, and sometimes it might be not called at all.
set_on_update :: proc(on_update: On_Update_Proc) {
	_game_loop_on_update = on_update
}

// Registers a callback to be run when the game loop has an opportunity to draw.
//
// Both `on_update` and `on_draw` should be treated as independent calls.
// Sometimes, `on_update` might be called several times before the next
// `on_draw`, and sometimes it might be not called at all.
set_on_draw :: proc(on_draw: On_Draw_Proc) {
	_game_loop_on_draw = on_draw
}

// Starts the game. Might be blocking, depending on the platform.
start :: proc() {
	_platform_start()
	// Whatever you put here, might run either immediately or on the app exit,
	// depending on the platform specifis.
}

// Returns the frame number, which is incremented once per fixed-timestep tick,
// right before `on_update` runs.
//
// TODO: Consider renaming it to something shorter.
frame_number :: proc() -> int {
	return _game_loop_frame_number
}

// Sets every pixel of the canvas to the given color.
//
// TODO: Extract `draw` sub-API.
draw_clear_canvas :: proc(color: Rgb) {
	_draw_clear_canvas(color)
}

// Draws a single pixel at `xy`, where (0, 0) is the top-left corner of the
// canvas. `xy` is rounded to the nearest pixel, with halves rounded up. A pixel
// outside the canvas is skipped.
//
// TODO: Extract `draw` sub-API.
draw_pixel :: proc(xy: Xy, color: Rgb) {
	_draw_pixel(xy, color)
}
