package beetpx_internal

import "core:slice"

// The size of the largest canvas a game can pick (see
// `bpx.Canvas_Size_Preset`).
@(private = "file")
_MAX_SIZE_PX: [2]int : {256, 256}

@(private = "file")
_size_px: [2]int

// The frame buffer with canvas's pixels, row by row, as RGBA8.
//
// Only its first `_size_px.x * _size_px.y` pixels are in use.
//
// TODO: Consider putting _frame_buffer into a state struct.
@(private)
_frame_buffer: [_MAX_SIZE_PX.x * _MAX_SIZE_PX.y][4]u8

// A copy of `_frame_buffer`, made by `canvas_take_snapshot`.
@(private = "file")
_snapshot: [_MAX_SIZE_PX.x * _MAX_SIZE_PX.y][4]u8

@(private = "file")
_has_snapshot: bool

// Sets the size of the canvas. Has to be called before the canvas is used.
canvas_init :: proc(size_px: [2]int) {
	_size_px = size_px
	// TODO: Is there a way in Odin to say "all array elements have to be less
	//       than another array's corresponding elements"?
	assert(0 < _size_px.x && _size_px.x <= _MAX_SIZE_PX.x)
	assert(0 < _size_px.y && _size_px.y <= _MAX_SIZE_PX.y)
}

canvas_size :: proc() -> [2]int {
	return _size_px
}

canvas_fill :: proc(c: [3]u8) {
	// TODO: Is there a way in Odin to say "multiply all array elements"?
	slice.fill(
		_frame_buffer[:_size_px.x * _size_px.y],
		[4]u8{c.r, c.g, c.b, 0xff},
	)
}

canvas_set :: proc(xy: [2]int, c: [3]u8) {
	if !_can_set_at(xy) do return
	_frame_buffer[xy.y * _size_px.x + xy.x] = {c.r, c.g, c.b, 0xff}
}

@(private = "file")
_can_set_at :: proc(xy: [2]int) -> bool {
	return 0 <= xy.x && xy.x < _size_px.x && 0 <= xy.y && xy.y < _size_px.y
}

// Copies the current canvas pixels, so they can be read with
// `canvas_snapshot_get` while drawing over them.
canvas_take_snapshot :: proc() {
	n := _size_px.x * _size_px.y
	copy(_snapshot[:n], _frame_buffer[:n])
	_has_snapshot = true
}

// Forgets the most recent snapshot. Called after each render, so a snapshot
// never outlives the frame it was taken in.
canvas_discard_snapshot :: proc() {
	_has_snapshot = false
}

canvas_has_snapshot :: proc() -> bool {
	return _has_snapshot
}

// Returns the color at `xy` of the most recent snapshot.
canvas_snapshot_get :: proc(xy: [2]int) -> [3]u8 {
	assert(_has_snapshot)
	assert(_can_set_at(xy))
	return _snapshot[xy.y * _size_px.x + xy.x].rgb
}

canvas_rgba8_bytes :: proc() -> []u8 {
	return slice.to_bytes(_frame_buffer[:_size_px.x * _size_px.y])
}
