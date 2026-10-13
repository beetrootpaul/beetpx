package main

import "beetpx:bpx"
import "beetpx:bpxd"

// A color from outside of the icon, so that its transparent pixels stand out.
BACKGROUND :: bpx.Rgb{64, 64, 64}

icon: bpx.Icon

main :: proc() {
	icon = make_icon()
	// Without this call, the game would have the BeetPx logo as its icon.
	bpx.set_icon(icon)

	bpx.set_on_draw(on_draw)
	bpx.start(canvas_size = .Square_64, tick_rate = .Hz_30)
}

// Makes a heart icon out of text rows, one character per pixel.
make_icon :: proc() -> (icon: bpx.Icon) {
	rows := [len(bpx.Icon)]string {
		"................",
		"................",
		"..kkkk....kkkk..",
		".krrrrk..krrrrk.",
		"krrwwrrkkrrrrrrk",
		"krrwrrrrrrrrrrrk",
		"krrrrrrrrrrrrrrk",
		"krrrrrrrrrrrrrrk",
		".krrrrrrrrrrrrk.",
		"..krrrrrrrrrrk..",
		"...krrrrrrrrk...",
		"....krrrrrrk....",
		".....krrrrk.....",
		"......krrk......",
		".......kk.......",
		"................",
	}
	for row, y in rows {
		for char, x in row {
			switch char {
			case 'k':
				icon[y][x] = bpx.p_pico8_wine
			case 'r':
				icon[y][x] = bpx.p_pico8_ember
			case 'w':
				icon[y][x] = bpx.p_pico8_white
			}
		}
	}
	return
}

// Draws the icon over the whole canvas, 4 times bigger.
on_draw :: proc() {
	bpxd.clear_canvas(BACKGROUND)
	for row, y in icon {
		for pixel, x in row {
			if color, is_opaque := pixel.?; is_opaque {
				bpxd.rect_filled({f64(x * 4), f64(y * 4)}, {4, 4}, color)
			}
		}
	}
}
