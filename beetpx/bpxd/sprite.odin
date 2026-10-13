package beetpx_bpxd

import "../bpx"
import "../internal"

// TODO: Tests.

// Draws a sprite with its top-left corner at `xy`. For an animated sprite, it
// draws its current frame.
sprite :: proc {
	_sprite_static,
	_sprite_animated,
}

@(private = "file")
_sprite_static :: proc(sprite: bpx.Sprite, xy: bpx.Xy) {
	if sprite.image == nil do return
	image := sprite.image^

	// The part of the sprite that lies within the image.
	x_min_incl := max(sprite.xy_min.x, 0)
	y_min_incl := max(sprite.xy_min.y, 0)
	x_max_excl := min(sprite.xy_min.x + sprite.wh.x, image.size.x)
	y_max_excl := min(sprite.xy_min.y + sprite.wh.y, image.size.y)

	image_to_canvas := bpx.u_round(xy) - sprite.xy_min
	for y in y_min_incl ..< y_max_excl {
		for x in x_min_incl ..< x_max_excl {
			internal.canvas_set(
				bpx.Xy_Int{x, y} + image_to_canvas,
				image.pixels[y * image.size.x + x],
			)
		}
	}
}

@(private = "file")
_sprite_animated :: proc(sprite: bpx.Animated_Sprite, xy: bpx.Xy) {
	_sprite_static(bpx.animated_sprite_current(sprite), xy)
}
