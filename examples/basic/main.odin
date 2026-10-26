package main

import "beetpx:bpx"
import "beetpx:bpxd"

MAX_B :: 255
SPEED :: 4

State :: struct {
	color: bpx.Rgb,
}

main :: proc() {
	bpx.start(
		State,
		canvas_size = .Square_64,
		tick_rate = .Hz_30,
		on_started = on_started,
		on_tick = on_tick,
		on_draw = on_draw,
	)
}

on_started :: proc(s: ^State) {
	s.color = {128, 128, 0}
}

on_tick :: proc(s: ^State) {
	// Change the blue channel of the color at a constant speed, from 0 to 255
	// and back to 0, on repeat.
	s.color.b = u8(bpx.u_ping_pong(int(bpx.tick_number() * SPEED), MAX_B))
}

on_draw :: proc(s: ^State) {
	bpxd.clear_canvas(s.color)
}
