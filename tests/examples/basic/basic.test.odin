package tests_examples_basic

import basic "../../../examples/basic"
import "beetpx:bpx"
import "core:hash"
import tt "core:testing"

@(private = "file")
_TICK_S :: 1.0 / 30

@(test)
basic_replay :: proc(t: ^tt.T) {
	bpx.test_scope()
	basic.main()

	for _ in 0 ..< 3 do bpx.test_advance({delta_s = _TICK_S})
	tt.expect_value(t, bpx.frame_number(), 3)
	tt.expect_value(t, _canvas_hash(), 0x1d597dff342c2325)

	// A 1 s hitch owes 30 ticks, but only 5 run.
	bpx.test_advance({delta_s = 1})
	tt.expect_value(t, bpx.frame_number(), 8)
	tt.expect_value(t, _canvas_hash(), 0xd3954df3aa952325)
}

@(private = "file")
_canvas_hash :: proc() -> u64 {
	return hash.fnv64a(bpx.test_canvas_rgba8_bytes())
}
