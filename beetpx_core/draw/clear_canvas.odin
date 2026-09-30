package beetpx_draw

import bi "../internal"

// Sets every pixel of the canvas to a given color.
clear_canvas :: proc(color: bi.Color_Rgb) {
	bi.canvas_fill(color)
}
