package main

import "beetpx:bpx"
import "beetpx:bpxd"

main :: proc() {
	bpx.set_on_draw(on_draw)
	bpx.start(canvas_size = .Square_64, tick_rate = .Hz_30)
}

on_draw :: proc() {
	bpxd.clear_canvas(bpx.p_pico8_storm)

	bpxd.pixel({1, 1}, bpx.p_pico8_lemon)

	bpxd.rect_filled({3, 1}, {4, 3}, bpx.p_pico8_orange)
}
