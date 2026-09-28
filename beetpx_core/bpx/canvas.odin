#+private file
package bpx

import "core:fmt"
import "core:slice"

// A single pixel of the canvas, stored as RGBA8. Its alpha is always 255,
// since the canvas is opaque.
_Pixel :: [4]u8

// The framebuffer: every drawing operation writes to it, and the platform
// presents it once per frame. Pixels are stored row by row, starting at the
// top-left corner, so (x, y) is at index `y * CANVAS_WIDTH + x`.
_pixels: [CANVAS_WIDTH * CANVAS_HEIGHT]_Pixel

// Makes the canvas start as opaque black instead of fully transparent.
//
// TODO: Consider calling it explicitly instead of using less clear `@(init)`.
@(init)
_initialize_as_non_transparent :: proc "contextless" () {
	// TODO: Re-use `_canvas_fill`?
	for &pixel in _pixels {
		pixel.a = 0xff
	}
}

// TODO: Operate on Xy instead of x and y separately.
@(private = "package")
_canvas_can_set_at :: proc(x, y: int) -> bool {
	return 0 <= x && x < CANVAS_WIDTH && 0 <= y && y < CANVAS_HEIGHT
}

// TODO: Operate on Xy instead of x and y separately.
@(private = "package")
_canvas_set :: proc(x, y: int, color: Rgb) {
	// TODO: Re-use "_canvas_can_set_at" here?
	// TODO: Do I really want this assrtion?
	fmt.assertf(
		0 <= x && x < CANVAS_WIDTH && 0 <= y && y < CANVAS_HEIGHT,
		"(x,y) out of bounds: (%d,%d), expected from (0,0) to (%d,%d)",
		x,
		y,
		CANVAS_WIDTH - 1,
		CANVAS_HEIGHT - 1,
	)
	_pixels[y * CANVAS_WIDTH + x] = _pixel_of(color)
}

// Sets every pixel of the canvas to the same color.
@(private = "package")
_canvas_fill :: proc(color: Rgb) {
	slice.fill(_pixels[:], _pixel_of(color))
}

// Returns the framebuffer as raw RGBA8 bytes,  for the platform to present.
@(private = "package")
_canvas_rgba8_bytes :: proc() -> []u8 {
	return slice.to_bytes(_pixels[:])
}

// TODO: Is there a way to highly encourage compiler to inline this? Or maybe it
// is a wrong approach?
_pixel_of :: proc(color: Rgb) -> _Pixel {
	return {color.r, color.g, color.b, 0xff}
}
