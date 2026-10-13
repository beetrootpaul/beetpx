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
//
// Instead of a color, it accepts a `bpx.Canvas_Snapshot_Color_Mapping`, which
// maps colors of the snapshot taken with `take_canvas_snapshot`.
rect_filled :: proc {
	_rect_filled_rgb,
	_rect_filled_mapped,
}

@(private = "file")
_rect_filled_rgb :: proc(xy: bpx.Xy, wh: bpx.Xy, color: bpx.Rgb) {
	xy_min_incl, xy_max_excl := _rect_filled_bounds(xy, wh)

	for y in xy_min_incl.y ..< xy_max_excl.y {
		for x in xy_min_incl.x ..< xy_max_excl.x {
			internal.canvas_set({x, y}, color)
		}
	}
}

@(private = "file")
_rect_filled_mapped :: proc(
	xy: bpx.Xy,
	wh: bpx.Xy,
	mapping: bpx.Canvas_Snapshot_Color_Mapping,
) {
	if !internal.canvas_has_snapshot() do return

	xy_min_incl, xy_max_excl := _rect_filled_bounds(xy, wh)

	for y in xy_min_incl.y ..< xy_max_excl.y {
		for x in xy_min_incl.x ..< xy_max_excl.x {
			snapshot_color := internal.canvas_snapshot_get({x, y})
			if color, ok := mapping(snapshot_color, {x, y}); ok {
				internal.canvas_set({x, y}, color)
			}
		}
	}
}

// Returns the rectangle's pixel bounds, clipped to the canvas.
@(private = "file")
_rect_filled_bounds :: proc(
	xy: bpx.Xy,
	wh: bpx.Xy,
) -> (
	xy_min_incl: bpx.Xy_Int,
	xy_max_excl: bpx.Xy_Int,
) {
	xy_1 := bpx.u_round(xy)
	xy_2 := bpx.u_round(xy + wh)

	xy_limit := internal.canvas_size()
	xy_min_incl = {max(min(xy_1.x, xy_2.x), 0), max(min(xy_1.y, xy_2.y), 0)}
	xy_max_excl = {
		min(max(xy_1.x, xy_2.x), xy_limit.x),
		min(max(xy_1.y, xy_2.y), xy_limit.y),
	}
	return
}
