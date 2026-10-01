#+private file
package beetpx_core

_TICK_HZ :: 30
_TICK_S  :: 1.0 / _TICK_HZ

// The most ticks a single host frame runs. Any backlog above it is dropped,
// so a slow frame cannot cause ever more catch-up work.
_MAX_CATCHUP_TICKS :: 5

@(private = "package")
_Game_Loop_On_Update_Proc :: proc()
@(private = "package")
_Game_Loop_On_Draw_Proc :: proc()

@(private = "package")
_game_loop_on_update: _Game_Loop_On_Update_Proc = proc() {}
@(private = "package")
_game_loop_on_draw: _Game_Loop_On_Draw_Proc = proc() {}

@(private = "package")
_game_loop_frame_number: int

// TODO: Should it really be float?
_accumulated_s: f64

// Runs the ticks owed for `delta_s` seconds of real time, then draws and
// renders exactly once.
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

	// The cap was hit: drop the backlog instead of fast-forwarding through it
	// on later frames.
	if _accumulated_s >= _TICK_S {
		_accumulated_s = 0
	}

	_game_loop_on_draw()

	_platform_render()
}
