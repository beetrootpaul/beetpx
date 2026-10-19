#+test
package beetpx_bpx

// import "beetpx:internal"
import tt "core:testing"

@(test)
nothing_pressed_initially :: proc(t: ^tt.T) {
	// 	b: internal.Buttons
	
	_buttons_tick()
	// _buttons_tick(&b)

	// 	tt.expect_value(t, b.pressed, bit_set[internal.Button]{})
	// 	tt.expect_value(t, b.just_pressed, bit_set[internal.Button]{})
}

// @(test)
// held_button_is_just_pressed_in_first_tick_only :: proc(t: ^tt.T) {
// 	b: internal.Buttons
//
// 	internal.buttons_on_down(&b, .Left)
//
// 	_buttons_tick(&b)
// 	tt.expect_value(t, b.pressed, bit_set[internal.Button]{.Left})
// 	tt.expect_value(t, b.just_pressed, bit_set[internal.Button]{.Left})
//
// 	_buttons_tick(&b)
// 	tt.expect_value(t, b.pressed, bit_set[internal.Button]{.Left})
// 	tt.expect_value(t, b.just_pressed, bit_set[internal.Button]{})
// }
//
// @(test)
// released_button_is_no_longer_pressed :: proc(t: ^tt.T) {
// 	b: internal.Buttons
//
// 	internal.buttons_on_down(&b, .Left)
// 	_buttons_tick(&b)
//
// 	internal.buttons_on_up(&b, .Left)
// 	_buttons_tick(&b)
// 	tt.expect_value(t, b.pressed, bit_set[internal.Button]{})
// 	tt.expect_value(t, b.just_pressed, bit_set[internal.Button]{})
// }
//
// @(test)
// tap_between_ticks_is_pressed_for_one_tick :: proc(t: ^tt.T) {
// 	b: internal.Buttons
//
// 	internal.buttons_on_down(&b, .Left)
// 	internal.buttons_on_up(&b, .Left)
//
// 	_buttons_tick(&b)
// 	tt.expect_value(t, b.pressed, bit_set[internal.Button]{.Left})
// 	tt.expect_value(t, b.just_pressed, bit_set[internal.Button]{.Left})
//
// 	_buttons_tick(&b)
// 	tt.expect_value(t, b.pressed, bit_set[internal.Button]{})
// 	tt.expect_value(t, b.just_pressed, bit_set[internal.Button]{})
// }
//
// @(test)
// press_again_between_ticks_is_just_pressed_again :: proc(t: ^tt.T) {
// 	b: internal.Buttons
//
// 	internal.buttons_on_down(&b, .Left)
// 	_buttons_tick(&b)
//
// 	internal.buttons_on_up(&b, .Left)
// 	internal.buttons_on_down(&b, .Left)
// 	_buttons_tick(&b)
// 	tt.expect_value(t, b.pressed, bit_set[internal.Button]{.Left})
// 	tt.expect_value(t, b.just_pressed, bit_set[internal.Button]{.Left})
// }
//
// @(test)
// press_waits_for_next_tick :: proc(t: ^tt.T) {
// 	b: internal.Buttons
//
// 	_buttons_tick(&b)
// 	internal.buttons_on_down(&b, .Left)
// 	tt.expect_value(t, b.pressed, bit_set[internal.Button]{})
// 	tt.expect_value(t, b.just_pressed, bit_set[internal.Button]{})
//
// 	_buttons_tick(&b)
// 	tt.expect_value(t, b.pressed, bit_set[internal.Button]{.Left})
// 	tt.expect_value(t, b.just_pressed, bit_set[internal.Button]{.Left})
// }
//
// @(test)
// buttons_are_independent :: proc(t: ^tt.T) {
// 	b: internal.Buttons
//
// 	internal.buttons_on_down(&b, .Left)
// 	_buttons_tick(&b)
//
// 	internal.buttons_on_down(&b, .Up)
// 	_buttons_tick(&b)
// 	tt.expect_value(t, b.pressed, bit_set[internal.Button]{.Left, .Up})
// 	tt.expect_value(t, b.just_pressed, bit_set[internal.Button]{.Up})
// }
//
// @(test)
// all_up_releases_held_buttons_but_keeps_taps :: proc(t: ^tt.T) {
// 	b: internal.Buttons
//
// 	internal.buttons_on_down(&b, .Left)
// 	_buttons_tick(&b)
//
// 	internal.buttons_on_down(&b, .Up)
// 	internal.buttons_on_all_up(&b)
// 	_buttons_tick(&b)
// 	tt.expect_value(t, b.pressed, bit_set[internal.Button]{.Up})
// 	tt.expect_value(t, b.just_pressed, bit_set[internal.Button]{.Up})
//
// 	_buttons_tick(&b)
// 	tt.expect_value(t, b.pressed, bit_set[internal.Button]{})
// }
