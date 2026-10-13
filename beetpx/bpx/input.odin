package beetpx_bpx

// TODO: Add game buttons, bound to keyboard, gamepad, and touch, on top of
//       the keys.
// TODO: Add more keys.

// Input checks for every device follow one naming pattern: `*_went_down`,
// `*_went_up`, and `*_is_held`, e.g. `key_went_down`.

// Keyboard keys games can check. Each one is a physical key, so it does not
// depend on the keyboard layout.
Key :: enum u8 {
	Left,
	Right,
	Up,
	Down,
}

@(private = "file")
_keys_held: bit_set[Key]

// Keys changed since the last `_input_update`. Kept separately from the ones
// of the current tick, so that a change between two ticks is not lost.
@(private = "file")
_keys_went_down_since_update: bit_set[Key]
@(private = "file")
_keys_went_up_since_update: bit_set[Key]
@(private = "file")
_keys_repeated_since_update: bit_set[Key]

@(private = "file")
_keys_went_down: bit_set[Key]
@(private = "file")
_keys_went_up: bit_set[Key]
@(private = "file")
_keys_repeated: bit_set[Key]
@(private = "file")
_keys_held_in_tick: bit_set[Key]

// Called by the platform whenever a key goes down. `repeat` marks the
// repeats the OS sends while the key is held.
@(private)
_input_key_down :: proc(key: Key, repeat: bool) {
	if repeat {
		_keys_repeated_since_update += {key}
	} else {
		_keys_went_down_since_update += {key}
	}
	_keys_held += {key}
}

// Called by the platform whenever a key goes up.
@(private)
_input_key_up :: proc(key: Key) {
	if key in _keys_held do _keys_went_up_since_update += {key}
	_keys_held -= {key}
}

// Called by the platform when the game stops getting key events, e.g. on
// focus loss. Otherwise, a key released meanwhile would stay held.
@(private)
_input_release_all_keys :: proc() {
	_keys_went_up_since_update += _keys_held
	_keys_held = {}
}

// Takes the changes since the previous call as the ones of the current tick.
// Runs once per tick, before `on_update`.
@(private)
_input_update :: proc() {
	_keys_went_down = _keys_went_down_since_update
	_keys_went_up = _keys_went_up_since_update
	_keys_repeated = _keys_repeated_since_update
	_keys_held_in_tick = _keys_held

	_keys_went_down_since_update = {}
	_keys_went_up_since_update = {}
	_keys_repeated_since_update = {}
}

// Tells whether a given key changed from released to pressed in the recent
// game loop iteration.
//
// With `allow_repeat`, it is also true on the repeats the OS sends while the
// key is held, e.g. to move through a menu.
key_went_down :: proc(key: Key, allow_repeat := false) -> bool {
	return key in _keys_went_down || (allow_repeat && key in _keys_repeated)
}

// Tells whether a given key changed from pressed to released in the recent
// game loop iteration.
//
// A short tap may make it true in the same tick as `key_went_down`.
key_went_up :: proc(key: Key) -> bool {
	return key in _keys_went_up
}

// Tells whether a given key is pressed right now.
key_is_held :: proc(key: Key) -> bool {
	return key in _keys_held_in_tick
}
