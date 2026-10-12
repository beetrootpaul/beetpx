package tests_bpx

import "beetpx:bpx"
import tt "core:testing"

@(test)
sprite_make_positive_wh :: proc(t: ^tt.T) {
	s := bpx.sprite_make(nil, {8, 16}, {8, 4})
	tt.expect_value(t, s.xy_min, bpx.Xy_Int{8, 16})
	tt.expect_value(t, s.wh, bpx.Xy_Int{8, 4})
}

@(test)
sprite_make_negative_wh :: proc(t: ^tt.T) {
	s := bpx.sprite_make(nil, {8, 16}, {-8, -4})
	tt.expect_value(t, s.xy_min, bpx.Xy_Int{0, 12})
	tt.expect_value(t, s.wh, bpx.Xy_Int{8, 4})
}

@(test)
sprite_make_rounding :: proc(t: ^tt.T) {
	s := bpx.sprite_make(nil, {0.5, 1.4}, {2, 2.2})
	tt.expect_value(t, s.xy_min, bpx.Xy_Int{1, 1})
	tt.expect_value(t, s.wh, bpx.Xy_Int{2, 3})
}
