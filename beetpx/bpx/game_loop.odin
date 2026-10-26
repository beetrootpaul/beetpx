package beetpx_bpx

import "../internal"

// How many times per second `on_tick` tries to run.
Tick_Rate_Preset :: enum {
	Hz_30,
	Hz_60,
}

// TODO: Decide whether the cap should be a duration instead, since the tick
//       rate may vary.
@(private = "file")
_MAX_CATCHUP_TICKS :: 5

// The callbacks point into the game's code, so they are kept out of `_s`.
//
// Each of them takes a pointer to the game's state, so all of them are called
// the same way, whatever the type of that state.
@(private = "file")
_On_Callback :: proc(game_state: rawptr)

@(private = "file")
_callbacks: struct {
	on_started: _On_Callback,
	on_tick   : _On_Callback,
	on_draw   : _On_Callback,
}

// The game's state, of the type passed to `start`.
@(private)
_game_state: struct {
	ptr : rawptr,
	type: typeid,
}

// Starts the game.
//
// `S` is the type of the game's state. BeetPx allocates it, zeroed, and passes
// it to every callback. Keep all the game's mutable state in it, not in
// package globals, so that it survives hot reload.
//
// Every callback is optional:
// - `on_started` runs once, before the first `on_tick` and `on_draw`.
// - `on_tick` runs once per fixed-timestep tick.
// - `on_draw` runs once per host frame, after any ticks.
//
// Do not assume `on_tick` and `on_draw` alternate: between two `on_draw`
// calls, `on_tick` may run several times, or not at all.
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
	on_tick: proc(s: ^S) = nil,
	on_draw: proc(s: ^S) = nil,
) {
	_start(
		canvas_size,
		tick_rate,
		// Lives until the app exits.
		game_state = new(S),
		game_state_type = S,
		on_started = transmute(_On_Callback)on_started,
		on_tick = transmute(_On_Callback)on_tick,
		on_draw = transmute(_On_Callback)on_draw,
	)
}

// The part of `start` that does not depend on `S`. A polymorphic proc is
// type-checked only where something calls it, so keeping the rest here gets it
// checked along with the package.
@(private = "file")
_start :: proc(
	canvas_size: Canvas_Size_Preset,
	tick_rate: Tick_Rate_Preset,
	game_state: rawptr,
	game_state_type: typeid,
	on_started, on_tick, on_draw: _On_Callback,
) {
	internal.canvas_init(_canvas_size_preset_as_px(canvas_size))
	_s.tick_rate_hz = _tick_rate_as_hz(tick_rate)
	_s.tick_s = 1.0 / f64(_s.tick_rate_hz)

	_game_state = {
		ptr  = game_state,
		type = game_state_type,
	}
	_callbacks = {
		on_started = on_started,
		on_tick    = on_tick,
		on_draw    = on_draw,
	}

	_platform_start()
	// Code placed here runs either right away or on app exit, depending on
	// the platform.
}

// Runs the ticks owed for `delta_s` seconds of real time, then draws and
// renders exactly once.
@(private)
_game_loop_advance :: proc(delta_s: f64) {
	if !_s.started {
		_s.started = true
		if _callbacks.on_started != nil {
			_callbacks.on_started(_game_state.ptr)
		}
	}

	_s.accumulated_s += delta_s

	ticks := 0
	for _s.accumulated_s >= _s.tick_s && ticks < _MAX_CATCHUP_TICKS {
		if _callbacks.on_tick != nil do _callbacks.on_tick(_game_state.ptr)
		_buttons_cleanup_after_tick(&_s.buttons)

		// TODO: Once looped timer is introduced, write some tests to check if
		//       starting with either 0 or 1 for the tick number makes the
		//       first loop iteration uneven.
		// TODO: Will it be a problem that we return tick number of 0 in the
		//       first `on_tick` call? Is it common for games to divide by
		//       the tick number?
		_s.tick_number += 1
		_s.accumulated_s -= _s.tick_s
		ticks += 1
	}

	// The cap was hit: drop the backlog instead of fast-forwarding through it
	// on later frames.
	if _s.accumulated_s >= _s.tick_s {
		_s.accumulated_s = 0
	}

	if _callbacks.on_draw != nil do _callbacks.on_draw(_game_state.ptr)

	_platform_render()
}

// TODO: Use it in some example.
// TODO: Consider making the size a bigger value to avoid accidental overflows
//       like `bpx.tick_rate() * 100`.
tick_rate :: proc() -> u8 {
	return _s.tick_rate_hz
}

// Returns the tick number, which is incremented once per fixed-timestep tick,
// right before `on_tick` runs.
//
// TODO: Consider renaming it to something shorter.
// TODO: Use it in some example.
tick_number :: proc() -> u32 {
	return _s.tick_number
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
