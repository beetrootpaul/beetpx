#+private file
#+vet unused-procedures
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
// and -1.5 to -1).
//
// TODO: Make it public for games to reuse?
// TODO: Give it a more specific name, since it returns `int`s for indexing
// the framebuffer?
_round :: proc(xy: _Xy) -> _Xy_Int {
	return {
		int(math.floor(xy.x + 0.5)),
		int(math.floor(xy.y + 0.5)),
	}
}
