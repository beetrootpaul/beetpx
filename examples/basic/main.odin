package main

import "beetpx:bpx"

MAX_B :: 255
SPEED :: 4

color: bpx.Rgb = {128, 128, 0}

main :: proc() {
	bpx.set_on_update(on_update)
	bpx.set_on_draw(on_draw)
	bpx.start()
}

// TODO: Consider some shorter name for frame_number
on_update :: proc() {
	// Change the blue portion of the color at a constant speed, from 0 to 255
	// and back to 0, on repeat.
	color.b = u8(
		MAX_B - abs(int(bpx.frame_number() * SPEED) % (2 * MAX_B) - MAX_B),
	)
}

on_draw :: proc() {
	bpx.d_clear_canvas(color)
}
