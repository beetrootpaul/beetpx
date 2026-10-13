package beetpx_bpx

// TODO: Add the analog sticks.
// TODO: Tell gamepads apart, instead of merging all of them into one.

// Gamepad buttons, named by their position on the gamepad rather than by
// their labels, which differ between gamepad vendors. Comments give the Xbox
// and the PlayStation labels.
Gamepad_Button :: enum u8 {
	// D-pad up.
	Left_Face_Up,
	// D-pad down.
	Left_Face_Down,
	// D-pad left.
	Left_Face_Left,
	// D-pad right.
	Left_Face_Right,
	// Xbox: Y. PlayStation: Triangle.
	Right_Face_Up,
	// Xbox: A. PlayStation: Cross.
	Right_Face_Down,
	// Xbox: X. PlayStation: Square.
	Right_Face_Left,
	// Xbox: B. PlayStation: Circle.
	Right_Face_Right,
	// Xbox: View. PlayStation: Share or Create.
	Middle_Face_Left,
	// Xbox: Menu. PlayStation: Options.
	Middle_Face_Right,
	// Xbox: LB. PlayStation: L1.
	Left_Shoulder,
	// Xbox: RB. PlayStation: R1.
	Right_Shoulder,
	// Xbox: LT. PlayStation: L2.
	Left_Trigger,
	// Xbox: RT. PlayStation: R2.
	Right_Trigger,
	// Xbox: LS. PlayStation: L3.
	Left_Stick_Press,
	// Xbox: RS. PlayStation: R3.
	Right_Stick_Press,
}

@(private = "file")
_gamepad_buttons_pressed: bit_set[Gamepad_Button]

@(private = "file")
_gamepad_buttons_just_pressed: bit_set[Gamepad_Button]

// Reads the buttons from the platform. Runs once per tick, before
// `on_update`.
@(private)
_gamepad_update :: proc() {
	previously_pressed := _gamepad_buttons_pressed
	_gamepad_buttons_pressed = _platform_gamepad_buttons_pressed()
	_gamepad_buttons_just_pressed =
		_gamepad_buttons_pressed - previously_pressed
}

// Tells whether a given button is pressed on any of the connected gamepads.
gamepad_button_is_pressed :: proc(button: Gamepad_Button) -> bool {
	return button in _gamepad_buttons_pressed
}

// Tells whether a given button changed from released to pressed in the recent
// game loop iteration, on any of the connected gamepads.
gamepad_button_was_just_pressed :: proc(button: Gamepad_Button) -> bool {
	return button in _gamepad_buttons_just_pressed
}
