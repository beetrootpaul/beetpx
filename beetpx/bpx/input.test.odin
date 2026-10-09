#+build !js
package beetpx_bpx

import tt "core:testing"

// A single test, since tests run in parallel and the input state is global.
@(test)
key_just_pressed_for_one_update :: proc(t: ^tt.T) {
	input_update()
	tt.expect(t, !key_just_pressed(.Semicolon))

	input_key_down(.Semicolon)
	tt.expect(t, !key_just_pressed(.Semicolon))

	input_update()
	tt.expect(t, key_just_pressed(.Semicolon))

	input_update()
	tt.expect(t, !key_just_pressed(.Semicolon))

	// Pressed twice between updates.
	input_key_down(.Semicolon)
	input_key_down(.Semicolon)

	input_update()
	tt.expect(t, key_just_pressed(.Semicolon))

	input_update()
	tt.expect(t, !key_just_pressed(.Semicolon))
}
