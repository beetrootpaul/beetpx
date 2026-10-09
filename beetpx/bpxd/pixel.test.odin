#+build !js
package beetpx_bpxd

import tt "core:testing"

@(test)
sets_pixel_at_xy :: proc(t: ^tt.T) {
	test_use_fake_canvas()

	pixel({2, 1}, TEST_C)

	test_expect_canvas(t, `
.....
..#..
.....
`)
}

@(test)
accepts_x_and_y_of_any_number_types :: proc(t: ^tt.T) {
	test_use_fake_canvas()

	pixel(1, 0, TEST_C)
	pixel(f32(3), u8(1), TEST_C)
	pixel(i64(0), 2.0, TEST_C)

	test_expect_canvas(t, `
.#...
...#.
#....
`)
}

@(test)
rounds_xy_with_halves_up :: proc(t: ^tt.T) {
	test_use_fake_canvas()

	pixel({0.5, 0.49}, TEST_C)
	pixel({2.49, 1.5}, TEST_C)
	pixel({-0.5, 2}, TEST_C)

	test_expect_canvas(t, `
.#...
.....
#.#..
`)
}

@(test)
ignores_xy_outside_canvas :: proc(t: ^tt.T) {
	test_use_fake_canvas()

	pixel({-1, 0}, TEST_C)
	pixel({0, -1}, TEST_C)
	pixel({64, 0}, TEST_C)
	pixel({0, 64}, TEST_C)
	pixel({-0.51, 0}, TEST_C)

	tt.expect_value(t, test_count_set(), 0)
}
