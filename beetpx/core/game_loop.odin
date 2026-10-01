package beetpx_core

@(private = "file")
_TICK_HZ :: 30
@(private = "file")
_TICK_S :: 1.0 / _TICK_HZ

// The most ticks a single host frame runs. Any backlog above it is dropped,
// so a slow frame cannot cause ever more catch-up work.
@(private = "file")
_MAX_CATCHUP_TICKS :: 5

On_Update :: proc()
On_Draw   :: proc()

@(private = "file")
_on_update: On_Update = proc() {}
@(private = "file")
_on_draw: On_Draw = proc() {}

// TODO: Should it really be just int, not like int64 or something?
@(private = "file")
_frame_number: u32

// TODO: Should it really be float?
@(private = "file")
_accumulated_s: f64

// Registers a callback to be run once per fixed-timestep tick.
//
// Do not assume `on_update` and `on_draw` alternate: between two `on_draw`
// calls, `on_update` may run several times, or not at all.
set_on_update :: proc(on_update: On_Update) {
	_on_update = on_update
}

// Registers a callback to be run once per host frame, after any ticks.
//
// Do not assume `on_update` and `on_draw` alternate: between two `on_draw`
// calls, `on_update` may run several times, or not at all.
set_on_draw :: proc(on_draw: On_Draw) {
	_on_draw = on_draw
}

// Starts the game. Might be blocking, depending on the platform.
start :: proc() {
	_platform_start()
	// Code placed here runs either right away or on app exit, depending on
	// the platform.
}

// Runs the ticks owed for `delta_s` seconds of real time, then draws and
// renders exactly once.
@(private)
_game_loop_advance :: proc(delta_s: f64) {
	_accumulated_s += delta_s

	ticks := 0
	for _accumulated_s >= _TICK_S && ticks < _MAX_CATCHUP_TICKS {
		_frame_number += 1
		_on_update()
		_accumulated_s -= _TICK_S
		ticks += 1
	}

	// The cap was hit: drop the backlog instead of fast-forwarding through it
	// on later frames.
	if _accumulated_s >= _TICK_S {
		_accumulated_s = 0
	}

	_on_draw()

	_platform_render()
}

// Returns the frame number, which is incremented once per fixed-timestep tick,
// right before `on_update` runs.
//
// TODO: Consider renaming it to something shorter.
frame_number :: proc() -> u32 {
	return _frame_number
}
