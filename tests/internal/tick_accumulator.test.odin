package tests_internal

import "beetpx:internal"
import "core:slice"
import tt "core:testing"

// A power of 2, so that sums of its multiples are exact in `f64`.
@(private = "file")
_TICK_S :: 0.25

@(private = "file")
_advance_all :: proc(
	ta: ^internal.Tick_Accumulator,
	deltas_s: []f64,
	allocator := context.temp_allocator,
) -> []int {
	ticks := make([]int, len(deltas_s), allocator)
	for delta_s, i in deltas_s {
		ticks[i] = internal.tick_accumulator_advance(ta, delta_s)
	}
	return ticks
}

@(test)
tick_accumulator_one_tick_per_tick_duration :: proc(t: ^tt.T) {
	ta := internal.tick_accumulator_make(_TICK_S, max_catchup_ticks = 5)
	tt.expect_value(t, internal.tick_accumulator_advance(&ta, 0), 0)
	tt.expect_value(t, internal.tick_accumulator_advance(&ta, 0.125), 0)
	tt.expect_value(t, internal.tick_accumulator_advance(&ta, 0.125), 1)
	tt.expect_value(t, internal.tick_accumulator_advance(&ta, 0.25), 1)
}

@(test)
tick_accumulator_catches_up_after_a_long_delta :: proc(t: ^tt.T) {
	ta := internal.tick_accumulator_make(_TICK_S, max_catchup_ticks = 5)
	ticks := _advance_all(&ta, {0.125, 1.0, 0.125})
	tt.expectf(t, slice.equal(ticks, []int{0, 4, 1}), "got %v", ticks)
}

@(test)
tick_accumulator_drops_the_backlog_over_the_cap :: proc(t: ^tt.T) {
	ta := internal.tick_accumulator_make(_TICK_S, max_catchup_ticks = 5)
	// 10 ticks are owed, but only 5 run, and the other 5 are dropped.
	ticks := _advance_all(&ta, {2.5, 0.125, 0.125})
	tt.expectf(t, slice.equal(ticks, []int{5, 0, 1}), "got %v", ticks)
}

@(test)
tick_accumulator_keeps_the_remainder_at_the_cap :: proc(t: ^tt.T) {
	ta := internal.tick_accumulator_make(_TICK_S, max_catchup_ticks = 5)
	// 5.5 ticks are owed: 5 run, and the half tick is kept, not dropped.
	ticks := _advance_all(&ta, {1.375, 0.125})
	tt.expectf(t, slice.equal(ticks, []int{5, 1}), "got %v", ticks)
}

@(test)
tick_accumulator_30_hz_on_a_60_hz_display :: proc(t: ^tt.T) {
	ta := internal.tick_accumulator_make(1.0 / 30, max_catchup_ticks = 5)
	deltas_s: [12]f64
	for &d in deltas_s do d = 1.0 / 60
	ticks := _advance_all(&ta, deltas_s[:])
	tt.expectf(
		t,
		slice.equal(ticks, []int{0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1}),
		"got %v",
		ticks,
	)
}
