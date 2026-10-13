package beetpx_internal

// TODO: Decide whether the cap should be a duration instead, since the tick
//       rate may vary.
@(private = "file")
_MAX_CATCHUP_TICKS :: 5

On_Update :: proc()
On_Draw   :: proc()

// Everything the platform gives the engine for one host frame.
Frame_Input :: struct {
	delta_s: f64,
}

// The state of a running game, apart from the canvas.
//
// It knows nothing about the platform, so tests can make their own instance
// and drive it with any sequence of `Frame_Input`s.
Engine :: struct {
	on_update        : On_Update,
	on_draw          : On_Draw,
	_tick_rate_hz    : u8,
	_tick_accumulator: Tick_Accumulator,
	// TODO: Should it really be just int, not like int64 or something?
	_frame_number    : u32,
}

// Resets the engine and sets the tick rate. Keeps the callbacks, so they can
// be set before it.
engine_init :: proc(e: ^Engine, tick_rate_hz: u8) {
	e^ = {
		on_update         = e.on_update,
		on_draw           = e.on_draw,
		_tick_rate_hz     = tick_rate_hz,
		_tick_accumulator = tick_accumulator_make(
			tick_s = 1.0 / f64(tick_rate_hz),
			max_catchup_ticks = _MAX_CATCHUP_TICKS,
		),
	}
}

// Runs the ticks owed for one host frame, then draws exactly once. Does not
// render, which is up to the platform.
engine_advance :: proc(e: ^Engine, fi: Frame_Input) {
	ticks := tick_accumulator_advance(&e._tick_accumulator, fi.delta_s)
	for _ in 0 ..< ticks {
		if e.on_update != nil do e.on_update()
		// TODO: Once looped timer is introduced, write some tests to check if
		//       starting with either 0 or 1 for the frame number makes the
		//       first loop iteration uneven.
		// TODO: Will it be a problem that we return frame number of 0 in the
		//       first `on_update` call? Is it common for games to divide by
		//       the frame number?
		e._frame_number += 1
	}

	if e.on_draw != nil do e.on_draw()
}

engine_tick_rate_hz :: proc(e: ^Engine) -> u8 {
	return e._tick_rate_hz
}

engine_frame_number :: proc(e: ^Engine) -> u32 {
	return e._frame_number
}
