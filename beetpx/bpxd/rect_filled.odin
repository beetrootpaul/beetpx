package beetpx_bpxd

import "../bpx"
import "../internal"
import "core:math/linalg"

// TODO: Tests.
// TODO: Consider combining it with `rect` and then handling the "filled" aspect
//       through a proc param.

// Draws a filled rectangle of size `wh`, with one of its corners at `xy`.
//
// A negative width makes the rectangle extend from `xy` to the left, and
// a negative height makes it extend from `xy` to the top.
rect_filled :: proc(xy: bpx.Xy, wh: bpx.Xy, color: bpx.Rgb) {
	xy_1 := bpx.u_round(xy)
	xy_2 := bpx.u_round(xy + wh)

	xy_limit := internal.canvas_size()
	xy_min_incl := linalg.max(linalg.min(xy_1, xy_2), 0)
	xy_max_excl := linalg.min(linalg.max(xy_1, xy_2), xy_limit)

	for y in xy_min_incl.y ..< xy_max_excl.y {
		for x in xy_min_incl.x ..< xy_max_excl.x {
			internal.canvas_set({x, y}, color)
		}
	}
}
