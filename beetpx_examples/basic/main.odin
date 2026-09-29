package main

import "beetpx:bpx"

color: bpx.Rgb = {128, 128, 0}

main :: proc() {
	bpx.set_on_update(update)
	bpx.set_on_draw(draw)
	bpx.start()
}

update :: proc() {
	color.b = color.b + 4
}

draw :: proc() {
	bpx.draw_clear_canvas(color)
}
