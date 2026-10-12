package main

import "beetpx:bpx"
import "beetpx:bpxd"

// TODO: PoC of publishing to make sure the assets are included when e.g. on
//       itch.io.

// TODO: Sprites from nested dirs.

// TODO: For bigger assets loaded on game start, we might need a proper loading
//       indicator. Also, maybe should make sure desktop is also loading async
//       with a loader, instead of blocking(?) sync.

LOGO_IMAGE_PATH :: "beetpx_logo.png"

// TODO: Use `sprite_make` again? But then what about calling procs outside the
//       Odin context?

// Portion of the BeetPx logo which includes only "px" letters.
px_sprite :: bpx.Sprite {
	image_path = LOGO_IMAGE_PATH,
	xy         = {1, 10},
	wh         = {9, 5},
}

main :: proc() {
	bpx.set_on_draw(on_draw)
	bpx.start(
		canvas_size = .Square_64,
		tick_rate = .Hz_30,
		assets = {LOGO_IMAGE_PATH},
	)
}

on_draw :: proc() {
	bpxd.clear_canvas(bpx.p_pico8_dusk)
	bpxd.sprite({2, 1}, px_sprite)
}
