package beetpx_bpx

import "../internal"
import "core:fmt"
import "core:strings"

// TODO: Support sounds (`.wav`, `.flac`) and JSON (`.json`, `.ldtk`).

@(private)
_Assets_State :: struct {
	paths        : []string,
	loading_count: int,
	failed_count : int,
}

// TODO: Make sure the game starts even if there are no assets to load.

// TODO: De-duplicate the list of assets.

// Returns `false` if any of the paths does not look like a supported format.
@(private)
_assets_load :: proc(paths: []string) -> bool {
	unsupported_files_count := 0
	for path in paths {
		if !_is_image(path) {
			// TODO: Use a custom logger with a BeetPx prefix.
			fmt.eprintln("BeetPx: unsupported asset file extension in:", path)
			unsupported_files_count += 1
		}
	}
	if unsupported_files_count > 0 do return false

	_s.assets.paths = make([]string, len(paths))
	for path, i in paths {
		// The paths need to outlive the game start process, therefore we have
		// to clone them.
		_s.assets.paths[i] = strings.clone(path)
		_s.assets.loading_count += 1
	}

	for path in _s.assets.paths {
		_platform_load_asset(path)
	}

	return true
}

// TODO: Re-work the flow of the app in terms of consistency, e.g. where do we
//       decrement `_s.assets.loading_count` (in a helper or inline).

// TODO: Tests for failures.

@(private)
_assets_on_asset_loaded :: proc(path: string, bytes: []u8) {
	// TODO: What would happen if we didn't delete the bytes?
	defer delete(bytes)
	defer _s.assets.loading_count -= 1

	// TODO: Perform some switch over extensions to call tje proper proc here.
	if _is_image(path) {
		if !internal.image_decode_png(path, bytes) {
			_s.assets.failed_count += 1
		}
		// TODO: And what if it is NOT an image?
	}
}

@(private)
_assets_on_asset_load_failed :: proc(path: string) {
	_s.assets.loading_count -= 1
	_s.assets.failed_count += 1
}

@(private = "file")
_is_image :: proc(path: string) -> bool {
	supported_extension :: ".png"
	if len(path) < len(supported_extension) do return false
	return strings.equal_fold(
		path[len(path) - len(supported_extension):],
		supported_extension,
	)
}
