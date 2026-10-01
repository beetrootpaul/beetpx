#+private file
package beetpx_internal

import "core:math"

@(private = "package")
_Xy :: [2]f64

@(private = "package")
_Xy_Int :: [2]int

// TODO: Make it public for games to reuse?
// TODO: Give it a more specific name, since it returns `int`s for indexing
// the framebuffer?
@(private = "package")
_xy_round :: proc(xy: _Xy) -> _Xy_Int {
	return {
		int(math.floor(xy.x + 0.5)),
		int(math.floor(xy.y + 0.5)),
	}
}
