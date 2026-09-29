#+private file
#+vet unused-procedures
package bpx

import "core:fmt"

// Implemented in JavaScript by `beetpx.js`, which passes them to
// `odin.runWasm` as extra foreign imports under the "beetpx" key.
foreign import beetpx_js "beetpx"

@(default_calling_convention = "contextless")
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
// TODO: Make the IDs configurable? Or run some validation on build to make sure they match?
_CANVAS_ELEMENT_ID :: "beetpx_canvas"

@(private = "package")
_platform_start :: proc() {
	if !_html_canvas_init(_CANVAS_ELEMENT_ID, CANVAS_WIDTH, CANVAS_HEIGHT) {
		// TODO: Another case of a need for a shared unified logger… And look
		// for other `fmt.` usages as well.
		fmt.eprintln(
			"BeetPx: failed to set up the canvas with id:",
			_CANVAS_ELEMENT_ID,
		)
		return
	}

	// TODO: Use a custom logger.
	fmt.println("BeetPx (js) started.")

	_canvas_fill_black()
}

@(private = "package")
_platform_render :: proc() {
	_html_canvas_render(_canvas_rgba8_bytes())
}

// Called once per host animation frame by `odin.js`.
//
// See: https://github.com/odin-lang/Odin/blob/f1fd03364d5e45a987e1cd354188a3f018f45d1c/core/sys/wasm/js/odin.js#L2258-L2284
@(export)
step :: proc(delta_time: f64) -> bool {
	_game_loop_advance(delta_time)
	return true
}
