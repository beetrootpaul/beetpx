package main

import bc "beetpx:core"
import bd "beetpx:draw"
import bp "beetpx:palettes"
import bu "beetpx:utils"

color: bc.Rgb = {128, 128, 0}

main :: proc() {
	bc.set_on_update(on_update)
	bc.set_on_draw(bu.noop)
	bc.set_on_draw(on_draw)
	bc.start()
}

on_update :: proc() {
	color.b = color.b + 4
}

on_draw :: proc() {
	bd.clear_canvas(bp.pico8_storm)
	bd.pixel({1, 1}, 255 - color)
}
