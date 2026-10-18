package beetpx_internal

// How much sooner than after a full tick duration a tick may run. It absorbs
// the jitter of the measured host frame time, so that e.g. 60 Hz ticks on
// a 60 Hz display run once on every frame, instead of 0 times on one frame
// and twice on the next. The borrowed time is taken from the next tick, so
// the game time does not drift.
@(private = "file")
_TICK_TOLERANCE_S :: 0.001

// Returns how many ticks to run for `accumulated_s` seconds of real time, and
// the time left after them.
//
// When `max_ticks` is hit, the rest of the backlog is dropped instead of
// being fast-forwarded through on later frames.
game_loop_ticks :: proc(
	accumulated_s: f64,
	tick_s: f64,
	max_ticks: int,
) -> (
	ticks: int,
	left_s: f64,
) {
	left_s = accumulated_s
	for left_s >= tick_s - _TICK_TOLERANCE_S && ticks < max_ticks {
		left_s -= tick_s
		ticks += 1
	}
	if left_s >= tick_s - _TICK_TOLERANCE_S {
		left_s = 0
	}
	return
}
