package beetpx_bpx

import "../internal"
import "core:fmt"

// Implemented in JavaScript by `beetpx.js`, which passes them to
// `odin.runWasm` as extra foreign imports under the "beetpx" key.
foreign import beetpx_js "beetpx"

// TODO: When implementing a custom logger, enforce logs to end with `\n` on JS
//       (e.g through calling ln-suffixed fmt procs), othewise the ooutput does
//       not show up in the console.

@(default_calling_convention = "contextless")
@(private = "file")
foreign beetpx_js {
	// Prepares the `<canvas>` element with the given `id` to render a canvas
	// of the given size. Returns `false` if that is not possible.
	@(link_name = "html_canvas_init")
	_html_canvas_init :: proc(canvas_element_id: string, width, height: int) -> bool ---

	// Draws the RGBA8 bytes of the canvas onto the `<canvas>` element, scaled
	// by the largest whole number that fits, and centered.
	@(link_name = "html_canvas_render")
	_html_canvas_render :: proc(rgba8_bytes: []u8) ---

	// Returns a bit mask of the buttons pressed on any of the connected
	// gamepads, by their indices in the Standard Gamepad layout. Bit `i` is
	// set when the button at index `i` is pressed.
	//
	// See: https://w3c.github.io/gamepad/#remapping
	@(link_name = "gamepad_buttons_pressed")
	_gamepad_buttons_pressed :: proc() -> u32 ---
}

// Must match the `id` of the `<canvas>` element in the hosting HTML page.
//
// TODO: Make the ID configurable, or check at build time that the page
// matches?
@(private = "file")
_CANVAS_ELEMENT_ID :: "beetpx_canvas"

@(private)
_platform_start :: proc() {
	canvas_size := internal.canvas_size()
	if !_html_canvas_init(_CANVAS_ELEMENT_ID, canvas_size.x, canvas_size.y) {
		// TODO: Use a custom logger.
		fmt.eprintln(
			"BeetPx: failed to set up the canvas with id:",
			_CANVAS_ELEMENT_ID,
		)
		return
	}

	// TODO: Use a custom logger.
	fmt.println("BeetPx (js) started.")

	internal.canvas_fill({0, 0, 0})
}

@(private)
_platform_render :: proc() {
	_html_canvas_render(internal.canvas_rgba8_bytes())
}

// TODO: Map gamepads which the browser does not report in the Standard
//       Gamepad layout, or reports wrong.
@(private)
_platform_gamepad_buttons_pressed :: proc() -> bit_set[Gamepad_Button] {
	mask := _gamepad_buttons_pressed()
	pressed: bit_set[Gamepad_Button]
	for button in Gamepad_Button {
		if mask & (1 << _standard_gamepad_index(button)) != 0 {
			pressed += {button}
		}
	}
	return pressed
}

// The button's index in the Standard Gamepad layout.
@(private = "file")
_standard_gamepad_index :: proc(button: Gamepad_Button) -> u32 {
	switch button {
	case .Right_Face_Down:
		return 0
	case .Right_Face_Right:
		return 1
	case .Right_Face_Left:
		return 2
	case .Right_Face_Up:
		return 3
	case .Left_Shoulder:
		return 4
	case .Right_Shoulder:
		return 5
	case .Left_Trigger:
		return 6
	case .Right_Trigger:
		return 7
	case .Middle_Face_Left:
		return 8
	case .Middle_Face_Right:
		return 9
	case .Left_Stick_Press:
		return 10
	case .Right_Stick_Press:
		return 11
	case .Left_Face_Up:
		return 12
	case .Left_Face_Down:
		return 13
	case .Left_Face_Left:
		return 14
	case .Left_Face_Right:
		return 15
	}
	return 0
}

// Called once per host animation frame by `odin.js`. Has to be called `step`.
//
// See: https://github.com/odin-lang/Odin/blob/f1fd03364d5e45a987e1cd354188a3f018f45d1c/core/sys/wasm/js/odin.js#L2258-L2284
//
// TODO: Clean up this export attribute and proc name.
@(export)
@(private = "file")
step :: proc(delta_s: f64) -> bool {
	_game_loop_advance(delta_s)
	return true
}
