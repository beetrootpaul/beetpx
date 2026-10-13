package beetpx_bpx

// TODO: Add game buttons, bound to keyboard, gamepad, and touch, on top of
//       the keys and gamepad buttons.
// TODO: Add more keys and gamepad buttons, gamepad sticks, and "just
//       released" and "is pressed" checks.

// Keyboard keys games can check. Each one is a physical key, so it does not
// depend on the keyboard layout.
Key :: enum u8 {
	Left,
	Right,
	Up,
	Down,
}

// Gamepad buttons games can check. Presses on all connected gamepads count.
Gamepad_Button :: enum u8 {
	Dpad_Left,
	Dpad_Right,
	Dpad_Up,
	Dpad_Down,
}

// Keys and gamepad buttons pressed since the last `_input_update`. Kept
// separately from the "just pressed" ones, so that a press between two ticks
// is not lost.
@(private = "file")
_keys_pressed_since_update: bit_set[Key]
@(private = "file")
_gamepad_buttons_pressed_since_update: bit_set[Gamepad_Button]

@(private = "file")
_keys_just_pressed: bit_set[Key]
@(private = "file")
_gamepad_buttons_just_pressed: bit_set[Gamepad_Button]

// Called by the platform whenever a key goes down, without repeats.
@(private)
_input_key_down :: proc(key: Key) {
	_keys_pressed_since_update += {key}
}

// Called by the platform whenever a gamepad button goes down.
@(private)
_input_gamepad_button_down :: proc(button: Gamepad_Button) {
	_gamepad_buttons_pressed_since_update += {button}
}

// Takes the keys and gamepad buttons pressed since the previous call as just
// pressed. Runs once per tick, before `on_update`.
@(private)
_input_update :: proc() {
	_keys_just_pressed = _keys_pressed_since_update
	_keys_pressed_since_update = {}

	_gamepad_buttons_just_pressed = _gamepad_buttons_pressed_since_update
	_gamepad_buttons_pressed_since_update = {}
}

// Tells whether a given key changed from released to pressed in the recent
// game loop iteration.
key_was_just_pressed :: proc(key: Key) -> bool {
	return key in _keys_just_pressed
}

// Tells whether a given gamepad button changed from released to pressed in the
// recent game loop iteration.
gamepad_button_was_just_pressed :: proc(button: Gamepad_Button) -> bool {
	return button in _gamepad_buttons_just_pressed
}
