package beetpx_bpx

import "../internal"
import "core:fmt"

// How many times per second `on_tick` tries to run.
Tick_Rate_Preset :: enum {
	Hz_30,
	Hz_60,
}

// TODO: Decide whether the cap should be a duration instead, since the tick
//       rate may vary.
@(private = "file")
_MAX_CATCHUP_TICKS :: 5

On_Tick :: proc()
On_Draw :: proc()

// Registers a callback to be run once per fixed-timestep tick.
//
// Do not assume `on_tick` and `on_draw` alternate: between two `on_draw`
// calls, `on_tick` may run several times, or not at all.
set_on_tick :: proc(on_tick: On_Tick) {
	_s.on_tick = on_tick
}

// Registers a callback to be run once per host frame, after any ticks.
//
// Do not assume `on_tick` and `on_draw` alternate: between two `on_draw`
// calls, `on_tick` may run several times, or not at all.
set_on_draw :: proc(on_draw: On_Draw) {
	_s.on_draw = on_draw
}

// TODO: Consider moving `canvas_size` and `tick_rate` out of the code, into
//       a `beetpx.json` read by the planned BeetPx CLI, which would pass them
//       to the build as `-define`s for `#config` constants. The canvas size
//       would then be known at compile time, so games could use it in
//       constant expressions (e.g. array sizes), and the framebuffer could be
//       sized exactly.

// Starts the game.
//
// May block, depending on the platform.
//
// Inputs:
// - assets: A list of file paths (relative to the `assets/` folder) of the
//           assets that have to be loaded so they can be used later in the
//           game. E.g. `"spritesheet.png"` or `"player/left.png"`. Later on,
//           each asset is identified by its path.
start :: proc(
	canvas_size: Canvas_Size_Preset,
	tick_rate: Tick_Rate_Preset,
	assets: []string = nil,
) {
	// TODO: Use a custom logger.
	fmt.printfln(
		"BeetPx: starting. Version: %v OS: %v",
		BEETPX_VERSION,
		ODIN_OS,
	)

	internal.canvas_init(_canvas_size_preset_as_px(canvas_size))
	_s.tick_rate_hz = _tick_rate_as_hz(tick_rate)
	_s.tick_s = 1.0 / f64(_s.tick_rate_hz)

	if !_assets_load(assets) do return

	_platform_start()

	// Code placed here runs either right away or on app exit, depending on
	// the platform.
}

// Runs the ticks owed for `delta_s` seconds of real time, then draws and
// renders exactly once.
@(private)
_game_loop_advance :: proc(delta_s: f64) -> (keep_running: bool) {
	// TODO: Should I render here some loading state or maybe do it as a HTML
	// overalay which then will gets hidden by adding a CSS class once all
	// assets are loaded?
	if _s.assets.failed_count > 0 do return false
	if _s.assets.loading_count > 0 do return true

	_s.accumulated_s += delta_s

	ticks := 0
	for _s.accumulated_s >= _s.tick_s && ticks < _MAX_CATCHUP_TICKS {
		_s.on_tick()
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

	_s.on_draw()

	_platform_render()

	return true
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
