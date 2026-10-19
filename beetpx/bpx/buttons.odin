package beetpx_bpx

// TODO: Mention somewhere how the buttons handling will work for e.g. AZERTY
//       keyboard layout (WASD maps to ZQSD?).
// TODO: Add `O`, `X`, and `Menu`.

Button :: enum {
	Left,
	Right,
	Up,
	Down,
}

// TODO: Rework the names of this struct's fields?
@(private)
_Buttons_State :: struct {
	// If a button is after "on_down" and before "on_up".
	down        : bit_set[Button],
	// If a button was down since the last tick Can be no longer down.
	pressed     : bit_set[Button],
	// If a button became down after the last tick. Can be no longer down.
	just_pressed: bit_set[Button],
}

pressed :: proc() -> bit_set[Button] {
	return _s.buttons.pressed
}

just_pressed :: proc() -> bit_set[Button] {
	return _s.buttons.just_pressed
}
// TODO: Once several inputs map onto one button (e.g. both an arrow key and
//       a WASD key), track them separately, so that releasing one of them
//       does not release the button while the other one is still down.
@(private)
_buttons_on_down :: proc(state: ^_Buttons_State, button: Button) {
	state.down += {button}
	state.pressed += {button}
	state.just_pressed += {button}
}

@(private)
_buttons_on_up :: proc(state: ^_Buttons_State, button: Button) {
	state.down -= {button}
	if button not_in state.just_pressed {
		state.pressed -= {button}
	}
}

// TODO: Not gonna say, I am not a big fan of this implementation. Maybe we can
//       do "latch" approach a bit differently, maybe with more fields, but less
//       logic.
@(private)
_buttons_on_all_up :: proc(state: ^_Buttons_State) {
	state.down = {}
	for b in state.pressed {
		if b not_in state.just_pressed {
			state.pressed -= {b}
		}
	}
}

@(private)
_buttons_cleanup_after_tick :: proc(state: ^_Buttons_State) {
	state.pressed = state.down
	state.just_pressed = {}
}
