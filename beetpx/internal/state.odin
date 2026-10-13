package beetpx_internal

// The whole state of the framework, in one struct, so that it can outlive
// the code that uses it, e.g. when the game's code is hot reloaded.
//
// Whatever points into the game's code, such as callbacks, does not belong
// here.
State :: struct {
	canvas_size_px: [2]int,
	// The canvas's pixels, row by row, as RGBA8.
	//
	// Only its first `canvas_size_px.x * canvas_size_px.y` pixels are in use.
	frame_buffer  : [_MAX_SIZE_PX.x * _MAX_SIZE_PX.y][4]u8,
	tick_rate_hz  : u8,
	tick_s        : f64,
	// TODO: Should it really be just int, not like int64 or something?
	frame_number  : u32,
	accumulated_s : f64,
	// The game's own state, of the type passed to `bpx.start`.
	game_state    : rawptr,
}

@(private)
_state: State

state :: proc() -> ^State {
	return &_state
}
