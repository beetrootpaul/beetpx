package beetpx_bpx

import "core:math"

// Basic `(x,y)` coordinates type.
Xy :: [2]f64

// TODO: Double-check later on if the Xy_Int is really needed in public API.

// Basic `(x,y)` coordinates type, as integers.
Xy_Int :: [2]int

// TODO: Make it more generic, I mean like an util `u_round` which takes an
//       array and rounds all of its elements.
// TODO: Give it a more specific name, since it returns `int`s for indexing
// the framebuffer?

// Rounds `xy` to the nearest whole pixel, with halves rounded up.
xy_round :: proc(xy: Xy) -> Xy_Int {
	return {
		int(math.floor(xy.x + 0.5)),
		int(math.floor(xy.y + 0.5)),
	}
}
