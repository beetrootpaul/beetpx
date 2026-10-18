package tests_internal

import "beetpx:internal"
import tt "core:testing"

@(private = "file")
_MAX_TICKS :: 5

// Runs host frames `frame_s` apart, each one measured `offsets_s[i]` off
// its exact time, and checks how many ticks run on each frame.
@(private = "file")
_expect_ticks_per_frame :: proc(
	t: ^tt.T,
	tick_s: f64,
	frame_s: f64,
	offsets_s: []f64,
	expected_ticks: []int,
) {
	accumulated_s := 0.0
	prev_offset_s := 0.0
	for offset_s, i in offsets_s {
		accumulated_s += frame_s + offset_s - prev_offset_s
		prev_offset_s = offset_s
		ticks: int
		ticks, accumulated_s = internal.game_loop_ticks(
			accumulated_s,
			tick_s,
			_MAX_TICKS,
		)
		tt.expectf(
			t,
			ticks == expected_ticks[i],
			"frame %v: expected %v ticks, got %v",
			i,
			expected_ticks[i],
			ticks,
		)
	}
}

@(test)
one_tick_per_frame_when_rates_match :: proc(t: ^tt.T) {
	_expect_ticks_per_frame(
		t,
		1.0 / 60,
		1.0 / 60,
		{0, 0, 0, 0, 0, 0, 0, 0},
		{1, 1, 1, 1, 1, 1, 1, 1},
	)
}

@(test)
one_tick_per_frame_despite_jitter :: proc(t: ^tt.T) {
	j :: 0.0004
	_expect_ticks_per_frame(
		t,
		1.0 / 60,
		1.0 / 60,
		{-j, j, -j, -j, j, j, 0, -j},
		{1, 1, 1, 1, 1, 1, 1, 1},
	)
}

@(test)
tick_on_every_second_frame_despite_jitter :: proc(t: ^tt.T) {
	j :: 0.0004
	_expect_ticks_per_frame(
		t,
		1.0 / 30,
		1.0 / 60,
		{0, -j, j, -j, -j, j, 0, j},
		{0, 1, 0, 1, 0, 1, 0, 1},
	)
}

@(test)
tick_on_every_second_frame_at_120_hz_despite_jitter :: proc(t: ^tt.T) {
	j :: 0.0004
	_expect_ticks_per_frame(
		t,
		1.0 / 60,
		1.0 / 120,
		{0, -j, j, -j, -j, j, 0, j},
		{0, 1, 0, 1, 0, 1, 0, 1},
	)
}

@(test)
no_drift_over_time :: proc(t: ^tt.T) {
	f :: 1.0 / 60
	j :: 0.0004
	accumulated_s := 0.0
	total_ticks := 0
	prev_offset_s := 0.0
	for i in 0 ..< 6000 {
		offset_s := i % 3 == 0 ? -j : j
		accumulated_s += f + offset_s - prev_offset_s
		prev_offset_s = offset_s
		ticks: int
		ticks, accumulated_s = internal.game_loop_ticks(
			accumulated_s,
			1.0 / 60,
			_MAX_TICKS,
		)
		total_ticks += ticks
	}
	tt.expect_value(t, total_ticks, 6000)
}

@(test)
no_tick_too_early :: proc(t: ^tt.T) {
	ticks, left_s := internal.game_loop_ticks(0.014, 1.0 / 60, _MAX_TICKS)
	tt.expect_value(t, ticks, 0)
	tt.expect_value(t, left_s, 0.014)
}

@(test)
backlog_over_max_ticks_is_dropped :: proc(t: ^tt.T) {
	ticks, left_s := internal.game_loop_ticks(1.0, 1.0 / 60, _MAX_TICKS)
	tt.expect_value(t, ticks, _MAX_TICKS)
	tt.expect_value(t, left_s, 0)
}

@(test)
backlog_within_max_ticks_is_kept :: proc(t: ^tt.T) {
	ticks, left_s := internal.game_loop_ticks(0.06, 1.0 / 60, _MAX_TICKS)
	tt.expect_value(t, ticks, 3)
	tt.expect(t, abs(left_s - (0.06 - 3.0 / 60)) < 1e-12)
}
