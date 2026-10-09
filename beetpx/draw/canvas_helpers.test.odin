#+build !js
package beetpx_draw

import "../internal"
import "core:strings"
import tt "core:testing"

// The color which `_test_expect_canvas` shows as `#`.
@(private)
_TEST_C :: internal.Rgb{1, 2, 3}

@(private = "file")
_BG :: internal.Rgb{0, 0, 0}

// Makes a 64x64 canvas filled with a background color. Free it with `free`.
//
// Allocated, since it might not fit on the stack of a test thread.
@(private)
_test_canvas_make :: proc() -> ^internal.Canvas {
	c := new(internal.Canvas)
	internal.canvas_init(c, .Square_64)
	_test_canvas_reset(c)
	return c
}

@(private)
_test_canvas_reset :: proc(c: ^internal.Canvas) {
	internal.canvas_fill(c, _BG)
}

@(private)
_test_is_set :: proc(c: ^internal.Canvas, xy: internal.Xy_Int) -> bool {
	bytes := internal.canvas_rgba8_bytes(c)
	i := (xy.y * c.size_px.x + xy.x) * 4
	return internal.Rgb{bytes[i], bytes[i + 1], bytes[i + 2]} == _TEST_C
}

@(private)
_test_count_set :: proc(c: ^internal.Canvas) -> (count: int) {
	for y in 0 ..< c.size_px.y {
		for x in 0 ..< c.size_px.x {
			if _test_is_set(c, {x, y}) do count += 1
		}
	}
	return
}

// Compares the top-left corner of the canvas with `expected`, where `#` is
// a pixel set to `_TEST_C` and `.` is not. Also expects no `_TEST_C` outside
// of it.
@(private)
_test_expect_canvas :: proc(
	t: ^tt.T,
	c: ^internal.Canvas,
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
				_test_is_set(c, {x, y}) == want,
				"pixel (%d,%d): expected %v",
				x,
				y,
				want,
				loc = loc,
			)
		}
	}
	tt.expect_value(t, _test_count_set(c), expected_count, loc = loc)
}
