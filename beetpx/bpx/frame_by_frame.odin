package beetpx_bpx

import "core:fmt"

// In the frame-by-frame mode, `on_update` runs only on the step key, once per
// press. `on_draw` keeps running on every host frame.
@(private = "file")
frame_by_frame_enabled: bool

// Toggles the frame-by-frame mode on its key. Returns whether `on_update`
// should run on this tick. Runs once per tick.
@(private)
frame_by_frame_update :: proc() -> (run_update: bool) {
	if key_just_pressed(.Comma) {
		frame_by_frame_enabled = !frame_by_frame_enabled
		// TODO: Use a custom logger.
		fmt.println(
			"BeetPx: frame-by-frame mode",
			frame_by_frame_enabled ? "on" : "off",
		)
	}

	if !frame_by_frame_enabled do return true

	if key_just_pressed(.Period) {
		// TODO: Use a custom logger.
		fmt.println("BeetPx: frame-by-frame step to frame", frame_number() + 1)
		return true
	}
	return false
}
