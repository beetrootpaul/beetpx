#+build !js
package beetpx_utils

import "core:testing"

@(test)
test_any_passing_test_for_starters :: proc(t: ^testing.T) {
	testing.expect_value(t, ping_pong(1, 3), 1)
}

@(test)
test_any_failing_test_for_starters :: proc(t: ^testing.T) {
	testing.expect_value(t, ping_pong(1, 3), 333)
}
