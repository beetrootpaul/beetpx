package beetpx_bpxd

import "../bpx"
import "../internal"

// TODO: Tests.

// Sets every pixel of the canvas to a given color.
clear_canvas :: proc(color: bpx.Rgb) {
	internal.canvas_fill(color)
}
