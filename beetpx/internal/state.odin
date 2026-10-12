package beetpx_internal

@(private)
_s: struct {
	size_px     : [2]int,
	// The frame buffer with canvas's pixels, row by row, as RGBA8.
	//
	// Only its first `_size_px.x * _size_px.y` pixels are in use.
	//
	// TODO: Consider putting _frame_buffer into a state struct.
	frame_buffer: [_CANVAS_MAX_WH_PX.x * _CANVAS_MAX_WH_PX.y][4]u8,
	images      : _Images_State,
}
