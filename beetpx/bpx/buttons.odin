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

pressed :: proc() -> bit_set[Button] {
	// 	return _s.buttons.pressed
	return {}
}

just_pressed :: proc() -> bit_set[Button] {
	// 	return _s.buttons.just_pressed
	return {}
}

// Samples the inputs for the next tick.
//
// A button is "pressed" in a tick if its input is down, or went down since the
// previous tick. So even a tap that went down and up between two ticks makes
// the button pressed for one tick, and then released in the next one.
//
// A button is "just pressed" if its input went down since the previous tick.
// That includes a button pressed in the previous tick as well, if its input
// went up and down again in between.
@(private)
_buttons_tick :: proc() {
// _buttons_tick :: proc(b: ^Buttons) {
	// 	b.pressed = b.down | b.went_down
	// 	b.just_pressed = b.went_down
	// 	b.went_down = {}
}


// The state of the game buttons. The platform reports changes of its inputs
// at any time, and the game loop samples them once per tick.
//
// Its procs work on a given value rather than on a global one, so that tests
// can create their own.
// Buttons :: struct {
// 	// The buttons whose inputs are down right now, according to the latest
// 	// events.
// 	down        : bit_set[Button],
// 	// The buttons whose inputs went down since the previous tick, even if they
// 	// went up again since then. It makes a tap shorter than a tick still count
// 	// as a press.
// 	went_down   : bit_set[Button],
// 	// The buttons pressed in the current tick.
// 	pressed     : bit_set[Button],
// 	// The buttons which changed from released to pressed in the current tick.
// 	just_pressed: bit_set[Button],
// }

// Records that the input of `button` went down.
//
// Call it for the initial event only, not for the repeated ones a host OS
// sends while a key is held. Otherwise every repeat would count as a new
// press.
//
// TODO: Once several inputs map onto one button (e.g. both an arrow key and
//       a WASD key), track them separately, so that releasing one of them
//       does not release the button while the other one is still down.
// buttons_on_down :: proc(b: ^Buttons, button: Button) {
// 	b.down += {button}
// 	b.went_down += {button}
// }

// Records that the input of `button` went up.
// buttons_on_up :: proc(b: ^Buttons, button: Button) {
// 	b.down -= {button}
// }

// Records that all inputs went up, e.g. because the game lost focus and will
// not get the events of the inputs released from now on.
// buttons_on_all_up :: proc(b: ^Buttons) {
// 	b.down = {}
// }

