package main

import "beetpx:bpx"
import "beetpx:bpxd"

main :: proc() {
	bpx.set_on_draw(on_draw)
	bpx.start(canvas_size = .Square_64, tick_rate = .Hz_30)
}

on_draw :: proc() {
	bpxd.clear_canvas(bpx.p_pico8_storm)
	bpxd.rect_filled({16, 16}, {32, 32}, bpx.p_pico8_lime)
}
