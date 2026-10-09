package beetpx_draw

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
_pixel_xy :: proc(xy: internal.Xy, color: internal.Rgb) {
	_pixel_on(&internal.canvas, xy, color)
}

@(private = "file")
_pixel_x_y :: proc(
	x: $X,
	y: $Y,
	color: internal.Rgb,
) where (intrinsics.type_is_integer(X) || intrinsics.type_is_float(X)),
	(intrinsics.type_is_integer(Y) || intrinsics.type_is_float(Y)) {
	_pixel_on(&internal.canvas, x, y, color)
}

// Same as `pixel`, but on a given canvas.
@(private)
_pixel_on :: proc {
	_pixel_on_xy,
	_pixel_on_x_y,
}

@(private = "file")
_pixel_on_xy :: proc(
	c: ^internal.Canvas,
	xy: internal.Xy,
	color: internal.Rgb,
) {
	internal.canvas_set(c, internal.xy_round(xy), color)
}

@(private = "file")
_pixel_on_x_y :: proc(
	c: ^internal.Canvas,
	x: $X,
	y: $Y,
	color: internal.Rgb,
) where (intrinsics.type_is_integer(X) || intrinsics.type_is_float(X)),
	(intrinsics.type_is_integer(Y) || intrinsics.type_is_float(Y)) {
	_pixel_on_xy(c, {f64(x), f64(y)}, color)
}
