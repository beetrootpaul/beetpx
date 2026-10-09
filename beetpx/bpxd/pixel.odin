package beetpx_bpxd

import "../bpx"
import "base:intrinsics"
import "core:math"

// TODO: Somewhere in README or some docs write down that:
//       - (0, 0) is the top-left corner of the canvas,
//       - `xy` is rounded to the nearest pixel, with halves rounded up.

// Draws a single pixel at `(x,y)`.
pixel :: proc {
	pixel_xy,
	pixel_x_y,
}

@(private = "file")
pixel_xy :: proc(xy: bpx.Xy, color: bpx.Rgb) {
	set_pixel(xy_round(xy), color)
}

@(private = "file")
pixel_x_y :: proc(
	x: $X,
	y: $Y,
	color: bpx.Rgb,
) where (intrinsics.type_is_integer(X) || intrinsics.type_is_float(X)),
	(intrinsics.type_is_integer(Y) || intrinsics.type_is_float(Y)) {
	pixel_xy({f64(x), f64(y)}, color)
}

@(private = "file")
set_pixel :: proc(xy: bpx.Xy_Int, c: bpx.Rgb) {
	size := bpx.canvas_size()
	if xy.x < 0 || size.x <= xy.x || xy.y < 0 || size.y <= xy.y do return
	bpx.canvas_rgba8()[xy.y * size.x + xy.x] = {c.r, c.g, c.b, 0xff}
}

// TODO: Make it public for games to reuse?
// TODO: Give it a more specific name, since it returns `int`s for indexing
// the framebuffer?
@(private = "file")
xy_round :: proc(xy: bpx.Xy) -> bpx.Xy_Int {
	return {
		int(math.floor(xy.x + 0.5)),
		int(math.floor(xy.y + 0.5)),
	}
}
