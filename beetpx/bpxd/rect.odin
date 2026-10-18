package beetpx_bpxd

import "../bpx"
import "../internal"
import "core:math/linalg"

// TODO: Tests.

// Draws a rectangle of size `wh`, boundary only, with one of its corners at
// `xy`.
//
// A negative width makes the rectangle extend from `xy` to the left, and
// a negative height makes it extend from `xy` to the top.
rect :: proc(xy: bpx.Xy, wh: bpx.Xy, color: bpx.Rgb) {
	xy_1 := bpx.u_round(xy - _s.camera_xy)
	xy_2 := bpx.u_round(xy - _s.camera_xy + wh)

	xy_min_incl := linalg.min(xy_1, xy_2)
	xy_max_excl := linalg.max(xy_1, xy_2)

	if xy_min_incl.x == xy_max_excl.x || xy_min_incl.y == xy_max_excl.y do return

	xy_limit := internal.canvas_size()
	xy_min_incl = linalg.max(xy_min_incl, 0)
	xy_max_excl = linalg.min(xy_max_excl, xy_limit)

	for x in xy_min_incl.x ..< xy_max_excl.x {
		internal.canvas_set({x, xy_min_incl.y}, color)
		internal.canvas_set({x, xy_max_excl.y - 1}, color)
	}
	for y in xy_min_incl.y ..< xy_max_excl.y {
		internal.canvas_set({xy_min_incl.x, y}, color)
		internal.canvas_set({xy_max_excl.x - 1, y}, color)
	}
}
