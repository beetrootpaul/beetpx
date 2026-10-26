package beetpx_internal

// The part of the framework's state that `bpxd` and other packages share. It
// holds only data, so that it can be copied over to new code on hot reload.
State :: struct {
	size_px     : [2]int,
	// The frame buffer with canvas's pixels, row by row, as RGBA8.
	//
	// Only its first `size_px.x * size_px.y` pixels are in use.
	frame_buffer: [_CANVAS_MAX_WH_PX.x * _CANVAS_MAX_WH_PX.y][4]u8,
	camera_xy   : [2]f64,
}

@(private)
_s: State

// The whole state, e.g. to copy it on hot reload.
state :: proc() -> ^State {
	return &_s
}
