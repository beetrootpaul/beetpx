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

// A canvas to draw on. Only the first `size_px.x * size_px.y` pixels of
// `frame_buffer` are in use.
Canvas :: struct {
	size_px     : Xy_Int,
	// Pixels, row by row, as RGBA8.
	frame_buffer: [_MAX_SIZE_PX.x * _MAX_SIZE_PX.y][4]u8,
}

// The canvas the game draws on.
canvas: Canvas

// Sets the size of the canvas. Has to be called before the canvas is used.
canvas_init :: proc(c: ^Canvas, preset: Canvas_Size_Preset) {
	c.size_px = _canvas_size_preset_as_px(preset)
	// TODO: Is there a way in Odin to say "all array elements have to be less
	//       than another array's corresponding elements"?
	assert(0 < c.size_px.x && c.size_px.x <= _MAX_SIZE_PX.x)
	assert(0 < c.size_px.y && c.size_px.y <= _MAX_SIZE_PX.y)
}

// The size of the canvas the game draws on (see `canvas`).
canvas_size :: proc() -> Xy_Int {
	return canvas.size_px
}

canvas_fill :: proc(c: ^Canvas, color: Rgb) {
	// TODO: Is there a way in Odin to say "multiply all array elements"?
	slice.fill(
		c.frame_buffer[:c.size_px.x * c.size_px.y],
		[4]u8{color.r, color.g, color.b, 0xff},
	)
}

canvas_set :: proc(c: ^Canvas, xy: Xy_Int, color: Rgb) {
	if !_can_set_at(c, xy) do return
	c.frame_buffer[xy.y * c.size_px.x + xy.x] = {
		color.r,
		color.g,
		color.b,
		0xff,
	}
}

@(private = "file")
_can_set_at :: proc(c: ^Canvas, xy: Xy_Int) -> bool {
	return 0 <= xy.x && xy.x < c.size_px.x && 0 <= xy.y && xy.y < c.size_px.y
}

canvas_rgba8_bytes :: proc(c: ^Canvas) -> []u8 {
	return slice.to_bytes(c.frame_buffer[:c.size_px.x * c.size_px.y])
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
