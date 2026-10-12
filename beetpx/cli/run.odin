package beetpx_cli

import "core:fmt"
import "core:os"
import "core:slice"

// Builds the game for a target and runs it. On the web, it builds the game
// into `./build/web/` and serves it at <http://127.0.0.1:8000> with Python's
// built-in HTTP server. On macOS, it builds the game into `./build/macos/` and
// opens it in a window.
@(private)
_run :: proc(args: []string) -> bool {
	if len(args) != 1 {
		_fail_with_usage("Expected exactly one target.")
	}
	target := args[0]
	targets := _TARGETS
	if !slice.contains(targets[:], target) {
		_fail_with_usage(fmt.tprintf("Unsupported target: '%s'.", target))
	}

	collection_flag := fmt.tprintf("-collection:beetpx=%s", _beetpx_dir())
	target_flag := fmt.tprintf("-target:%s", target)

	switch target {
	case "darwin_arm64":
		out_dir :: "./build/macos/"
		_recreate_dir(out_dir) or_return

		return _exec({
			"odin",
			"run",
			_SRC_DIR,
			collection_flag,
			"-disable-non-constant-globals",
			target_flag,
			"-out:" + out_dir + _GAME_NAME,
		})
	case "js_wasm32":
		out_dir :: "./build/web/"
		_recreate_dir(out_dir) or_return

		_exec({
			"odin",
			"build",
			_SRC_DIR,
			collection_flag,
			"-disable-non-constant-globals",
			target_flag,
			"-out:" + out_dir + _GAME_NAME + ".wasm",
		}) or_return
		_copy_file(
			out_dir + "odin.js",
			ODIN_ROOT + "core/sys/wasm/js/odin.js",
		) or_return
		_copy_file(
			out_dir + "beetpx.js",
			fmt.tprintf("%s/beetpx.js", _beetpx_dir()),
		) or_return
		_copy_file(out_dir + "index.html", "./index.html") or_return

		fmt.printfln("Serving %s at http://127.0.0.1:8000 ...", out_dir)
		// TODO: Make it no longer require python3 (Odin 1.0 is supposed to
		//       include HTTP server). Make sure it is cross-platform.
		return _exec({
			"python3",
			"-m",
			"http.server",
			"8000",
			"--bind",
			"127.0.0.1",
			"--directory",
			out_dir,
		})
	}
	return false
}

@(private = "file")
_recreate_dir :: proc(dir: string) -> bool {
	if err := os.remove_all(dir); err != nil && err != .Not_Exist {
		fmt.eprintfln("Failed to remove '%s': %v", dir, err)
		return false
	}
	if err := os.make_directory_all(dir); err != nil {
		fmt.eprintfln("Failed to create '%s': %v", dir, err)
		return false
	}
	return true
}

@(private = "file")
_copy_file :: proc(dst, src: string) -> bool {
	if err := os.copy_file(dst, src); err != nil {
		fmt.eprintfln("Failed to copy '%s' to '%s': %v", src, dst, err)
		return false
	}
	return true
}
