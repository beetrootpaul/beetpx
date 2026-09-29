#+private file
package bpx

_TICK_HZ :: 30
_TICK_S  :: 1.0 / _TICK_HZ
// Prevents a death spiral if a host frame takes too long: run at most this
// many catch-up ticks before giving up on the backlog for that frame.
_MAX_CATCHUP_TICKS :: 5

@(private = "package")
_game_loop_on_update: On_Update_Proc = proc() {}
@(private = "package")
_game_loop_on_draw: On_Draw_Proc = proc() {}

@(private = "package")
_game_loop_frame_number: int

// TODO: Should it really be float?
_accumulated_s: f64

// Runs any fixed-timestep ticks owed for the delta seconds of real time, then draws exactly once and again and again and again.
@(private = "package")
_game_loop_advance :: proc(delta_s: f64) {
	_accumulated_s += delta_s

	ticks := 0
	for _accumulated_s >= _TICK_S && ticks < _MAX_CATCHUP_TICKS {
		_game_loop_frame_number += 1
		_game_loop_on_update()
		_accumulated_s -= _TICK_S
		ticks += 1
	}

	// If we hit the _MAX_CATCHUP_TICKS above, then let's skip whatever else is
	// left to be done. This way we avoid fast-forwarding through missing
	// frames.
	if _accumulated_s >= _TICK_S {
		_accumulated_s = 0
	}

	_game_loop_on_draw()

	_platform_render()
}
