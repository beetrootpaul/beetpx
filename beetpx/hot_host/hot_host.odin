#+build darwin, linux, windows
// The hot reload host: runs the desktop platform, and the game from a library
// which it reloads whenever the library file changes. The game's state is kept
// across reloads, whenever the new code can use it.
//
// Usage: `hot_host <path to the game library>`, where the library is the game
// built with `-build-mode:dll -define:BPX_HOT=true`.
package beetpx_hot_host

import "../internal"
import "../platform_sdl"
import "core:dynlib"
import "core:fmt"
import "core:os"
import "core:strings"
import "core:time"

// How often the library file is checked for changes.
@(private = "file")
_CHECK_INTERVAL :: 250 * time.Millisecond

// What the game library exports. See `bpx/platform_desktop.odin`.
@(private = "file")
_Lib :: struct {
	runtime_started: proc() -> bool,
	save           : proc() -> []u8,
	load           : proc(snapshot: []u8),
	game           : proc() -> internal.Platform_Game,
	__handle       : dynlib.Library,
}

@(private = "file")
_s: struct {
	lib_path    : string,
	lib_mod_time: time.Time,
	// How many times a library was loaded. Numbers the copies.
	loads       : int,
	lib         : _Lib,
	game        : internal.Platform_Game,
	last_check  : time.Tick,
}

main :: proc() {
	if len(os.args) != 2 {
		fmt.eprintfln("Usage: %v <path to the game library>", os.args[0])
		os.exit(1)
	}
	_s.lib_path = os.args[1]

	if !_load(nil) do os.exit(1)
	_s.last_check = time.tick_now()

	platform_sdl.run(
		{
			advance = _advance,
			canvas_size = proc() -> [2]int {
				return _s.game.canvas_size()
			},
			rgba8_bytes = proc() -> []u8 {
				return _s.game.rgba8_bytes()
			},
			key_down = proc(key: internal.Key) {
				_s.game.key_down(key)
			},
			key_up = proc(key: internal.Key) {
				_s.game.key_up(key)
			},
			all_keys_up = proc() {
				_s.game.all_keys_up()
			},
		},
	)
}

@(private = "file")
_advance :: proc(delta_s: f64) {
	if time.tick_since(_s.last_check) >= _CHECK_INTERVAL {
		_s.last_check = time.tick_now()
		_reload_if_changed()
	}
	_s.game.advance(delta_s)
}

@(private = "file")
_reload_if_changed :: proc() {
	// The file can be missing for a moment, while it is being rebuilt.
	mod_time, err := os.modification_time_by_path(_s.lib_path)
	if err != nil || mod_time == _s.lib_mod_time do return

	fmt.println("BeetPx: reloading", _s.lib_path)
	// If the load fails, the previous library keeps running.
	_load(_s.lib.save())
}

// Loads a copy of the library, since `dlopen` returns the already loaded
// library for the same path. Then lets it load the `snapshot` of the
// previous library's state.
//
// The previous libraries stay loaded, since the snapshot and the strings
// they printed may point into their memory.
@(private = "file")
_load :: proc(snapshot: []u8) -> bool {
	mod_time, err := os.modification_time_by_path(_s.lib_path)
	if err != nil {
		fmt.eprintln("BeetPx: cannot read", _s.lib_path, "-", err)
		return false
	}
	// Even if the load fails, it is not retried until the file changes again.
	_s.lib_mod_time = mod_time

	_s.loads += 1
	ext := os.ext(_s.lib_path)
	copy_path := fmt.aprintf(
		"%s_%d%s",
		strings.trim_suffix(_s.lib_path, ext),
		_s.loads,
		ext,
	)
	if copy_err := os.copy_file(copy_path, _s.lib_path); copy_err != nil {
		fmt.eprintln("BeetPx: cannot copy", _s.lib_path, "-", copy_err)
		return false
	}

	lib: _Lib
	if _, ok := dynlib.initialize_symbols(&lib, copy_path, "bpx_hot_"); !ok {
		fmt.eprintln("BeetPx: cannot load", copy_path, "-", dynlib.last_error())
		return false
	}

	// The loader should run the library's Odin runtime startup, and with it
	// the game's `main`. With Odin dev-2026-09 on Linux it does not, since
	// the library is linked with `-Wl,-init,'_odin_entry_point'`, quotes
	// included. So it is run here, when it did not run.
	if !lib.runtime_started() {
		entry, found := dynlib.symbol_address(lib.__handle, "_odin_entry_point")
		if !found {
			fmt.eprintln("BeetPx: no runtime startup in", copy_path)
			return false
		}
		(cast(proc "c" ())entry)()
	}

	lib.load(snapshot)
	_s.lib = lib
	_s.game = lib.game()
	return true
}
