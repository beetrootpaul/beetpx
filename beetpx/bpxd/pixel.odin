package beetpx_bpxd

import "../bpx"
import "../internal"
import "base:intrinsics"

// TODO: Somewhere in README or some docs write down that:
//       - (0, 0) is the top-left corner of the canvas,
//       - `xy` is rounded to the nearest pixel, with halves rounded up.

// Draws a single pixel at `(x,y)`.
pixel :: proc {
	_pixel_xy,
	_pixel_x_y,
}

@(private = "file")
_pixel_xy :: proc(xy: bpx.Xy, color: bpx.Rgb) {
	internal.canvas_set(bpx.u_round(xy), color)
}

@(private = "file")
_pixel_x_y :: proc(
	x: $X,
	y: $Y,
	color: bpx.Rgb,
) where (intrinsics.type_is_integer(X) || intrinsics.type_is_float(X)),
	(intrinsics.type_is_integer(Y) || intrinsics.type_is_float(Y)) {
	_pixel_xy({f64(x), f64(y)}, color)
}
