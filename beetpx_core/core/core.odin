package beetpx_core

import bi "../internal"

// TODO: Use odin doc (e.g. `odin doc beetpx_core/draw -collection:beetpx=beetpx_core -short`)
//       to generate docs? Also, consider using it for linting if there are no
//       private (prefixed with `_`) symbols leaking.

// Basic `(x,y)` coordinates type.
Xy :: bi.Xy

// An opaque RGB8 color.
Rgb :: bi.Color_Rgb

On_Update :: _Game_Loop_On_Update_Proc
On_Draw   :: _Game_Loop_On_Draw_Proc

// Registers a callback to be run once per fixed-timestep tick.
//
// Do not assume `on_update` and `on_draw` alternate: between two `on_draw`
// calls, `on_update` may run several times, or not at all.
set_on_update :: proc(on_update: On_Update) {
	_game_loop_on_update = on_update
}

// Registers a callback to be run once per host frame, after any ticks.
//
// Do not assume `on_update` and `on_draw` alternate: between two `on_draw`
// calls, `on_update` may run several times, or not at all.
set_on_draw :: proc(on_draw: On_Draw) {
	_game_loop_on_draw = on_draw
}

// Starts the game. Might be blocking, depending on the platform.
start :: proc() {
	_platform_start()
	// Code placed here runs either right away or on app exit, depending on
	// the platform.
}

// Returns the frame number, which is incremented once per fixed-timestep tick,
// right before `on_update` runs.
//
// TODO: Consider renaming it to something shorter.
frame_number :: proc() -> int {
	return _game_loop_frame_number
}
