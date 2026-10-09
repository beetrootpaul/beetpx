#+build !js
package beetpx_draw

import "../internal"
import "core:strings"
import "core:sync"
import tt "core:testing"

// The color which `_test_expect_canvas` shows as `#`.
@(private)
_TEST_C :: internal.Rgb{1, 2, 3}

@(private = "file")
_BG :: internal.Rgb{0, 0, 0}

// Tests run in parallel, while the canvas is global.
@(private = "file")
_canvas_mutex: sync.Mutex

// Gives the test a 64x64 canvas filled with a background color. Has to be
// paired with `_test_canvas_unlock`.
@(private)
_test_canvas_lock_and_reset :: proc() {
	sync.mutex_lock(&_canvas_mutex)
	internal.canvas_init(.Square_64)
	internal.canvas_fill(_BG)
}

@(private)
_test_canvas_unlock :: proc() {
	sync.mutex_unlock(&_canvas_mutex)
}

@(private)
_test_canvas_reset :: proc() {
	internal.canvas_fill(_BG)
}

@(private)
_test_is_set :: proc(xy: internal.Xy_Int) -> bool {
	bytes := internal.canvas_rgba8_bytes()
	i := (xy.y * internal.canvas_size().x + xy.x) * 4
	return internal.Rgb{bytes[i], bytes[i + 1], bytes[i + 2]} == _TEST_C
}

@(private)
_test_count_set :: proc() -> (count: int) {
	size := internal.canvas_size()
	for y in 0 ..< size.y {
		for x in 0 ..< size.x {
			if _test_is_set({x, y}) do count += 1
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
				_test_is_set({x, y}) == want,
				"pixel (%d,%d): expected %v",
				x,
				y,
				want,
				loc = loc,
			)
		}
	}
	tt.expect_value(t, _test_count_set(), expected_count, loc = loc)
}
