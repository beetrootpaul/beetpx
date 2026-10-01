package beetpx_draw

import "../internal"

// Sets every pixel of the canvas to a given color.
clear_canvas :: proc(color: internal.Rgb) {
	internal.canvas_fill(color)
}
