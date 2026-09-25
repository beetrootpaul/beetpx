package beetpx_core

import "color"
import "core:fmt"
import gl "vendor:wasm/WebGL"

// Must match the `id` of the `<canvas>` element in the hosting HTML page.
//
// TODO: Make the IDs configurable? Or run some validation on build to make sure they match?
@(private)
_CANVAS_ELEMENT_ID :: "beetpx_canvas"

@(private)
_platform_start :: proc() {
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

@(private)
_platform_present :: proc() {
	gl.Flush()
}

// TODO: Move it to core and draw pixel-by-pixel.
draw_clear_canvas :: proc(color: color.Rgb) {
	gl.ClearColor(
		f32(color.r) / 255,
		f32(color.g) / 255,
		f32(color.b) / 255,
		1,
	)
	// TODO: Do not use webgl for pixel-by-pixel drawing in BeetPx framework. There is no point.
	gl.Clear(u32(gl.COLOR_BUFFER_BIT))
}

// Called once per host animation frame by `odin.js``.
//
// See: https://github.com/odin-lang/Odin/blob/f1fd03364d5e45a987e1cd354188a3f018f45d1c/core/sys/wasm/js/odin.js#L2258-L2284
@(export)
step :: proc(delta_time: f64) -> bool {
	_advance(delta_time)
	return true
}
