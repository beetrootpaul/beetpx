#+build !js
package beetpx_bpxd

import tt "core:testing"

@(test)
sets_every_pixel :: proc(t: ^tt.T) {
	test_use_fake_canvas()
	pixel({5, 5}, {9, 9, 9})

	clear_canvas(TEST_C)

	tt.expect_value(t, test_count_set(), 64 * 64)
}
