package beetpx_bpx

// TODO: Replace the hardcoded keys with actions games define and bind to
//       keyboard, gamepad, and touch. Then expose them to games.
// TODO: Make the debug keys available in development builds only.

// The keyboard keys BeetPx reacts to.
@(private)
Key :: enum u8 {
	// `;`, toggles the debug mode.
	Semicolon,
}

// Keys pressed since the last `input_update`. Kept separately from
// `keys_just_pressed`, so that a press between two ticks is not lost.
@(private = "file")
keys_pressed_since_update: bit_set[Key]

@(private = "file")
keys_just_pressed: bit_set[Key]

// Called by the platform whenever a key goes down, without repeats.
@(private)
input_key_down :: proc(key: Key) {
	keys_pressed_since_update += {key}
}

// Takes the keys pressed since the previous call as just pressed. Runs once
// per tick.
@(private)
input_update :: proc() {
	keys_just_pressed = keys_pressed_since_update
	keys_pressed_since_update = {}
}

// Whether `key` went down since the previous tick.
@(private)
key_just_pressed :: proc(key: Key) -> bool {
	return key in keys_just_pressed
}
