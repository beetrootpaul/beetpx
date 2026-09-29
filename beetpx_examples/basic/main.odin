package main

import "beetpx:bpx"
import "beetpx:palettes"
import "core:fmt"

main :: proc() {
	bpx.set_on_update(update)
	bpx.set_on_draw(draw)
	bpx.start()
}

update :: proc() {
	// Printing on every frame floods the browser console, which can make the
	// dev tools laggy.
	if bpx.frame_number() % 10 == 0 {
		fmt.printfln("Frame: %d", bpx.frame_number())
	}
}

draw :: proc() {
	// There are 30 frames per second, so this switches the color every second.
	if (bpx.frame_number() / 30) % 2 == 0 {
		// TODO: Move draw calls to a dedicated draw API, callable only inside
		// `draw`.
		bpx.draw_clear_canvas(palettes.pico8_storm)
	} else {
		bpx.draw_clear_canvas(palettes.pico8_lime)
	}

	// Marks 3 of the 4 canvas corners.
	//
	// TODO: Move draw calls to a dedicated draw API, callable only inside
	// `draw`.
	bpx.draw_pixel({0, 0}, palettes.pico8_lemon)
	bpx.draw_pixel({bpx.CANVAS_WIDTH - 1, 0}, palettes.pico8_ember)
	bpx.draw_pixel({0, bpx.CANVAS_HEIGHT - 1}, palettes.pico8_black)
}
