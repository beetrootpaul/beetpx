package beetpx_bpx

// TODO: Add game buttons, bound to keyboard, gamepad, and touch, on top of
//       the keys.
// TODO: Add more keys, and "just released" and "is pressed" checks.

// Keyboard keys games can check. Each one is a physical key, so it does not
// depend on the keyboard layout.
Key :: enum u8 {
	Left,
	Right,
	Up,
	Down,
}

// Keys pressed since the last `_input_update`. Kept separately from
// `_keys_just_pressed`, so that a press between two ticks is not lost.
@(private = "file")
_keys_pressed_since_update: bit_set[Key]

@(private = "file")
_keys_just_pressed: bit_set[Key]

// Called by the platform whenever a key goes down, without repeats.
@(private)
_input_key_down :: proc(key: Key) {
	_keys_pressed_since_update += {key}
}

// Takes the keys pressed since the previous call as just pressed. Runs once
// per tick, before `on_update`.
@(private)
_input_update :: proc() {
	_keys_just_pressed = _keys_pressed_since_update
	_keys_pressed_since_update = {}
}

// Tells whether a given key changed from released to pressed in the recent
// game loop iteration.
key_was_just_pressed :: proc(key: Key) -> bool {
	return key in _keys_just_pressed
}
