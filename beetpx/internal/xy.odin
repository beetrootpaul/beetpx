package beetpx_internal

import "core:math"

// Basic `(x,y)` coordinates type.
Xy :: [2]f64

// Basic `(x,y)` coordinates type, as integers.
Xy_Int :: [2]int

// TODO: Make it public for games to reuse?
// TODO: Give it a more specific name, since it returns `int`s for indexing
// the framebuffer?
xy_round :: proc(xy: Xy) -> Xy_Int {
	return {
		int(math.floor(xy.x + 0.5)),
		int(math.floor(xy.y + 0.5)),
	}
}
