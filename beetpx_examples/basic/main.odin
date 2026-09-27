package main

// TODO: Rename collection to `beetpx`?
import "beetpx_core:."
import "beetpx_core:palettes"
import "core:fmt"
import "core:math"

main :: proc() {
	beetpx_core.set_on_update(update)
	beetpx_core.set_on_draw(draw)
	beetpx_core.start()
}

update :: proc() {
	// Printing on every frame floods the browser console, which can make the
	// dev tools laggy.
	if beetpx_core.frame_number() % 10 == 0 {
		fmt.printfln("Frame: %d", beetpx_core.frame_number())
	}
}

draw :: proc() {
	// BeetPx runs at 30 FPS, therefore here we change color every 1 second.
	if (beetpx_core.frame_number() / 30) % 2 == 0 {
		// TODO: Move draw calls to dedicated draw API, which will prevent
		// calling it outside "draw".
		beetpx_core.draw_clear_canvas(palettes.pico8_storm)
	} else {
		beetpx_core.draw_clear_canvas(palettes.pico8_lime)
	}

	// Marks 3 of the 4 canvas corners.
	beetpx_core.draw_pixel({0, 0}, palettes.pico8_lemon)
	beetpx_core.draw_pixel(
		{beetpx_core.CANVAS_WIDTH - 1, 0},
		palettes.pico8_ember,
	)
	beetpx_core.draw_pixel(
		{0, beetpx_core.CANVAS_HEIGHT - 1},
		palettes.pico8_black,
	)
}
