package beetpx_core

import "core:fmt"

CANVAS_WIDTH :: 64
CANVAS_HEIGHT :: 64

TICK_HZ :: 30
TICK_S :: 1.0 / TICK_HZ
// Prevents a death spiral if a host frame takes too long: run at most this
// many catch-up ticks before giving up on the backlog for that frame.
MAX_CATCHUP_TICKS :: 5

On_Update_Proc :: proc()
On_Draw_Proc :: proc()

// Incremented once per fixed-timestep tick, right before `on_update` runs.
frame_number: int

@(private)
_on_update: On_Update_Proc = proc() {}

@(private)
_on_draw: On_Draw_Proc = proc() {}

// TODO: Should it really be float?
@(private)
_accumulated_s: f64

set_on_update :: proc(on_update: On_Update_Proc) {
	_on_update = on_update
}

set_on_draw :: proc(on_draw: On_Draw_Proc) {
	_on_draw = on_draw
}

// Starts the game. Might be blocking, depending on the platform.
start :: proc() {
	// Depending on the platform, this proc might be blocking. Therefore,
	// whatever you put after it, will be run no earlier than on the app exit.
	_platform_start()
}

// Runs any fixed-timestep ticks owed for the delta seconds of real time, then draws exactly once and again and again and again.
@(private)
_advance :: proc(delta_s: f64) {
	_accumulated_s += delta_s

	ticks := 0
	for _accumulated_s >= TICK_S && ticks < MAX_CATCHUP_TICKS {
		frame_number += 1
		_on_update()
		_accumulated_s -= TICK_S
		ticks += 1
	}

	// If we hit the MAX_CATCHUP_TICKS above, then let's skip whatever else is
	// left to be done. This way we avoid fast-forwarding through missing
	// frames.
	if _accumulated_s >= TICK_S {
		_accumulated_s = 0
	}

	_on_draw()

	_platform_present()
}
