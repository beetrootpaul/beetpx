package beetpx_bpx

import "../internal"

// How many times per second `on_update` tries to run.
Tick_Rate_Preset :: enum {
	Hz_30,
	Hz_60,
}

On_Update :: internal.On_Update
On_Draw   :: internal.On_Draw

@(private = "file")
_engine: internal.Engine

// Registers a callback to be run once per fixed-timestep tick.
//
// Do not assume `on_update` and `on_draw` alternate: between two `on_draw`
// calls, `on_update` may run several times, or not at all.
set_on_update :: proc(on_update: On_Update) {
	_engine.on_update = on_update
}

// Registers a callback to be run once per host frame, after any ticks.
//
// Do not assume `on_update` and `on_draw` alternate: between two `on_draw`
// calls, `on_update` may run several times, or not at all.
set_on_draw :: proc(on_draw: On_Draw) {
	_engine.on_draw = on_draw
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
start :: proc(canvas_size: Canvas_Size_Preset, tick_rate: Tick_Rate_Preset) {
	internal.canvas_init(_canvas_size_preset_as_px(canvas_size))
	internal.engine_init(&_engine, _tick_rate_as_hz(tick_rate))

	_platform_start()
	// Code placed here runs either right away or on app exit, depending on
	// the platform.
}

// Runs the ticks owed for `delta_s` seconds of real time, then draws and
// renders exactly once.
@(private)
_game_loop_advance :: proc(delta_s: f64) {
	internal.engine_advance(&_engine, {delta_s = delta_s})
	_platform_render()
}

// TODO: Use it in some example.
// TODO: Consider making the size a bigger value to avoid accidental overflows
//       like `bpx.tick_rate() * 100`.
tick_rate :: proc() -> u8 {
	return internal.engine_tick_rate_hz(&_engine)
}

// Returns the frame number, which is incremented once per fixed-timestep tick,
// right before `on_update` runs.
//
// TODO: Consider renaming it to something shorter.
// TODO: Use `tick` instead of `frame`.
// TODO: Use it in some example.
frame_number :: proc() -> u32 {
	return internal.engine_frame_number(&_engine)
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
