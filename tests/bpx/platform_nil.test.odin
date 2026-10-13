package tests_bpx

import "beetpx:bpx"
import "beetpx:bpxd"
import tt "core:testing"

// This test runs a game through the global state of `bpx`, so it would race
// with other such tests in this package. Add them with care, e.g. along with
// `-define:ODIN_TEST_THREADS=1`.

@(private = "file")
_updates: int
@(private = "file")
_draws: int

@(test)
nil_platform_runs_the_game_loop :: proc(t: ^tt.T) {
	bpx.set_on_update(proc() {
		_updates += 1
	})
	bpx.set_on_draw(proc() {
		_draws += 1
		bpxd.clear_canvas({0, 0, 0})
		bpxd.pixel(bpx.frame_number(), 0, bpx.Rgb{255, 0, 0})
	})
	bpx.start(canvas_size = .Square_64, tick_rate = .Hz_30)
	tick_s := 1.0 / f64(bpx.tick_rate())

	for _ in 0 ..< 10 {
		bpx.nil_platform_step(tick_s)
	}
	tt.expect_value(t, _updates, 10)
	tt.expect_value(t, _draws, 10)
	tt.expect_value(t, bpx.frame_number(), 10)

	// Less than a tick: draws, but does not update.
	bpx.nil_platform_step(tick_s / 2)
	tt.expect_value(t, _updates, 10)
	tt.expect_value(t, _draws, 11)

	// Several ticks: updates several times, but draws once.
	bpx.nil_platform_step(3 * tick_s)
	tt.expect_value(t, _updates, 13)
	tt.expect_value(t, _draws, 12)

	pixels := bpx.nil_platform_canvas_rgba8_bytes()
	tt.expect_value(t, len(pixels), 64 * 64 * 4)
	tt.expect_value(t, _rgb_at(pixels, 64, {12, 0}), bpx.Rgb{0, 0, 0})
	tt.expect_value(t, _rgb_at(pixels, 64, {13, 0}), bpx.Rgb{255, 0, 0})
	tt.expect_value(t, _rgb_at(pixels, 64, {14, 0}), bpx.Rgb{0, 0, 0})
}

@(private = "file")
_rgb_at :: proc(rgba8_bytes: []u8, width: int, xy: bpx.Xy_Int) -> bpx.Rgb {
	i := (xy.y * width + xy.x) * 4
	return {rgba8_bytes[i], rgba8_bytes[i + 1], rgba8_bytes[i + 2]}
}
