package beetpx_draw

import "../internal"
import "base:intrinsics"

// TODO: Somewhere in README or some docs write down that:
//       - (0, 0) is the top-left corner of the canvas,
//       - `xy` is rounded to the nearest pixel, with halves rounded up.

// Draws a single pixel at `(x,y)`.
pixel :: proc {
	pixel_xy,
	pixel_x_y,
}

@(private = "file")
pixel_xy :: proc(xy: internal.Xy, color: internal.Rgb) {
	internal.canvas_set(internal.xy_round(xy), color)
}

@(private = "file")
pixel_x_y :: proc(
	x: $X,
	y: $Y,
	color: internal.Rgb,
) where (intrinsics.type_is_integer(X) || intrinsics.type_is_float(X)),
	(intrinsics.type_is_integer(Y) || intrinsics.type_is_float(Y)) {
	pixel_xy({f64(x), f64(y)}, color)
}
