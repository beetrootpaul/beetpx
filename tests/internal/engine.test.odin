package tests_internal

import "beetpx:internal"
import "core:slice"
import tt "core:testing"

// What the callbacks saw. Callbacks cannot capture variables, so they reach it
// through `context.user_ptr`.
@(private = "file")
_Recorder :: struct {
	engine                      : ^internal.Engine,
	frame_numbers_seen_in_update: [dynamic]u32,
	draws                       : int,
}

@(private = "file")
_record_update :: proc() {
	r := (^_Recorder)(context.user_ptr)
	append(
		&r.frame_numbers_seen_in_update,
		internal.engine_frame_number(r.engine),
	)
}

@(private = "file")
_record_draw :: proc() {
	r := (^_Recorder)(context.user_ptr)
	r.draws += 1
}

// Sets up an engine with recording callbacks. The caller still has to point
// `context.user_ptr` at `r`.
@(private = "file")
_setup :: proc(e: ^internal.Engine, r: ^_Recorder, tick_rate_hz: u8 = 30) {
	e.on_update = _record_update
	e.on_draw = _record_draw
	internal.engine_init(e, tick_rate_hz)
	r.engine = e
	r.frame_numbers_seen_in_update = make([dynamic]u32, context.temp_allocator)
}

@(test)
engine_draws_once_per_frame_also_without_ticks :: proc(t: ^tt.T) {
	e: internal.Engine
	r: _Recorder
	_setup(&e, &r)
	context.user_ptr = &r

	internal.engine_advance(&e, {delta_s = 0})
	internal.engine_advance(&e, {delta_s = 1.0 / 120})
	tt.expect_value(t, len(r.frame_numbers_seen_in_update), 0)
	tt.expect_value(t, r.draws, 2)

	internal.engine_advance(&e, {delta_s = 1.0 / 30})
	tt.expect_value(t, len(r.frame_numbers_seen_in_update), 1)
	tt.expect_value(t, r.draws, 3)
}

@(test)
engine_increments_the_frame_number_after_each_update :: proc(t: ^tt.T) {
	e: internal.Engine
	r: _Recorder
	_setup(&e, &r)
	context.user_ptr = &r

	internal.engine_advance(&e, {delta_s = 1.0 / 30})
	internal.engine_advance(&e, {delta_s = 2.0 / 30})

	tt.expectf(
		t,
		slice.equal(r.frame_numbers_seen_in_update[:], []u32{0, 1, 2}),
		"got %v",
		r.frame_numbers_seen_in_update,
	)
	tt.expect_value(t, internal.engine_frame_number(&e), 3)
	tt.expect_value(t, r.draws, 2)
}

@(test)
engine_caps_catchup_ticks_in_one_frame :: proc(t: ^tt.T) {
	e: internal.Engine
	r: _Recorder
	_setup(&e, &r, tick_rate_hz = 60)
	context.user_ptr = &r

	// A 1 s hitch owes 60 ticks, but only 5 run, and the rest is dropped.
	internal.engine_advance(&e, {delta_s = 1})
	internal.engine_advance(&e, {delta_s = 1.0 / 120})

	tt.expect_value(t, len(r.frame_numbers_seen_in_update), 5)
	tt.expect_value(t, internal.engine_frame_number(&e), 5)
	tt.expect_value(t, r.draws, 2)
}

@(test)
engine_runs_without_callbacks :: proc(t: ^tt.T) {
	e: internal.Engine
	internal.engine_init(&e, 30)

	internal.engine_advance(&e, {delta_s = 1.0 / 30})

	tt.expect_value(t, internal.engine_frame_number(&e), 1)
}
