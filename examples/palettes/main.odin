package main

import "beetpx:bpx"
import "beetpx:bpxd"

// A color from outside of every palette, so that each palette color, black
// included, stands out against it.
BACKGROUND :: bpx.Rgb{64, 64, 64}

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
	bpxd.clear_canvas(BACKGROUND)
	// TODO: Have more palettes.
	draw_palette(row = 0, palette = bpx.p_pico8[:])
}

draw_palette :: proc(row: int, palette: []bpx.Rgb) {
	for color, i in palette {
		bpxd.pixel(i, row, color)
	}
}
