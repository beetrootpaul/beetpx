package main

import "beetpx:bpx"
import "beetpx:bpxd"

State :: struct {}

main :: proc() {
	bpx.start(
		State,
		canvas_size = .Square_64,
		tick_rate = .Hz_30,
		on_draw = on_draw,
	)
}

on_draw :: proc(_: ^State) {
	bpxd.clear_canvas(bpx.p_pico8_storm)

	bpxd.pixel({1, 1}, bpx.p_pico8_orange)

	bpxd.rect({3, 1}, {4, 3}, bpx.p_pico8_orange)
	bpxd.rect_filled({8, 1}, {4, 3}, bpx.p_pico8_orange)
}
