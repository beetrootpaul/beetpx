#+test
package beetpx_bpx

import tt "core:testing"

@(test)
buttons_initial :: proc(t: ^tt.T) {
	s: _Buttons_State

	tt.expect_value(t, s.pressed, bit_set[Button]{})
	tt.expect_value(t, s.just_pressed, bit_set[Button]{})
}

// TODO: Can we introduce some kind of test helper which simulates the tick and
//       therefore hides `_buttons_cleanup_after_tick` inside of it?
@(test)
button_down_then_up :: proc(t: ^tt.T) {
	s: _Buttons_State

	{ 	// down
		_buttons_on_down(&s, .Left)

		tt.expect_value(t, s.pressed, bit_set[Button]{.Left})
		tt.expect_value(t, s.just_pressed, bit_set[Button]{.Left})

		_buttons_cleanup_after_tick(&s)
	}
	{ 	// idle
		tt.expect_value(t, s.pressed, bit_set[Button]{.Left})
		tt.expect_value(t, s.just_pressed, bit_set[Button]{})

		_buttons_cleanup_after_tick(&s)
	}
	{ 	// up
		_buttons_on_up(&s, .Left)

		tt.expect_value(t, s.pressed, bit_set[Button]{})
		tt.expect_value(t, s.just_pressed, bit_set[Button]{})
	}
}

@(test)
button_down_then_all_up :: proc(t: ^tt.T) {
	s: _Buttons_State

	{ 	// down
		_buttons_on_down(&s, .Left)

		tt.expect_value(t, s.pressed, bit_set[Button]{.Left})
		tt.expect_value(t, s.just_pressed, bit_set[Button]{.Left})

		_buttons_cleanup_after_tick(&s)
	}
	{ 	// idle
		tt.expect_value(t, s.pressed, bit_set[Button]{.Left})
		tt.expect_value(t, s.just_pressed, bit_set[Button]{})

		_buttons_cleanup_after_tick(&s)
	}
	{ 	// *all* up
		_buttons_on_all_up(&s)

		tt.expect_value(t, s.pressed, bit_set[Button]{})
		tt.expect_value(t, s.just_pressed, bit_set[Button]{})
	}
}

@(test)
button_down_and_up_within_same_tick :: proc(t: ^tt.T) {
	s: _Buttons_State

	{ 	// down & up within the same tick
		_buttons_on_down(&s, .Left)
		_buttons_on_up(&s, .Left)

		tt.expect_value(t, s.pressed, bit_set[Button]{.Left})
		tt.expect_value(t, s.just_pressed, bit_set[Button]{.Left})

		_buttons_cleanup_after_tick(&s)
	}
	{ 	// idle
		tt.expect_value(t, s.pressed, bit_set[Button]{})
		tt.expect_value(t, s.just_pressed, bit_set[Button]{})
	}
}

@(test)
button_down_and_all_up_within_the_same_tick :: proc(t: ^tt.T) {
	s: _Buttons_State

	{ 	// down & *all* up within the same tick
		_buttons_on_down(&s, .Left)
		_buttons_on_all_up(&s)

		tt.expect_value(t, s.pressed, bit_set[Button]{.Left})
		tt.expect_value(t, s.just_pressed, bit_set[Button]{.Left})

		_buttons_cleanup_after_tick(&s)
	}
	{ 	// idle
		tt.expect_value(t, s.pressed, bit_set[Button]{})
		tt.expect_value(t, s.just_pressed, bit_set[Button]{})
	}
}
