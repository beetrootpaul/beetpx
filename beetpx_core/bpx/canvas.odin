#+private file
#+vet unused-procedures
package bpx

import "core:slice"

// A single pixel of the canvas, stored as RGBA8. Its alpha is always 255,
// since the canvas is opaque.
_Pixel :: [4]u8

// The framebuffer: every drawing operation writes to it, and the platform
// presents it once per frame. Pixels are stored row by row, starting at the
// top-left corner, so (x, y) is at index `y * CANVAS_WIDTH + x`.
_pixels: [CANVAS_WIDTH * CANVAS_HEIGHT]_Pixel

// Sets the canvas to opaque black. The platforms call it before the first
// frame, since the zero value would be transparent black.
@(private = "package")
_canvas_fill_black :: proc() {
	_canvas_fill({0, 0, 0})
}

@(private = "package")
_canvas_can_set_at :: proc(xy: _Xy_Int) -> bool {
	return(
		0 <= xy.x &&
		xy.x < CANVAS_WIDTH &&
		0 <= xy.y &&
		xy.y < CANVAS_HEIGHT \
	)
}

@(private = "package")
_canvas_set :: proc(xy_int: _Xy_Int, c: _Color_Rgb) {
	if !_canvas_can_set_at(xy_int) do return
	_pixels[xy_int.y * CANVAS_WIDTH + xy_int.x] = _pixel_of(c)
}

// Sets every pixel of the canvas to the same color.
@(private = "package")
_canvas_fill :: proc(c: _Color_Rgb) {
	slice.fill(_pixels[:], _pixel_of(c))
}

// Returns the framebuffer as raw RGBA8 bytes, for the platform to present.
@(private = "package")
_canvas_rgba8_bytes :: proc() -> []u8 {
	return slice.to_bytes(_pixels[:])
}

_pixel_of :: proc(c: _Color_Rgb) -> _Pixel {
	return {c.r, c.g, c.b, 0xff}
}
