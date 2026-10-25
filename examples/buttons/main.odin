package main

import "beetpx:bpx"
import "beetpx:bpxd"

@(rodata)
MOVEMENT := [bpx.Button]bpx.Xy {
	.Left  = {-1, 0},
	.Right = {1, 0},
	.Up    = {0, -1},
	.Down  = {0, 1},
}

CENTER := bpx.Xy{128, 128} / 2
WH := bpx.Xy{4,4}
xy := CENTER
color := bpx.p_pico8_slate

main :: proc() {
	bpx.set_on_tick(on_tick)
	bpx.set_on_draw(on_draw)
	bpx.start(canvas_size = .Square_128, tick_rate = .Hz_60)
}

on_tick :: proc() {
	// TODO: This example is a bit strange… Do a better one once we support more
	//       buttons.
	//
	// If any button is pressed, "activate" the pixel by changing its color to
	// a more vivid one.
	if bpx.just_pressed() != {} do color = bpx.p_pico8_ember

	// TODO: This `just_pressed` for movement is pretty unintuitive. Once more
	//       buttons are supported, use `pressed` here, and `just_pressed` for
	//       something else.
	//
	// Move the pixel step by step. Every button press is an individual
	// movement (there is no continuous movement here).
	for b in bpx.just_pressed() do xy += MOVEMENT[b]

	// Pressing opposite directions at once makes the pixel position reset in
	// the respective axis.
	if bpx.pressed() >= {.Left, .Right} do xy.x = CENTER.x
	if bpx.pressed() >= {.Up, .Down} do xy.y = CENTER.y

}

on_draw :: proc() {
	bpxd.clear_canvas(bpx.p_pico8_storm)
	bpxd.rect_filled(xy - WH / 2, WH, color)
}
