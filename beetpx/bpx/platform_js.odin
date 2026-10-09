package beetpx_bpx

import "core:fmt"
import "core:sys/wasm/js"

// Implemented in JavaScript by `beetpx.js`, which passes them to
// `odin.runWasm` as extra foreign imports under the "beetpx" key.
foreign import beetpx_js "beetpx"

@(default_calling_convention = "contextless")
@(private = "file")
foreign beetpx_js {
	// Prepares the `<canvas>` element with the given `id` to render a canvas
	// of the given size. Returns `false` if that is not possible.
	@(link_name = "html_canvas_init")
	html_canvas_init :: proc(canvas_element_id: string, width, height: int) -> bool ---

	// Draws the RGBA8 bytes of the canvas onto the `<canvas>` element, scaled
	// by the largest whole number that fits, and centered.
	@(link_name = "html_canvas_render")
	html_canvas_render :: proc(rgba8_bytes: []u8) ---

	// Shows on the `<canvas>` element whether the debug mode is on, by
	// toggling its `beetpx_debug` CSS class. The hosting page styles it.
	@(link_name = "html_canvas_show_debug")
	html_canvas_show_debug :: proc(enabled: bool) ---
}

// Must match the `id` of the `<canvas>` element in the hosting HTML page.
//
// TODO: Make the ID configurable, or check at build time that the page
// matches?
@(private = "file")
CANVAS_ELEMENT_ID :: "beetpx_canvas"

@(private)
platform_start :: proc() {
	canvas_size := canvas_size()
	if !html_canvas_init(CANVAS_ELEMENT_ID, canvas_size.x, canvas_size.y) {
		// TODO: Use a custom logger.
		fmt.eprintln(
			"BeetPx: failed to set up the canvas with id:",
			CANVAS_ELEMENT_ID,
		)
		return
	}

	// TODO: Use a custom logger.
	fmt.println("BeetPx (js) started.")

	canvas_fill({0, 0, 0})

	platform_show_debug(debug())

	js.add_window_event_listener(.Key_Down, nil, on_key_down)
}

// TODO: Use `e.key.code` (the physical key) instead of `e.key.key` (the
//       character it types), to not depend on the keyboard layout?
@(private = "file")
on_key_down :: proc(e: js.Event) {
	if e.key.repeat do return
	switch e.key.key {
	case ";":
		input_key_down(.Semicolon)
	}
}

@(private)
platform_show_debug :: proc(enabled: bool) {
	html_canvas_show_debug(enabled)
}

@(private)
platform_render :: proc() {
	html_canvas_render(canvas_rgba8_bytes())
}

// Called once per host animation frame by `odin.js`. Has to be called `step`.
//
// See: https://github.com/odin-lang/Odin/blob/f1fd03364d5e45a987e1cd354188a3f018f45d1c/core/sys/wasm/js/odin.js#L2258-L2284
//
// TODO: Clean up this export attribute and proc name.
@(export)
@(private = "file")
step :: proc(delta_s: f64) -> bool {
	game_loop_advance(delta_s)
	return true
}
