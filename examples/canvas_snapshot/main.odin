package main

import "beetpx:bpx"
import "beetpx:bpxd"

SPEED :: 1

lens_x: f64

main :: proc() {
	bpx.set_on_update(on_update)
	bpx.set_on_draw(on_draw)
	bpx.start(canvas_size = .Square_64, tick_rate = .Hz_30)
}

on_update :: proc() {
	// Move the lens from left to right and back, on repeat.
	lens_x = f64(bpx.u_ping_pong(int(bpx.frame_number() * SPEED), 48))
}

on_draw :: proc() {
	for color, i in bpx.p_pico8 {
		bpxd.rect_filled({0, f64(i * 4)}, {64, 4}, color)
	}

	// Invert the colors under the lens, using the canvas drawn so far.
	bpxd.take_canvas_snapshot()
	bpxd.rect_filled({lens_x, 16}, {16, 32}, invert)
}

invert :: proc(c: bpx.Rgb, _: bpx.Xy_Int) -> (bpx.Rgb, bool) {
	return 255 - c, true
}
