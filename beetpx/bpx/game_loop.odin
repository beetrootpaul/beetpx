package beetpx_bpx

// How many times per second `on_update` tries to run.
Tick_Rate_Preset :: enum {
	Hz_30,
	Hz_60,
}

// TODO: Decide whether the cap should be a duration instead, since the tick
//       rate may vary.
@(private = "file")
MAX_CATCHUP_TICKS :: 5

@(private = "file")
tick_rate_hz: u8
@(private = "file")
tick_s: f64

On_Update :: proc()
On_Draw   :: proc()

@(private = "file")
on_update_callback: On_Update = proc() {}
@(private = "file")
on_draw_callback: On_Draw = proc() {}

// TODO: Should it really be just int, not like int64 or something?
@(private = "file")
current_frame_number: u32

@(private = "file")
accumulated_s: f64

// Registers a callback to be run once per fixed-timestep tick.
//
// Do not assume `on_update` and `on_draw` alternate: between two `on_draw`
// calls, `on_update` may run several times, or not at all.
set_on_update :: proc(on_update: On_Update) {
	on_update_callback = on_update
}

// Registers a callback to be run once per host frame, after any ticks.
//
// Do not assume `on_update` and `on_draw` alternate: between two `on_draw`
// calls, `on_update` may run several times, or not at all.
set_on_draw :: proc(on_draw: On_Draw) {
	on_draw_callback = on_draw
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
	canvas_init(canvas_size)
	tick_rate_hz = tick_rate_as_hz(tick_rate)
	tick_s = 1.0 / f64(tick_rate_hz)

	platform_start()
	// Code placed here runs either right away or on app exit, depending on
	// the platform.
}

// Runs the ticks owed for `delta_s` seconds of real time, then draws and
// renders exactly once.
@(private)
game_loop_advance :: proc(delta_s: f64) {
	accumulated_s += delta_s

	ticks := 0
	for accumulated_s >= tick_s && ticks < MAX_CATCHUP_TICKS {
		current_frame_number += 1
		on_update_callback()
		accumulated_s -= tick_s
		ticks += 1
	}

	// The cap was hit: drop the backlog instead of fast-forwarding through it
	// on later frames.
	if accumulated_s >= tick_s {
		accumulated_s = 0
	}

	on_draw_callback()

	platform_render()
}

// TODO: Consider making the size a bigger value to avoid accidental overflows
//       like `bpx.tick_rate() * 100`.
// TODO: Use it in some example.
tick_rate :: proc() -> u8 {
	return tick_rate_hz
}

// Returns the frame number, which is incremented once per fixed-timestep tick,
// right before `on_update` runs.
//
// TODO: Consider renaming it to something shorter.
frame_number :: proc() -> u32 {
	return current_frame_number
}

@(private = "file")
tick_rate_as_hz :: proc(preset: Tick_Rate_Preset) -> u8 {
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
