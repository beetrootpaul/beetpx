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
MAX_SIZE_PX: Xy_Int : {256, 256}

@(private = "file")
size_px: Xy_Int

// The frame buffer with canvas's pixels, row by row, as RGBA8.
//
// Only its first `size_px.x * size_px.y` pixels are in use.
//
// TODO: Consider putting frame_buffer into a state struct.
@(private)
frame_buffer: [MAX_SIZE_PX.x * MAX_SIZE_PX.y][4]u8

// Sets the size of the canvas. Has to be called before the canvas is used.
canvas_init :: proc(preset: Canvas_Size_Preset) {
	size_px = canvas_size_preset_as_px(preset)
	// TODO: Is there a way in Odin to say "all array elements have to be less
	//       than another array's corresponding elements"?
	assert(0 < size_px.x && size_px.x <= MAX_SIZE_PX.x)
	assert(0 < size_px.y && size_px.y <= MAX_SIZE_PX.y)
}

canvas_size :: proc() -> Xy_Int {
	return size_px
}

canvas_fill :: proc(c: Rgb) {
	// TODO: Is there a way in Odin to say "multiply all array elements"?
	slice.fill(
		frame_buffer[:size_px.x * size_px.y],
		[4]u8{c.r, c.g, c.b, 0xff},
	)
}

canvas_set :: proc(xy: Xy_Int, c: Rgb) {
	if !can_set_at(xy) do return
	frame_buffer[xy.y * size_px.x + xy.x] = {c.r, c.g, c.b, 0xff}
}

@(private = "file")
can_set_at :: proc(xy: Xy_Int) -> bool {
	return 0 <= xy.x && xy.x < size_px.x && 0 <= xy.y && xy.y < size_px.y
}

canvas_rgba8_bytes :: proc() -> []u8 {
	return slice.to_bytes(frame_buffer[:size_px.x * size_px.y])
}

@(private = "file")
canvas_size_preset_as_px :: proc(preset: Canvas_Size_Preset) -> Xy_Int {
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
