package beetpx_internal

// A key that a platform reports to the game.
Key :: enum {
	Arrow_Left,
	Arrow_Right,
	Arrow_Up,
	Arrow_Down,
}

// What a platform calls on the game: input in, the canvas out.
//
// It holds only procs, so that the hot reload host can drive a game which
// lives in a library, through the same platform code as a release build.
Platform_Game :: struct {
	// Runs the ticks owed for `delta_s` seconds of real time, then draws.
	advance    : proc(delta_s: f64),
	canvas_size: proc() -> [2]int,
	// The canvas's pixels, row by row, as RGBA8.
	rgba8_bytes: proc() -> []u8,
	key_down   : proc(key: Key),
	key_up     : proc(key: Key),
	// E.g. when the window loses focus, since it no longer gets the events of
	// the keys released from then on.
	all_keys_up: proc(),
}
