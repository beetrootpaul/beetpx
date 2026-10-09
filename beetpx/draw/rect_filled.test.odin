#+build !js
package beetpx_draw

import tt "core:testing"

@(test)
fills_from_xy_by_wh :: proc(t: ^tt.T) {
	_test_canvas_lock_and_reset()
	defer _test_canvas_unlock()

	rect_filled({1, 2}, {3, 2}, _TEST_C)

	_test_expect_canvas(t, `
......
......
.###..
.###..
......
`)
}

@(test)
negative_wh_extends_left_and_up :: proc(t: ^tt.T) {
	_test_canvas_lock_and_reset()
	defer _test_canvas_unlock()

	rect_filled({4, 3}, {-3, -2}, _TEST_C)

	_test_expect_canvas(t, `
......
.###..
.###..
......
`)
}

@(test)
rounds_both_corners_with_halves_up :: proc(t: ^tt.T) {
	_test_canvas_lock_and_reset()
	defer _test_canvas_unlock()

	// From (0.5,0.4) to (2.5,2.6), so rounded to (1,0) and (3,3).
	rect_filled({0.5, 0.4}, {2, 2.2}, _TEST_C)

	_test_expect_canvas(t, `
.##...
.##...
.##...
......
`)
}

@(test)
zero_wh_draws_nothing :: proc(t: ^tt.T) {
	_test_canvas_lock_and_reset()
	defer _test_canvas_unlock()

	rect_filled({2, 2}, {0, 5}, _TEST_C)
	rect_filled({2, 2}, {5, 0}, _TEST_C)

	tt.expect_value(t, _test_count_set(), 0)
}

@(test)
clips_to_canvas :: proc(t: ^tt.T) {
	_test_canvas_lock_and_reset()
	defer _test_canvas_unlock()

	rect_filled({-2, -1}, {4, 3}, _TEST_C)

	_test_expect_canvas(t, `
##....
##....
......
`)

	_test_canvas_reset()
	rect_filled({62, 61}, {5, 5}, _TEST_C)

	tt.expect_value(t, _test_count_set(), 6)
	tt.expect(t, _test_is_set({62, 61}))
	tt.expect(t, _test_is_set({63, 63}))
}

@(test)
fully_outside_canvas_draws_nothing :: proc(t: ^tt.T) {
	_test_canvas_lock_and_reset()
	defer _test_canvas_unlock()

	rect_filled({-10, 5}, {5, 5}, _TEST_C)
	rect_filled({64, 5}, {5, 5}, _TEST_C)
	rect_filled({5, -10}, {5, 5}, _TEST_C)
	rect_filled({5, 64}, {5, 5}, _TEST_C)

	tt.expect_value(t, _test_count_set(), 0)
}
