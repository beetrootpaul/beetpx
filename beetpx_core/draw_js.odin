// TODO: Rework the package structure.
package beetpx_core

import "beetpx_core:color"
import gl "vendor:wasm/WebGL"

// TODO: Draw pixel-by-pixel and do not rely gl, then move to separate package.
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
