#+vet explicit-allocators
package beetpx_bpxd

import "../bpx"
import "../internal"

// TODO: Tests.
// TODO: Consider naming it `rect` and then handling the "filled" aspect through
//       a proc param.

// Draws a filled rectangle of size `wh`, with one of its corners at `xy`.
//
// A negative width makes the rectangle extend from `xy` to the left, and
// a negative height makes it extend from `xy` to the top.
rect_filled :: proc(xy: bpx.Xy, wh: bpx.Xy, color: bpx.Rgb) {
	xy_1 := bpx.u_round(xy)
	xy_2 := bpx.u_round(xy + wh)

	xy_limit := internal.canvas_size()
	x_min_incl := max(min(xy_1.x, xy_2.x), 0)
	y_min_incl := max(min(xy_1.y, xy_2.y), 0)
	x_max_excl := min(max(xy_1.x, xy_2.x), xy_limit.x)
	y_max_excl := min(max(xy_1.y, xy_2.y), xy_limit.y)

	for y in y_min_incl ..< y_max_excl {
		for x in x_min_incl ..< x_max_excl {
			internal.canvas_set({x, y}, color)
		}
	}
}
