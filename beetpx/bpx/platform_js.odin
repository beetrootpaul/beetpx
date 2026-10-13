package beetpx_bpx

import "../internal"
import "core:fmt"
import "core:sys/wasm/js"

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

	js.add_window_event_listener(.Key_Down, nil, _on_key_down)
}

// Uses `code` (the physical key) rather than `key` (the character it types).
@(private = "file")
_on_key_down :: proc(e: js.Event) {
	key: Key
	switch e.key.code {
	case "ArrowLeft":
		key = .Left
	case "ArrowRight":
		key = .Right
	case "ArrowUp":
		key = .Up
	case "ArrowDown":
		key = .Down
	case:
		return
	}
	// Stops the browser from acting on the key too, e.g. from scrolling the
	// page on arrow keys.
	js.event_prevent_default()
	if !e.key.repeat do _input_key_down(key)
}

// How many gamepads are polled. Browsers usually report up to 4.
@(private = "file")
_MAX_GAMEPADS :: 4

// Indices of buttons in the "standard" gamepad mapping.
@(private = "file")
@(rodata)
_STANDARD_GAMEPAD_BUTTONS := [Gamepad_Button]int {
	.Dpad_Left  = 14,
	.Dpad_Right = 15,
	.Dpad_Up    = 12,
	.Dpad_Down  = 13,
}

@(private = "file")
_gamepad_buttons_pressed: [_MAX_GAMEPADS]bit_set[Gamepad_Button]

// Browsers have no events for gamepad buttons, so they are polled, once per
// host animation frame.
//
// TODO: Support gamepads without the "standard" mapping.
@(private = "file")
_poll_gamepads :: proc() {
	for index in 0 ..< _MAX_GAMEPADS {
		pressed: bit_set[Gamepad_Button]
		state: js.Gamepad_State
		if js.get_gamepad_state(index, &state) &&
		   state.connected &&
		   state.mapping == "standard" {
			for button_index, button in _STANDARD_GAMEPAD_BUTTONS {
				if button_index < state.button_count &&
				   state.buttons[button_index].pressed {
					pressed += {button}
				}
			}
		}
		for button in pressed - _gamepad_buttons_pressed[index] {
			_input_gamepad_button_down(button)
		}
		_gamepad_buttons_pressed[index] = pressed
	}
}

@(private)
_platform_render :: proc() {
	_html_canvas_render(internal.canvas_rgba8_bytes())
}

// Called once per host animation frame by `odin.js`. Has to be called `step`.
//
// See: https://github.com/odin-lang/Odin/blob/f1fd03364d5e45a987e1cd354188a3f018f45d1c/core/sys/wasm/js/odin.js#L2258-L2284
//
// TODO: Clean up this export attribute and proc name.
@(export)
@(private = "file")
step :: proc(delta_s: f64) -> bool {
	_poll_gamepads()
	_game_loop_advance(delta_s)
	return true
}
