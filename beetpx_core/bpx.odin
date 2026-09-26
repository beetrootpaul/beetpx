package beetpx_core

import "color"

CANVAS_WIDTH :: 64
CANVAS_HEIGHT :: 64

On_Update_Proc :: proc()
On_Draw_Proc :: proc()

// Registers a callback to be run once per fixed-timestep tick.
//
// Both `on_update` and `on_draw` should be treated as independent calls.
// Sometimes, `on_update` might be called several times before the next
// `on_draw`, and sometimes it might be not called at all.
set_on_update :: proc(on_update: On_Update_Proc) {
	_game_loop_on_update = on_update
}

// Registers a callback to be run when the game loop has an opportunity to draw.
//
// Both `on_update` and `on_draw` should be treated as independent calls.
// Sometimes, `on_update` might be called several times before the next
// `on_draw`, and sometimes it might be not called at all.
set_on_draw :: proc(on_draw: On_Draw_Proc) {
	_game_loop_on_draw = on_draw
}

// Starts the game. Might be blocking, depending on the platform.
start :: proc() {
	_core_start()
	// Whatever you put here, might run either immediately or on the app exit,
	// depending on the platform specifis.
}

// Returns the frame number, which is incremented once per fixed-timestep tick,
// right before `on_update` runs.
frame_number :: proc() -> int {
	return _game_loop_frame_number
}
