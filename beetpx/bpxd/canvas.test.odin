#+build !js
package beetpx_bpxd

import "../bpx"
import "core:slice"
import "core:strings"
import tt "core:testing"

// The color which `test_expect_canvas` shows as `#`.
@(private)
TEST_C :: bpx.Rgb{1, 2, 3}

@(private = "file")
BG :: bpx.Rgb{0, 0, 0}

@(private = "file")
TEST_SIZE :: bpx.Xy_Int{64, 64}

@(private = "file", thread_local)
test_pixels: [TEST_SIZE.x * TEST_SIZE.y][4]u8

@(private = "file", thread_local)
test_canvas: Fake_Canvas

// Makes drawing on this thread go to a 64x64 fake canvas, filled with
// a background color.
@(private)
test_use_fake_canvas :: proc() {
	slice.fill(test_pixels[:], [4]u8{BG.r, BG.g, BG.b, 0xff})
	test_canvas = {
		pixels = test_pixels[:],
		size   = TEST_SIZE,
	}
	fake_canvas = &test_canvas
}

@(private)
test_is_set :: proc(xy: bpx.Xy_Int) -> bool {
	c := TEST_C
	return test_pixels[xy.y * TEST_SIZE.x + xy.x] == {c.r, c.g, c.b, 0xff}
}

@(private)
test_count_set :: proc() -> (count: int) {
	for y in 0 ..< TEST_SIZE.y {
		for x in 0 ..< TEST_SIZE.x {
			if test_is_set({x, y}) do count += 1
		}
	}
	return
}

// Compares the top-left corner of the canvas with `expected`, where `#` is
// a pixel set to `TEST_C` and `.` is not. Also expects no `TEST_C` outside
// of it.
@(private)
test_expect_canvas :: proc(
	t: ^tt.T,
	expected: string,
	loc := #caller_location,
) {
	expected_count := 0
	rows := strings.split_lines(strings.trim_space(expected))
	defer delete(rows)
	for row, y in rows {
		for char, x in row {
			want := char == '#'
			if want do expected_count += 1
			tt.expectf(
				t,
				test_is_set({x, y}) == want,
				"pixel (%d,%d): expected %v",
				x,
				y,
				want,
				loc = loc,
			)
		}
	}
	tt.expect_value(t, test_count_set(), expected_count, loc = loc)
}
