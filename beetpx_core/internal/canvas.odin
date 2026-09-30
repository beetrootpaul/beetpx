package beetpx_internal

import "core:slice"

CANVAS_WIDTH  :: 64
CANVAS_HEIGHT :: 64

@(private = "file")
_frame_buffer: [CANVAS_WIDTH * CANVAS_HEIGHT][4]u8

canvas_fill :: proc(c: Color_Rgb) {
	slice.fill(_frame_buffer[:], [4]u8{c.r, c.g, c.b, 0xff})
}

canvas_set :: proc(xy: Xy_Int, c: Color_Rgb) {
	if !_canvas_can_set_at(xy) do return
	_frame_buffer[xy.y * CANVAS_WIDTH + xy.x] = {c.r, c.g, c.b, 0xff}
}

@(private = "file")
_canvas_can_set_at :: proc(xy: Xy_Int) -> bool {
	return(
		0 <= xy.x &&
		xy.x < CANVAS_WIDTH &&
		0 <= xy.y &&
		xy.y < CANVAS_HEIGHT \
	)
}

canvas_rgba8_bytes :: proc() -> []u8 {
	return slice.to_bytes(_frame_buffer[:])
}
