package beetpx_bpx

import "core:math"

// Prevent the check scripts from reporting an unused `core:math` import.
//
// `u_round` is a polymorphic proc, so its body is type-checked only when
// something calls it. Nothing in this package does, and the tests live in a
// separate package, so without this line the checker never sees `math` being
// used.
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
