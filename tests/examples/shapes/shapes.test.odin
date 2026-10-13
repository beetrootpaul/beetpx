package tests_examples_shapes

import shapes "../../../examples/shapes"
import "beetpx:bpx"
import "core:hash"
import tt "core:testing"

@(test)
shapes_replay :: proc(t: ^tt.T) {
	bpx.test_scope()
	shapes.main()

	// No tick is owed yet, but the frame is drawn anyway.
	bpx.test_advance({delta_s = 0})
	tt.expect_value(t, bpx.frame_number(), 0)
	tt.expect_value(t, _canvas_hash(), 0xa8a034ba3bccd236)
}

@(private = "file")
_canvas_hash :: proc() -> u64 {
	return hash.fnv64a(bpx.test_canvas_rgba8_bytes())
}
