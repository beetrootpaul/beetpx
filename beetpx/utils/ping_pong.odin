package beetpx_utils

import "core:math"

// Bounces back and forth between `0` and `range`.
//
// For a given `t`, it calculates the value that starts at `0` for `t=0` and
// goes up to `range` (or down, if `range` is negative), then back to `0`, and
// so on. For example, with `range` of 3, the results for `t=0..8` are
// `0,1,2,3,2,1,0,1,2`.
//
// TODO: Consider making it work for floats as well.
// TODO: Use `$T` to make it work for other types of integer numbers, so we
//       don't have to `int(…)` cast it on the caller side. Claude suggested
//       `intrinsics` to check for the type's type, but I see a `$T/Foo`
//       notation in the official demo: https://github.com/odin-lang/Odin/blob/master/examples/demo/demo.odin#L956-L957 .
//       Maybe we can leverage that?
// TODO: Should this proc be named like this and placed in `utils`? Think about
//       a bigger picture with ease, tween, lerp, clamp, waves (triangle, sine,
//       etc.). Also consider aligning with common industry practices (should we
//       operate on angles and turns)? Make sure procs are composable.
ping_pong :: proc(t, range: int) -> int {
	if range == 0 do return 0
	modulo := t %% (2 * range)
	return abs(modulo) <= abs(range) ? modulo : 2 * range - modulo
}
