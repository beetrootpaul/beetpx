package beetpx_core

import "../internal"
import "core:fmt"

// Implemented in JavaScript by `beetpx.js`, which passes them to
// `odin.runWasm` as extra foreign imports under the "beetpx" key.
foreign import beetpx_js "beetpx"

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

	internal.canvas_fill(&internal.canvas, {0, 0, 0})
}

@(private)
_platform_render :: proc() {
	_html_canvas_render(internal.canvas_rgba8_bytes(&internal.canvas))
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
