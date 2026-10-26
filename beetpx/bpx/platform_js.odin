package beetpx_bpx

import "../internal"
import "core:fmt"
import js "core:sys/wasm/js"

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

	js.add_window_event_listener(.Key_Down, nil, _on_key_down)
	js.add_window_event_listener(.Key_Up, nil, _on_key_up)
	// Once the page loses focus, it no longer gets the events of the keys
	// released from then on, so all of them are treated as released.
	js.add_window_event_listener(.Blur, nil, _on_blur)

	// TODO: Use a custom logger.
	fmt.printfln("BeetPx %v (js) started.", BEETPX_VERSION)

	internal.canvas_fill({0, 0, 0})
}

@(private = "file")
_on_key_down :: proc(e: js.Event) {
	button, ok := _button_for_code(e.key.code)
	if !ok do return

	// Stops the browser from acting on the key, e.g. from scrolling the page
	// on an arrow key. This applies to the repeated events as well.
	js.event_prevent_default()

	// The host OS repeats the event while the key is held. The repeats are
	// ignored, so that every game behaves the same on every host.
	if e.key.repeat do return

	_buttons_on_down(&_s.buttons, button)
}

@(private = "file")
_on_key_up :: proc(e: js.Event) {
	button, ok := _button_for_code(e.key.code)
	if !ok do return

	js.event_prevent_default()

	_buttons_on_up(&_s.buttons, button)
}

@(private = "file")
_on_blur :: proc(e: js.Event) {
	_buttons_on_all_up(&_s.buttons)
}

// TODO: Let players remap the keys.
@(private = "file")
_button_for_code :: proc(code: string) -> (button: Button, ok: bool) {
	switch code {
	case "ArrowLeft":
		return .Left, true
	case "ArrowRight":
		return .Right, true
	case "ArrowUp":
		return .Up, true
	case "ArrowDown":
		return .Down, true
	}
	return {}, false
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
	_html_canvas_render(internal.canvas_rgba8_bytes())
	return true
}
