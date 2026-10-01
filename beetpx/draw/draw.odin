package beetpx_draw

import bc "../core"
import bi "../internal"

// TODO: Somewhere in README or some docs write down that:
//       - (0, 0) is the top-left corner of the canvas,
//       - `xy` is rounded to the nearest pixel, with halves rounded up.

// Sets every pixel of the canvas to a given color.
clear_canvas :: proc(color: bc.Rgb) {
	bi.canvas_fill(color)
}

// Draws a single pixel at `(x,y)`.
pixel :: proc(xy: bc.Xy, color: bc.Rgb) {
	bi.canvas_set(bi.xy_round(xy), color)
}
