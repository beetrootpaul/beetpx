package main

import "beetpx:bpx"

MAX_B :: 255
SPEED :: 4

color: bpx.Rgb = {128, 128, 0}

main :: proc() {
	bpx.set_on_update(on_update)
	bpx.set_on_draw(on_draw)
	bpx.start(canvas_size = .Square_64, tick_rate = .Hz_30)
}

on_update :: proc() {
	// Change the blue channel of the color at a constant speed, from 0 to 255
	// and back to 0, on repeat.
	color.b = u8(bpx.u_ping_pong(int(bpx.frame_number() * SPEED), MAX_B))
}

on_draw :: proc() {
	bpx.d_clear_canvas(color)
}
