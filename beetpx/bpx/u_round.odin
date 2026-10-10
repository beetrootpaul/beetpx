package beetpx_bpx

import "core:math"

// Prevent the check scripts from reporting unused `core:math` import when the
// target is JS.
//
// We do not build tests for JS (due to dependency on OS package) and it makes
// `u_round` also unused as a result. And since it is a polymorphic proc, it
// gets this special strange treatment during the check.
_ :: math

// TODO: Make this accept various value types?
// TODO: Should it return ints or floats?

// Rounds an array with all elements rounded up.
//
// In contrary to built-in Odin's `math.round`, this proc rounds negative halves
// up towards 0, not the other way. This decision was made to achieve
// consistency in rounding of values across both negatives and positives.
u_round :: proc(values: [$N]f64) -> (rounded: [N]int) {
	for v, i in values {
		rounded[i] = int(math.floor(v + 0.5))
	}
	return rounded
}
