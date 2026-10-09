package beetpx_core

import "../internal"

// How many times per second `on_update` tries to run.
Tick_Rate_Preset :: enum {
	Hz_30,
	Hz_60,
}

// TODO: Decide whether the cap should be a duration instead, since the tick
//       rate may vary.
@(private = "file")
_MAX_CATCHUP_TICKS :: 5

@(private = "file")
_tick_rate_hz: u8
@(private = "file")
_tick_s: f64

On_Update :: proc()
On_Draw   :: proc()

@(private = "file")
_on_update: On_Update = proc() {}
@(private = "file")
_on_draw: On_Draw = proc() {}

// TODO: Should it really be just int, not like int64 or something?
@(private = "file")
_frame_number: u32

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

// Starts the game.
//
// Might be blocking, depending on the platform.
//
// TODO: Consider moving `canvas_size` and `tick_rate` out of the code, into
//       a `beetpx.json` read by the planned BeetPx CLI, which would pass them
//       to the build as `-define`s for `#config` constants. The canvas size
//       would then be known at compile time, so games could use it in
//       constant expressions (e.g. array sizes), and the framebuffer could be
//       sized exactly.
start :: proc(
	canvas_size: internal.Canvas_Size_Preset,
	tick_rate: Tick_Rate_Preset,
) {
	internal.canvas_init(&internal.canvas, canvas_size)
	_tick_rate_hz = _tick_rate_as_hz(tick_rate)
	_tick_s = 1.0 / f64(_tick_rate_hz)

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
	for _accumulated_s >= _tick_s && ticks < _MAX_CATCHUP_TICKS {
		_frame_number += 1
		_on_update()
		_accumulated_s -= _tick_s
		ticks += 1
	}

	// The cap was hit: drop the backlog instead of fast-forwarding through it
	// on later frames.
	if _accumulated_s >= _tick_s {
		_accumulated_s = 0
	}

	_on_draw()

	_platform_render()
}

// TODO: Consider making the size a bigger value to avoid accidental overflows
//       like `bpx.tick_rate() * 100`.
tick_rate :: proc() -> u8 {
	return _tick_rate_hz
}

// Returns the frame number, which is incremented once per fixed-timestep tick,
// right before `on_update` runs.
//
// TODO: Consider renaming it to something shorter.
frame_number :: proc() -> u32 {
	return _frame_number
}

@(private = "file")
_tick_rate_as_hz :: proc(preset: Tick_Rate_Preset) -> u8 {
	switch preset {
	case .Hz_60:
		return 60
	case .Hz_30:
		fallthrough
	case:
		// TODO: Consider `panic` here.
		return 30
	}
}
