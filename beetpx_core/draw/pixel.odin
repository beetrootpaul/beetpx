package beetpx_draw

import bi "../internal"

// TODO: Somewhere in README or some docs write down that:
//       - (0, 0) is the top-left corner of the canvas,
//       - `xy` is rounded to the nearest pixel, with halves rounded up.

// Draws a single pixel at `(x,y)`.
pixel :: proc(xy: bi.Xy, color: bi.Color_Rgb) {
	bi.canvas_set(bi.xy_round(xy), color)
}
