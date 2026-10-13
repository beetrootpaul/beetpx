package beetpx_bpx

import "../internal"
import "core:sync"

// Outside test builds, nothing below uses these imports.
_ :: internal
_ :: sync

// Whether to include the helpers below. True in test builds. `odin check`
// does not set `ODIN_TEST`, so the scripts set this instead when they check
// tests.
@(private)
_TESTING :: #config(BEETPX_TESTING, ODIN_TEST)

// Helpers for tests which run a whole game, without any platform. They exist
// only in test builds.

when _TESTING {
	@(private = "file")
	_test_mutex: sync.Mutex

	// Lets the calling test use the game state, which is global, and resets
	// it. Other tests which call it wait until the end of the caller's scope.
	//
	// Call it before setting callbacks and calling `start`.
	@(deferred_none = _test_scope_end)
	test_scope :: proc() {
		sync.mutex_lock(&_test_mutex)
		_engine = {}
	}

	@(private = "file")
	_test_scope_end :: proc() {
		sync.mutex_unlock(&_test_mutex)
	}

	Frame_Input :: internal.Frame_Input

	// Runs one host frame, like a platform does, but renders nothing.
	test_advance :: proc(fi: Frame_Input) {
		internal.engine_advance(&_engine, fi)
	}

	// Returns the canvas pixels, row by row, as RGBA8.
	test_canvas_rgba8_bytes :: proc() -> []u8 {
		return internal.canvas_rgba8_bytes()
	}
}
