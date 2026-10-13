package tests_bpx

import "beetpx:bpx"
import tt "core:testing"

@(test)
animated_sprite_starts_at_first_frame :: proc(t: ^tt.T) {
	xys := [?]bpx.Xy{{8, 16}, {16, 16}}
	s := bpx.animated_sprite_current(
		bpx.animated_sprite_make(nil, xys[:], {8, 8}, 2),
	)
	tt.expect_value(t, s.xy_min, bpx.Xy_Int{8, 16})
	tt.expect_value(t, s.wh, bpx.Xy_Int{8, 8})
}

@(test)
animated_sprite_without_frames :: proc(t: ^tt.T) {
	s := bpx.animated_sprite_current(bpx.animated_sprite_make(nil, {}, {8, 8}))
	tt.expect_value(t, s, bpx.Sprite{})
}
