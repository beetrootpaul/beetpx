package beetpx_bpx

// A definition of a sprite, which can later be used for drawing by
// `bpxd.sprite`.
Sprite :: struct {
	image : ^Image,
	// The top-left corner of the sprite on the image.
	xy_min: Xy_Int,
	wh    : Xy_Int,
}

// Makes a sprite of size `wh`, cut out of `image`, with one of its corners at
// `xy`.
//
// A negative width makes the sprite extend from `xy` to the left, and
// a negative height makes it extend from `xy` to the top. The sprite may
// extend beyond the image: that part is not drawn.
sprite_make :: proc(image: ^Image, xy: Xy, wh: Xy) -> Sprite {
	xy_1 := u_round(xy)
	xy_2 := u_round(xy + wh)
	xy_min := Xy_Int{min(xy_1.x, xy_2.x), min(xy_1.y, xy_2.y)}
	xy_max := Xy_Int{max(xy_1.x, xy_2.x), max(xy_1.y, xy_2.y)}
	return {image = image, xy_min = xy_min, wh = xy_max - xy_min}
}
