#+build !js
package beetpx_utils

import tt "core:testing"

@(test)
up_to_range_and_back_to_0_on_repeat :: proc(t: ^tt.T) {
	tt.expect_value(t, ping_pong(0, 4), 0)
	tt.expect_value(t, ping_pong(1, 4), 1)
	tt.expect_value(t, ping_pong(2, 4), 2)
	tt.expect_value(t, ping_pong(3, 4), 3)
	tt.expect_value(t, ping_pong(4, 4), 4)
	tt.expect_value(t, ping_pong(5, 4), 3)
	tt.expect_value(t, ping_pong(6, 4), 2)
	tt.expect_value(t, ping_pong(7, 4), 1)
	tt.expect_value(t, ping_pong(8, 4), 0)
	tt.expect_value(t, ping_pong(9, 4), 1)
	tt.expect_value(t, ping_pong(10, 4), 2)
	tt.expect_value(t, ping_pong(11, 4), 3)
	tt.expect_value(t, ping_pong(12, 4), 4)
	tt.expect_value(t, ping_pong(13, 4), 3)
	tt.expect_value(t, ping_pong(14, 4), 2)
	tt.expect_value(t, ping_pong(15, 4), 1)
	tt.expect_value(t, ping_pong(16, 4), 0)
}

@(test)
negative_values :: proc(t: ^tt.T) {
	tt.expect_value(t, ping_pong(-16, 4), 0)
	tt.expect_value(t, ping_pong(-15, 4), 1)
	tt.expect_value(t, ping_pong(-14, 4), 2)
	tt.expect_value(t, ping_pong(-13, 4), 3)
	tt.expect_value(t, ping_pong(-12, 4), 4)
	tt.expect_value(t, ping_pong(-11, 4), 3)
	tt.expect_value(t, ping_pong(-10, 4), 2)
	tt.expect_value(t, ping_pong(-9, 4), 1)
	tt.expect_value(t, ping_pong(-8, 4), 0)
	tt.expect_value(t, ping_pong(-7, 4), 1)
	tt.expect_value(t, ping_pong(-6, 4), 2)
	tt.expect_value(t, ping_pong(-5, 4), 3)
	tt.expect_value(t, ping_pong(-4, 4), 4)
	tt.expect_value(t, ping_pong(-3, 4), 3)
	tt.expect_value(t, ping_pong(-2, 4), 2)
	tt.expect_value(t, ping_pong(-1, 4), 1)
}

@(test)
range_of_1 :: proc(t: ^tt.T) {
	tt.expect_value(t, ping_pong(0, 1), 0)
	tt.expect_value(t, ping_pong(1, 1), 1)
	tt.expect_value(t, ping_pong(2, 1), 0)
	tt.expect_value(t, ping_pong(3, 1), 1)
}

@(test)
range_of_0 :: proc(t: ^tt.T) {
	tt.expect_value(t, ping_pong(0, 0), 0)
	tt.expect_value(t, ping_pong(1, 0), 0)
	tt.expect_value(t, ping_pong(2, 0), 0)
}

@(test)
negative_range :: proc(t: ^tt.T) {
	tt.expect_value(t, ping_pong(-7, -3), -1)
	tt.expect_value(t, ping_pong(-6, -3), 0)
	tt.expect_value(t, ping_pong(-5, -3), -1)
	tt.expect_value(t, ping_pong(-4, -3), -2)
	tt.expect_value(t, ping_pong(-3, -3), -3)
	tt.expect_value(t, ping_pong(-2, -3), -2)
	tt.expect_value(t, ping_pong(-1, -3), -1)
	tt.expect_value(t, ping_pong(0, -3), 0)
	tt.expect_value(t, ping_pong(1, -3), -1)
	tt.expect_value(t, ping_pong(2, -3), -2)
	tt.expect_value(t, ping_pong(3, -3), -3)
	tt.expect_value(t, ping_pong(4, -3), -2)
	tt.expect_value(t, ping_pong(5, -3), -1)
	tt.expect_value(t, ping_pong(6, -3), 0)
	tt.expect_value(t, ping_pong(7, -3), -1)
}
