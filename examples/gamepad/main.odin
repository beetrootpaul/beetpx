package main

import "beetpx:bpx"
import "beetpx:bpxd"

// Where each button is drawn, as a rectangle: `{x, y, w, h}`.
@(rodata)
button_rects := [bpx.Gamepad_Button][4]f64 {
	.Left_Trigger      = {6, 12, 10, 3},
	.Left_Shoulder     = {6, 16, 10, 3},
	.Right_Trigger     = {48, 12, 10, 3},
	.Right_Shoulder    = {48, 16, 10, 3},
	.Left_Face_Up      = {13, 25, 4, 4},
	.Left_Face_Down    = {13, 33, 4, 4},
	.Left_Face_Left    = {9, 29, 4, 4},
	.Left_Face_Right   = {17, 29, 4, 4},
	.Right_Face_Up     = {47, 25, 4, 4},
	.Right_Face_Down   = {47, 33, 4, 4},
	.Right_Face_Left   = {43, 29, 4, 4},
	.Right_Face_Right  = {51, 29, 4, 4},
	.Middle_Face_Left  = {26, 30, 4, 2},
	.Middle_Face_Right = {34, 30, 4, 2},
	.Left_Stick_Press  = {21, 41, 5, 5},
	.Right_Stick_Press = {38, 41, 5, 5},
}

// A just pressed button stays highlighted for a few ticks, so that even a
// short press shows.
just_pressed_ticks_left: [bpx.Gamepad_Button]u8

main :: proc() {
	bpx.set_on_update(on_update)
	bpx.set_on_draw(on_draw)
	bpx.start(canvas_size = .Square_64, tick_rate = .Hz_30)
}

on_update :: proc() {
	for button in bpx.Gamepad_Button {
		if bpx.gamepad_button_was_just_pressed(button) {
			just_pressed_ticks_left[button] = 4
		} else if just_pressed_ticks_left[button] > 0 {
			just_pressed_ticks_left[button] -= 1
		}
	}
}

on_draw :: proc() {
	bpxd.clear_canvas(bpx.p_pico8_storm)

	for rect, button in button_rects {
		color := bpx.p_pico8_slate
		if just_pressed_ticks_left[button] > 0 {
			color = bpx.p_pico8_ember
		} else if bpx.gamepad_button_is_pressed(button) {
			color = bpx.p_pico8_lemon
		}
		bpxd.rect_filled(rect.xy, rect.zw, color)
	}
}
