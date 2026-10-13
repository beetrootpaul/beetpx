package tests_examples_palettes

import palettes "../../../examples/palettes"
import "beetpx:bpx"
import "core:hash"
import tt "core:testing"

@(test)
palettes_replay :: proc(t: ^tt.T) {
	bpx.test_scope()
	palettes.main()

	// No tick is owed yet, but the frame is drawn anyway.
	bpx.test_advance({delta_s = 0})
	tt.expect_value(t, bpx.frame_number(), 0)
	tt.expect_value(t, _canvas_hash(), 0x1e12f1cbf67cb5a7)
}

@(private = "file")
_canvas_hash :: proc() -> u64 {
	return hash.fnv64a(bpx.test_canvas_rgba8_bytes())
}
