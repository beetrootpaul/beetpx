package main

import "beetpx:bpx"
import "beetpx:bpxd"
import "core:fmt"

xy: bpx.Xy = {31, 31}
// The game pauses while its window has no focus.
is_paused: bool

main :: proc() {
	bpx.set_on_update(on_update)
	bpx.set_on_draw(on_draw)
	bpx.start(canvas_size = .Square_64, tick_rate = .Hz_30)
}

on_update :: proc() {
	for event in bpx.events() {
		fmt.println(event)

		switch e in event {
		case bpx.Event_Key_Down:
			if is_paused do continue
			switch e.key {
			case .Left:
				xy.x -= 1
			case .Right:
				xy.x += 1
			case .Up:
				xy.y -= 1
			case .Down:
				xy.y += 1
			}
		case bpx.Event_Key_Up:
		case bpx.Event_Focus_Lost:
			is_paused = true
		case bpx.Event_Focus_Gained:
			is_paused = false
		case bpx.Event_Resize:
		}
	}
}

on_draw :: proc() {
	bpxd.clear_canvas(is_paused ? bpx.p_pico8_storm : bpx.p_pico8_moss)
	bpxd.pixel(xy, bpx.p_pico8_lemon)
}
