#+private file
package bpx

// TODO: Rework the package structure.

import "core:math"

@(private = "package")
_draw_clear_canvas :: proc(color: Rgb) {
	_canvas_fill(color)
}

@(private = "package")
_draw_pixel :: proc(xy: Xy, color: Rgb) {
	// TODO: Operate on Xy instead of x and y separately.
	x, y := _round(xy.x), _round(xy.y)
	if !_canvas_can_set_at(x, y) {
		return
	}
	_canvas_set(x, y, color)
}

// Rounds to the nearest whole number, with halves rounded up (e.g. 1.5 to 2,
// and -1.5 to -1), as `Math.round` in JavaScript, which v0.56.1 relied on.
//
// TODO: This one seems like something to be exported and re-used.
// TODO: `int` is returend and the purpose is indexing the frame buffer. Consider renaming this to something more specific.
_round :: proc(value: f64) -> int {
	return int(math.floor(value + 0.5))
}
