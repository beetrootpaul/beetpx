#+build !js
package beetpx_draw

import tt "core:testing"

@(test)
fills_from_xy_by_wh :: proc(t: ^tt.T) {
	c := _test_canvas_make()
	defer free(c)

	_rect_filled_on(c, {1, 2}, {3, 2}, _TEST_C)

	_test_expect_canvas(t, c, `
......
......
.###..
.###..
......
`)
}

@(test)
negative_wh_extends_left_and_up :: proc(t: ^tt.T) {
	c := _test_canvas_make()
	defer free(c)

	_rect_filled_on(c, {4, 3}, {-3, -2}, _TEST_C)

	_test_expect_canvas(t, c, `
......
.###..
.###..
......
`)
}

@(test)
rounds_both_corners_with_halves_up :: proc(t: ^tt.T) {
	c := _test_canvas_make()
	defer free(c)

	// From (0.5,0.4) to (2.5,2.6), so rounded to (1,0) and (3,3).
	_rect_filled_on(c, {0.5, 0.4}, {2, 2.2}, _TEST_C)

	_test_expect_canvas(t, c, `
.##...
.##...
.##...
......
`)
}

@(test)
zero_wh_draws_nothing :: proc(t: ^tt.T) {
	c := _test_canvas_make()
	defer free(c)

	_rect_filled_on(c, {2, 2}, {0, 5}, _TEST_C)
	_rect_filled_on(c, {2, 2}, {5, 0}, _TEST_C)

	tt.expect_value(t, _test_count_set(c), 0)
}

@(test)
clips_to_canvas :: proc(t: ^tt.T) {
	c := _test_canvas_make()
	defer free(c)

	_rect_filled_on(c, {-2, -1}, {4, 3}, _TEST_C)

	_test_expect_canvas(t, c, `
##....
##....
......
`)

	_test_canvas_reset(c)
	_rect_filled_on(c, {62, 61}, {5, 5}, _TEST_C)

	tt.expect_value(t, _test_count_set(c), 6)
	tt.expect(t, _test_is_set(c, {62, 61}))
	tt.expect(t, _test_is_set(c, {63, 63}))
}

@(test)
fully_outside_canvas_draws_nothing :: proc(t: ^tt.T) {
	c := _test_canvas_make()
	defer free(c)

	_rect_filled_on(c, {-10, 5}, {5, 5}, _TEST_C)
	_rect_filled_on(c, {64, 5}, {5, 5}, _TEST_C)
	_rect_filled_on(c, {5, -10}, {5, 5}, _TEST_C)
	_rect_filled_on(c, {5, 64}, {5, 5}, _TEST_C)

	tt.expect_value(t, _test_count_set(c), 0)
}
