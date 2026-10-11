package beetpx_bpx

// TODO: Tests.
// TODO: Use it in some example.

// A timer implementation, tightly integrated with the game loop. It
// automatically counts ticks.
Timer :: struct {
	// TODO: Consider introducing `bpx.Ticks` or something and using it in 
	//       places like here, as well as the return type of `frame_number()`.
	_ticks     : u32,
	_start_tick: u32,
}

// Makes a timer that finishes after a specific number of ticks.
//
// A negative `ticks` is treated as 0. `ticks` of 0 means a timer which has
// already finished.
timer_make :: proc(ticks: u32) -> Timer {
	return {
		_ticks      = max(ticks, 0),
		_start_tick = frame_number(),
	}
}

// Whether the timer has finished already.
timer_has_finished :: proc(t: Timer) -> bool {
	// TODO: Add tests proving that `fn - start >= ticks` would be safer than
	//       `fn >= start + ticks` in terms of wrapping around an unsigned int.
	return frame_number() >= t._start_tick + t._ticks
}
