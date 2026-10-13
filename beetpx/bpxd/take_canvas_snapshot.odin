package beetpx_bpxd

import "../internal"

// TODO: Tests.

// Takes a snapshot of the canvas, so it can be later used together with
// `bpx.Canvas_Snapshot_Color_Mapping`. Can be used e.g. for drawing lighter
// pixels around light sources, or for dimming the whole canvas behind a pause
// menu.
//
// The snapshot is available until the end of the current `on_draw`. Draw
// calls with a mapping draw nothing when there is no snapshot.
//
// Example:
//
//	bpxd.take_canvas_snapshot()
//	bpxd.rect_filled({0, 0}, {64, 64}, proc(
//		c: bpx.Rgb,
//		_: bpx.Xy_Int,
//	) -> (bpx.Rgb, bool) {
//		return c / 2, true
//	})
take_canvas_snapshot :: proc() {
	internal.canvas_take_snapshot()
}
