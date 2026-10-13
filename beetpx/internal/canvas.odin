package beetpx_internal

import "core:slice"

// The size of the largest canvas a game can pick (see
// `bpx.Canvas_Size_Preset`).
@(private)
_MAX_SIZE_PX: [2]int : {256, 256}

// Sets the size of the canvas. Has to be called before the canvas is used.
canvas_init :: proc(size_px: [2]int) {
	_state.canvas_size_px = size_px
	// TODO: Is there a way in Odin to say "all array elements have to be less
	//       than another array's corresponding elements"?
	assert(0 < size_px.x && size_px.x <= _MAX_SIZE_PX.x)
	assert(0 < size_px.y && size_px.y <= _MAX_SIZE_PX.y)
}

canvas_size :: proc() -> [2]int {
	return _state.canvas_size_px
}

canvas_fill :: proc(c: [3]u8) {
	size := _state.canvas_size_px
	// TODO: Is there a way in Odin to say "multiply all array elements"?
	slice.fill(
		_state.frame_buffer[:size.x * size.y],
		[4]u8{c.r, c.g, c.b, 0xff},
	)
}

canvas_set :: proc(xy: [2]int, c: [3]u8) {
	if !_can_set_at(xy) do return
	size := _state.canvas_size_px
	_state.frame_buffer[xy.y * size.x + xy.x] = {c.r, c.g, c.b, 0xff}
}

@(private = "file")
_can_set_at :: proc(xy: [2]int) -> bool {
	size := _state.canvas_size_px
	return 0 <= xy.x && xy.x < size.x && 0 <= xy.y && xy.y < size.y
}

canvas_rgba8_bytes :: proc() -> []u8 {
	size := _state.canvas_size_px
	return slice.to_bytes(_state.frame_buffer[:size.x * size.y])
}
