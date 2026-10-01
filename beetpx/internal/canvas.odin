#+private file
package beetpx_internal

import "core:slice"

@(private = "package")
_CANVAS_WIDTH :: 64
@(private = "package")
_CANVAS_HEIGHT :: 64

_frame_buffer: [CANVAS_WIDTH * CANVAS_HEIGHT][4]u8

@(private = "package")
_canvas_fill :: proc(c: _Color_Rgb) {
	slice.fill(_frame_buffer[:], [4]u8{c.r, c.g, c.b, 0xff})
}

@(private = "package")
_canvas_set :: proc(xy: _Xy_Int, c: _Color_Rgb) {
	if !_canvas_can_set_at(xy) do return
	_frame_buffer[xy.y * CANVAS_WIDTH + xy.x] = {c.r, c.g, c.b, 0xff}
}

_canvas_can_set_at :: proc(xy: _Xy_Int) -> bool {
	return(
		0 <= xy.x &&
		xy.x < CANVAS_WIDTH &&
		0 <= xy.y &&
		xy.y < CANVAS_HEIGHT \
	)
}

@(private = "package")
_canvas_rgba8_bytes :: proc() -> []u8 {
	return slice.to_bytes(_frame_buffer[:])
}
