#+private file
package bpx

// TODO: Rework the package structure.

import "core:math"

@(private = "package")
_draw_clear_canvas :: proc(c: _Color_Rgb) {
	_canvas_fill(c)
}

@(private = "package")
_draw_pixel :: proc(xy: Xy, color: _Color_Rgb) {
	_canvas_set(_round(xy), color)
}

// Rounds to the nearest whole number, with halves rounded up (e.g. 1.5 to 2,
// and -1.5 to -1), as `Math.round` in JavaScript, which v0.56.1 relied on.
//
// TODO: This one seems like something to be exported and re-used.
// TODO: `int` is returend and the purpose is indexing the frame buffer. Consider renaming this to something more specific.
_round :: proc(xy: _Xy) -> _Xy_Int {
	return {
		int(math.floor(xy.x + 0.5)),
		int(math.floor(xy.y + 0.5)),
	}
}
