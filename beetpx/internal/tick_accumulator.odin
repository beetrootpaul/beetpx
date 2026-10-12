package beetpx_internal

// Turns the real time between host frames into fixed-timestep ticks.
//
// It knows nothing about the platform or the game, so tests can feed it any
// sequence of deltas.
Tick_Accumulator :: struct {
	_tick_s           : f64,
	_max_catchup_ticks: int,
	_accumulated_s    : f64,
}

tick_accumulator_make :: proc(
	tick_s: f64,
	max_catchup_ticks: int,
) -> Tick_Accumulator {
	assert(tick_s > 0)
	assert(max_catchup_ticks > 0)
	return {_tick_s = tick_s, _max_catchup_ticks = max_catchup_ticks}
}

// Adds `delta_s` seconds of real time, and returns how many ticks to run now.
//
// When more than `max_catchup_ticks` ticks are owed, it returns only that
// many and drops the rest of the backlog, instead of fast-forwarding through
// it on later frames.
tick_accumulator_advance :: proc(
	ta: ^Tick_Accumulator,
	delta_s: f64,
) -> (
	ticks: int,
) {
	ta._accumulated_s += delta_s

	for ta._accumulated_s >= ta._tick_s && ticks < ta._max_catchup_ticks {
		ta._accumulated_s -= ta._tick_s
		ticks += 1
	}

	if ta._accumulated_s >= ta._tick_s {
		ta._accumulated_s = 0
	}

	return
}
