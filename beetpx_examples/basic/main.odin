package main

import "beetpx_core:."
import "beetpx_core:color/palettes"
import "core:fmt"

main :: proc() {
	beetpx_core.set_on_update(update)
	beetpx_core.set_on_draw(draw)
	beetpx_core.start()
}

update :: proc() {
	fmt.printfln("Frame: %d", beetpx_core.frame_number)
}

draw :: proc() {
	// BeetPx runs at 30 FPS, therefore here we change color every 1 second.
	if (beetpx_core.frame_number / 30) % 2 == 0 {
		// TODO: Move draw calls to dedicated draw API, which will prevent calling it outside "draw".
		beetpx_core.draw_clear_canvas(palettes.pico8_storm)
	} else {
		beetpx_core.draw_clear_canvas(palettes.pico8_lime)
	}
}
