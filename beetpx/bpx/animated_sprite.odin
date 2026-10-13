package beetpx_bpx

// A definition of an animated sprite, which can later be used for drawing by
// `bpxd.sprite`.
//
// It is a looped sequence of sprites, cut out of the same image. The animation
// progresses along with the game loop, by one frame per `frame_duration`
// ticks.
Animated_Sprite :: struct {
	_image         : ^Image,
	_xys           : []Xy,
	_wh            : Xy,
	_frame_duration: u32,
	_start_tick    : u32,
}

// Makes an animated sprite, with frames of size `wh`, cut out of `image` at
// `xys`. See `sprite_make` for how `xy` and `wh` of each frame are handled.
//
// `xys` is not copied, so it has to outlive the animated sprite. A
// `@(rodata)` array works well for this.
//
// A `frame_duration` of 0 is treated as 1.
animated_sprite_make :: proc(
	image: ^Image,
	xys: []Xy,
	wh: Xy,
	frame_duration: u32 = 1,
) -> Animated_Sprite {
	return {
		_image          = image,
		_xys            = xys,
		_wh             = wh,
		_frame_duration = max(frame_duration, 1),
		_start_tick     = frame_number(),
	}
}

// A sprite to be drawn in the current game loop iteration.
//
// Returns an empty sprite, which draws nothing, if there are no frames.
animated_sprite_current :: proc(as: Animated_Sprite) -> Sprite {
	if len(as._xys) == 0 do return {}
	// Unsigned subtraction stays correct when the tick number wraps around.
	ticks := frame_number() - as._start_tick
	frame := int(ticks / as._frame_duration) % len(as._xys)
	return sprite_make(as._image, as._xys[frame], as._wh)
}
