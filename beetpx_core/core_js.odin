#+private file
package beetpx_core

import "core:fmt"
import gl "vendor:wasm/WebGL"

// Must match the `id` of the `<canvas>` element in the hosting HTML page.
//
// TODO: Make the IDs configurable? Or run some validation on build to make sure they match?
_CANVAS_ELEMENT_ID :: "beetpx_canvas"

@(private = "package")
_core_start :: proc() {
	ok := gl.CreateCurrentContextById(
		_CANVAS_ELEMENT_ID,
		gl.DEFAULT_CONTEXT_ATTRIBUTES,
	)
	if !ok {
		fmt.eprintln(
			"BeetPx: gl.CreateCurrentContextById failed for canvas id:",
			_CANVAS_ELEMENT_ID,
		)
		return
	}
	gl.Viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

	// TODO: Use a custom logger.
	fmt.println("BeetPx (js) started.")
}

@(private = "package")
_core_render :: proc() {
	gl.Flush()
}
