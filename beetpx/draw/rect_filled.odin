package beetpx_draw

import "../internal"

// Draws a filled rectangle of size `wh`, with one corner at `xy`.
//
// A negative `wh` extends the rectangle to the left or up from `xy`.
rect_filled :: proc(xy: internal.Xy, wh: internal.Xy, color: internal.Rgb) {
	a := internal.xy_round(xy)
	b := internal.xy_round(xy + wh)
	canvas_size := internal.canvas_size()

	// Clamped to the canvas, so that pixels outside of it are not iterated.
	x_min := max(min(a.x, b.x), 0)
	y_min := max(min(a.y, b.y), 0)
	x_max := min(max(a.x, b.x), canvas_size.x)
	y_max := min(max(a.y, b.y), canvas_size.y)

	for y in y_min ..< y_max {
		for x in x_min ..< x_max {
			internal.canvas_set({x, y}, color)
		}
	}
}
