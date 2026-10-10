package tests_bpx

import "beetpx:bpx"
import tt "core:testing"

// TODO: Is there a way to scope test proc names? They share the same namespace
//       as tests from other files :-/

@(test)
int_values :: proc(t: ^tt.T) {
	tt.expect_value(t, bpx.u_round([?]f64{0}), [?]int{0})
	tt.expect_value(t, bpx.u_round([?]f64{1}), [?]int{1})
	tt.expect_value(t, bpx.u_round([?]f64{-1}), [?]int{-1})

	tt.expect_value(t, bpx.u_round(bpx.Xy{0, 0}), bpx.Xy_Int{0, 0})
	tt.expect_value(t, bpx.u_round(bpx.Xy{1, 2}), bpx.Xy_Int{1, 2})
	tt.expect_value(t, bpx.u_round(bpx.Xy{-1, -2}), bpx.Xy_Int{-1, -2})

	tt.expect_value(t, bpx.u_round([?]f64{0, 0, 0}), [?]int{0, 0, 0})
	tt.expect_value(t, bpx.u_round([?]f64{1, 2, 3}), [?]int{1, 2, 3})
	tt.expect_value(t, bpx.u_round([?]f64{-1, -2, -3}), [?]int{-1, -2, -3})
}

@(test)
values_close_to_ints :: proc(t: ^tt.T) {
	tt.expect_value(t, bpx.u_round([?]f64{0.1}), [?]int{0})
	tt.expect_value(t, bpx.u_round([?]f64{0.9}), [?]int{1})
	tt.expect_value(t, bpx.u_round([?]f64{1.1}), [?]int{1})
	tt.expect_value(t, bpx.u_round([?]f64{-1.1}), [?]int{-1})
	tt.expect_value(t, bpx.u_round([?]f64{-0.9}), [?]int{-1})
	tt.expect_value(t, bpx.u_round([?]f64{-0.1}), [?]int{0})

	tt.expect_value(t, bpx.u_round(bpx.Xy{0.1, 0.2}), bpx.Xy_Int{0, 0})
	tt.expect_value(t, bpx.u_round(bpx.Xy{0.9, 1.8}), bpx.Xy_Int{1, 2})
	tt.expect_value(t, bpx.u_round(bpx.Xy{1.1, 2.2}), bpx.Xy_Int{1, 2})
	tt.expect_value(t, bpx.u_round(bpx.Xy{-1.1, -2.2}), bpx.Xy_Int{-1, -2})
	tt.expect_value(t, bpx.u_round(bpx.Xy{-0.9, -1.8}), bpx.Xy_Int{-1, -2})
	tt.expect_value(t, bpx.u_round(bpx.Xy{-0.1, -0.2}), bpx.Xy_Int{0, 0})

	tt.expect_value(t, bpx.u_round([?]f64{0.1, 0.2, 0.3}), [?]int{0, 0, 0})
	tt.expect_value(t, bpx.u_round([?]f64{0.9, 1.8, 2.7}), [?]int{1, 2, 3})
	tt.expect_value(t, bpx.u_round([?]f64{1.1, 2.2, 3.3}), [?]int{1, 2, 3})
	tt.expect_value(
		t,
		bpx.u_round([?]f64{-1.1, -2.2, -3.3}),
		[?]int{-1, -2, -3},
	)
	tt.expect_value(
		t,
		bpx.u_round([?]f64{-0.9, -1.8, -2.7}),
		[?]int{-1, -2, -3},
	)
	tt.expect_value(t, bpx.u_round([?]f64{-0.1, -0.2, -0.3}), [?]int{0, 0, 0})
}

@(test)
halves :: proc(t: ^tt.T) {
	tt.expect_value(t, bpx.u_round([?]f64{0.5}), [?]int{1})
	tt.expect_value(t, bpx.u_round([?]f64{-0.5}), [?]int{0})

	tt.expect_value(t, bpx.u_round(bpx.Xy{0.5, 1.5}), bpx.Xy_Int{1, 2})
	tt.expect_value(t, bpx.u_round(bpx.Xy{-0.5, -1.5}), bpx.Xy_Int{0, -1})

	tt.expect_value(t, bpx.u_round([?]f64{0.5, 1.5, 2.5}), [?]int{1, 2, 3})
	tt.expect_value(
		t,
		bpx.u_round([?]f64{-0.5, -1.5, -2.5}),
		[?]int{0, -1, -2},
	)
}

@(test)
empty_array :: proc(t: ^tt.T) {
	tt.expect_value(t, bpx.u_round([?]f64{}), [?]int{})
}

@(test)
mixed_cases :: proc(t: ^tt.T) {
	tt.expect_value(
		t,
		bpx.u_round([?]f64{4, -3.5, 2.9, 0, -0, -9.9}),
		[?]int{4, -3, 3, 0, 0, -10},
	)
}
