#+build darwin, linux, windows
package beetpx_bpx

import "../internal"
import "../platform_sdl"
import "core:fmt"

// Prevents an unused import error in a hot reload build, which does not run
// the platform.
_ :: platform_sdl

@(private)
_platform_start :: proc() {
	// In a hot reload build, the game is a library, and the hot reload host
	// runs the platform.
	when !_HOT {
		// TODO: Use a custom logger.
		fmt.printfln("BeetPx %v (%v) started.", BEETPX_VERSION, ODIN_OS)

		internal.canvas_fill({0, 0, 0})

		platform_sdl.run(_platform_game())
	}
}

// The game, as the platform sees it.
@(private)
_platform_game :: proc() -> internal.Platform_Game {
	return {
		advance = _game_loop_advance,
		canvas_size = internal.canvas_size,
		rgba8_bytes = internal.canvas_rgba8_bytes,
		key_down = proc(key: internal.Key) {
			_buttons_on_down(&_s.buttons, _button_for_key(key))
		},
		key_up = proc(key: internal.Key) {
			_buttons_on_up(&_s.buttons, _button_for_key(key))
		},
		all_keys_up = proc() {
			_buttons_on_all_up(&_s.buttons)
		},
	}
}

// TODO: Let players remap the keys.
@(private = "file")
_button_for_key :: proc(key: internal.Key) -> Button {
	switch key {
	case .Arrow_Left:
		return .Left
	case .Arrow_Right:
		return .Right
	case .Arrow_Up:
		return .Up
	case .Arrow_Down:
		return .Down
	}
	return {}
}

// What the hot reload host calls on the game library. See `hot_host`.
when _HOT {
	@(private = "file")
	_runtime_started: bool

	@(init)
	@(private = "file")
	_on_init :: proc "contextless" () {
		_runtime_started = true
	}

	// Whether the Odin runtime startup of the library has run, and with it
	// the game's `main`. If it has not, the host runs it.
	@(export)
	@(private = "file")
	bpx_hot_runtime_started :: proc() -> bool {
		return _runtime_started
	}

	@(export)
	@(private = "file")
	bpx_hot_save :: proc() -> []u8 {
		return _hot_save()
	}

	@(export)
	@(private = "file")
	bpx_hot_load :: proc(snapshot: []u8) {
		if len(snapshot) == 0 {
			// TODO: Use a custom logger.
			fmt.printfln(
				"BeetPx %v (%v, hot reload) started.",
				BEETPX_VERSION,
				ODIN_OS,
			)
		}
		if !_hot_load(snapshot) do internal.canvas_fill({0, 0, 0})
	}

	@(export)
	@(private = "file")
	bpx_hot_game :: proc() -> internal.Platform_Game {
		return _platform_game()
	}
}
