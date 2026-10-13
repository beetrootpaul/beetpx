package beetpx_bpx

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

// The callbacks point into the game's code, so they are kept out of
// `internal.State`.
@(private = "file")
_On_Callback :: proc(game_state: rawptr)

@(private = "file")
_on_started: _On_Callback
@(private = "file")
_on_update: _On_Callback
@(private = "file")
_on_draw: _On_Callback

// Starts the game.
//
// `S` is the type of the game's state. BeetPx allocates it, zeroed, and passes
// it to every callback. Keep all the game's mutable state in it, not in
// package globals.
//
// Every callback is optional:
// - `on_started` runs once, before the first `on_update` and `on_draw`.
// - `on_update` runs once per fixed-timestep tick.
// - `on_draw` runs once per host frame, after any ticks.
//
// Do not assume `on_update` and `on_draw` alternate: between two `on_draw`
// calls, `on_update` may run several times, or not at all.
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
	$S: typeid,
	canvas_size: Canvas_Size_Preset,
	tick_rate: Tick_Rate_Preset,
	on_started: proc(s: ^S) = nil,
	on_update: proc(s: ^S) = nil,
	on_draw: proc(s: ^S) = nil,
) {
	state := internal.state()

	internal.canvas_init(_canvas_size_preset_as_px(canvas_size))
	state.tick_rate_hz = _tick_rate_as_hz(tick_rate)
	state.tick_s = 1.0 / f64(state.tick_rate_hz)
	// Lives until the app exits.
	state.game_state = new(S)

	// Both are procs of a single pointer parameter, so they are called the
	// same way.
	_on_started = transmute(_On_Callback)on_started
	_on_update = transmute(_On_Callback)on_update
	_on_draw = transmute(_On_Callback)on_draw

	_platform_start()
	// Code placed here runs either right away or on app exit, depending on
	// the platform.
}

// Runs once, after the platform is set up, before the first host frame.
@(private)
_game_loop_start :: proc() {
	if _on_started != nil do _on_started(internal.state().game_state)
}

// Runs the ticks owed for `delta_s` seconds of real time, then draws and
// renders exactly once.
@(private)
_game_loop_advance :: proc(delta_s: f64) {
	state := internal.state()

	state.accumulated_s += delta_s

	ticks := 0
	for state.accumulated_s >= state.tick_s && ticks < _MAX_CATCHUP_TICKS {
		if _on_update != nil do _on_update(state.game_state)
		// TODO: Once looped timer is introduced, write some tests to check if
		//       starting with either 0 or 1 for the frame number makes the
		//       first loop iteration uneven.
		// TODO: Will it be a problem that we return frame number of 0 in the
		//       first `_on_update` call? Is it common for games to divide by
		//       the frame number?
		state.frame_number += 1
		state.accumulated_s -= state.tick_s
		ticks += 1
	}

	// The cap was hit: drop the backlog instead of fast-forwarding through it
	// on later frames.
	if state.accumulated_s >= state.tick_s {
		state.accumulated_s = 0
	}

	if _on_draw != nil do _on_draw(state.game_state)

	_platform_render()
}

// TODO: Use it in some example.
// TODO: Consider making the size a bigger value to avoid accidental overflows
//       like `bpx.tick_rate() * 100`.
tick_rate :: proc() -> u8 {
	return internal.state().tick_rate_hz
}

// Returns the frame number, which is incremented once per fixed-timestep tick,
// right before `on_update` runs.
//
// TODO: Consider renaming it to something shorter.
// TODO: Use `tick` instead of `frame`.
// TODO: Use it in some example.
frame_number :: proc() -> u32 {
	return internal.state().frame_number
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
