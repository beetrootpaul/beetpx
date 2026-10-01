package main

import "beetpx:bpx"

color: bpx.Rgb = {128, 128, 0}

main :: proc() {
	bpx.set_on_update(on_update)
	bpx.set_on_draw(bpx.u_noop)
	bpx.set_on_draw(on_draw)
	bpx.start()
}

on_update :: proc() {
	color.b = color.b + 4
	// TODO: REMOVE
	color.g = u8(bpx.frame_number())
}

on_draw :: proc() {
	bpx.d_clear_canvas(bpx.p_pico8_storm)
	// TODO: REMOVE
	bpx.d_pixel({1, 1}, 255 - color)
}
