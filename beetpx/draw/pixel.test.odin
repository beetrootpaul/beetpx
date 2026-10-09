#+build !js
package beetpx_draw

import tt "core:testing"

@(test)
sets_pixel_at_xy :: proc(t: ^tt.T) {
	c := _test_canvas_make()
	defer free(c)

	_pixel_on(c, {2, 1}, _TEST_C)

	_test_expect_canvas(t, c, `
.....
..#..
.....
`)
}

@(test)
accepts_x_and_y_of_any_number_types :: proc(t: ^tt.T) {
	c := _test_canvas_make()
	defer free(c)

	_pixel_on(c, 1, 0, _TEST_C)
	_pixel_on(c, f32(3), u8(1), _TEST_C)
	_pixel_on(c, i64(0), 2.0, _TEST_C)

	_test_expect_canvas(t, c, `
.#...
...#.
#....
`)
}

@(test)
rounds_xy_with_halves_up :: proc(t: ^tt.T) {
	c := _test_canvas_make()
	defer free(c)

	_pixel_on(c, {0.5, 0.49}, _TEST_C)
	_pixel_on(c, {2.49, 1.5}, _TEST_C)
	_pixel_on(c, {-0.5, 2}, _TEST_C)

	_test_expect_canvas(t, c, `
.#...
.....
#.#..
`)
}

@(test)
ignores_xy_outside_canvas :: proc(t: ^tt.T) {
	c := _test_canvas_make()
	defer free(c)

	_pixel_on(c, {-1, 0}, _TEST_C)
	_pixel_on(c, {0, -1}, _TEST_C)
	_pixel_on(c, {64, 0}, _TEST_C)
	_pixel_on(c, {0, 64}, _TEST_C)
	_pixel_on(c, {-0.51, 0}, _TEST_C)

	tt.expect_value(t, _test_count_set(c), 0)
}
