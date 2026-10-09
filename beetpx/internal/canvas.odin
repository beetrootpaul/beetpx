package beetpx_internal

import "core:slice"

// The size of the game drawing canvas, in logical pixels.
Canvas_Size_Preset :: enum {
	Square_64,
	Square_128,
	Square_256,
}

// The size of the largest canvas a game can pick (see `Canvas_Size_Preset`).
@(private = "file")
_MAX_SIZE_PX: Xy_Int : {256, 256}

@(private = "file")
_size_px: Xy_Int

// The frame buffer with canvas's pixels, row by row, as RGBA8.
//
// Only its first `_size_px.x * _size_px.y` pixels are in use.
//
// TODO: Consider putting _frame_buffer into a state struct.
@(private)
_frame_buffer: [_MAX_SIZE_PX.x * _MAX_SIZE_PX.y][4]u8

// Sets the size of the canvas. Has to be called before the canvas is used.
canvas_init :: proc(preset: Canvas_Size_Preset) {
	_size_px = _canvas_size_preset_as_px(preset)
	// TODO: Is there a way in Odin to say "all array elements have to be less
	//       than another array's corresponding elements"?
	assert(0 < _size_px.x && _size_px.x <= _MAX_SIZE_PX.x)
	assert(0 < _size_px.y && _size_px.y <= _MAX_SIZE_PX.y)
}

canvas_size :: proc() -> Xy_Int {
	return _size_px
}

canvas_fill :: proc(c: Rgb) {
	// TODO: Is there a way in Odin to say "multiply all array elements"?
	slice.fill(
		_frame_buffer[:_size_px.x * _size_px.y],
		[4]u8{c.r, c.g, c.b, 0xff},
	)
}

canvas_set :: proc(xy: Xy_Int, c: Rgb) {
	if !_can_set_at(xy) do return
	_frame_buffer[xy.y * _size_px.x + xy.x] = {c.r, c.g, c.b, 0xff}
}

@(private = "file")
_can_set_at :: proc(xy: Xy_Int) -> bool {
	return 0 <= xy.x && xy.x < _size_px.x && 0 <= xy.y && xy.y < _size_px.y
}

canvas_rgba8_bytes :: proc() -> []u8 {
	return slice.to_bytes(_frame_buffer[:_size_px.x * _size_px.y])
}

@(private = "file")
_canvas_size_preset_as_px :: proc(preset: Canvas_Size_Preset) -> Xy_Int {
	switch preset {
	case .Square_256:
		return {256, 256}
	case .Square_128:
		return {128, 128}
	case .Square_64:
		fallthrough
	case:
		// TODO: Consider `panic` here.
		return {64, 64}
	}
}
