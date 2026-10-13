package main

import "beetpx:bpx"
import "beetpx:bpxd"

SIZE :: 16
SPEED :: 2

main :: proc() {
	bpx.set_on_draw(on_draw)
	bpx.start(canvas_size = .Square_128, tick_rate = .Hz_30)
}

on_draw :: proc() {
	bpxd.clear_canvas(bpx.p_pico8_storm)

	// Move a square back and forth along the diagonal of the canvas.
	max_xy := bpx.canvas_size().x - SIZE
	xy := bpx.u_ping_pong(int(bpx.frame_number() * SPEED), max_xy)
	bpxd.rect_filled({f64(xy), f64(xy)}, {SIZE, SIZE}, bpx.p_pico8_pink)
}
