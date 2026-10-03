package beetpx_utils

// Bounces `value` back and forth between `0` and `max`.
//
// It goes up from `0` to `max`, then down to `0`, and so on. For example, with
// `max` of 3, the `value`s 0, 1, 2, 3, 4, 5, 6, 7 give 0, 1, 2, 3, 2, 1, 0, 1.
// Negative `value`s continue the pattern backwards, so the result is never
// negative. `max` has to be positive.
//
// TODO: Consider making it work for floats as well.
// TODO: Use `$T` to make it work for other types of integer numbers, so we
//       don't have to `int(…)` cast it on the caller side. Claude suggested
//       `intrinsics` to check for the type's type, but I see a `$T/Foo`
//       notation in the official demo: https://github.com/odin-lang/Odin/blob/master/examples/demo/demo.odin#L956-L957 .
//       Maybe we can leverage that?
// TODO: Is `max` a proper name?
// TODO: Should we give it an inclusive or exclusive max value?
// TODO: Write tests for this.
// TODO: Should this proc be named like this and placed in `utils`? Think about
//       a bigger picture with ease, tween, lerp, clamp, waves (triangle, sine,
//       etc.). Also consider aligning with common industry practices (should we
//       operate on angles and turns)? Make sure procs are composable.
ping_pong :: proc(value, max: int) -> int {
	return max - abs(value % (2 * max) - max)
}
