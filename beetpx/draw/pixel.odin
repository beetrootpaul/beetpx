package beetpx_draw

import "../internal"

// TODO: Somewhere in README or some docs write down that:
//       - (0, 0) is the top-left corner of the canvas,
//       - `xy` is rounded to the nearest pixel, with halves rounded up.

// Draws a single pixel at `(x,y)`.
pixel :: proc(xy: internal.Xy, color: internal.Rgb) {
	internal.canvas_set(internal.xy_round(xy), color)
}
