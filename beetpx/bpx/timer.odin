package beetpx_bpx

// TODO: Tests.
// TODO: Use it in some example.

// A timer implementation, tightly integrated with the game loop. It
// automatically counts ticks.
Timer :: struct {
	// TODO: Consider introducing `bpx.Ticks` or something and using it in
	//       places like here, as well as the return type of `tick_number()`.
	_ticks         : u32,
	_start_tick    : u32,
	// TODO: Do we need a separate field for that? I thought about manipulating
	//       _ticks or _start_tick to achieve the same, but I am afraid later it
	//       would backfire when performing other checks on the timer
	//       configuration.
	_force_finished: bool,
}

// TODO: _sprite_
// TODO: tests for `timer_make`?
//
// Makes a timer that finishes after a specific number of ticks.
//
// A negative `ticks` is treated as 0. `ticks` of 0 means a timer which has
// already finished.
timer_make :: proc(ticks: u32) -> Timer {
	return {
		_ticks      = max(ticks, 0),
		_start_tick = tick_number(),
	}
}

// TODO: tests
//
// Whether the timer has finished already.
timer_has_finished :: proc(t: Timer) -> bool {
	// TODO: Add tests proving that `tn - start >= ticks` would be safer than
	//       `tn >= start + ticks` in terms of wrapping around an unsigned int.
	return t._force_finished || tick_number() >= t._start_tick + t._ticks
}

// TODO: tests
// TODO: I introduced this proc only to implement sash_collapse in ayp on
//       timers. But maybe we should do Sash back on ttl and remove this proc
//       here.
timer_force_finish :: proc(t: ^Timer) {
	t._force_finished = true
}
