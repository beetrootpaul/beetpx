package bpx

CANVAS_WIDTH  :: 64
CANVAS_HEIGHT :: 64

// Float (x, y) coordinates, where (0, 0) is the top-left corner of the canvas.
Xy :: _Xy

// An opaque RGB8 color.
Rgb :: _Color_Rgb

On_Update_Proc :: proc()
On_Draw_Proc   :: proc()

// Registers a callback to be run once per fixed-timestep tick.
//
// Do not assume `on_update` and `on_draw` alternate: between two `on_draw`
// calls, `on_update` may run several times, or not at all.
set_on_update :: proc(on_update: On_Update_Proc) {
	_game_loop_on_update = on_update
}

// Registers a callback to be run once per host frame, after any ticks.
//
// Do not assume `on_update` and `on_draw` alternate: between two `on_draw`
// calls, `on_update` may run several times, or not at all.
set_on_draw :: proc(on_draw: On_Draw_Proc) {
	_game_loop_on_draw = on_draw
}

// Starts the game. Might be blocking, depending on the platform.
start :: proc() {
	_platform_start()
	// Code placed here runs either right away or on app exit, depending on
	// the platform.
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
