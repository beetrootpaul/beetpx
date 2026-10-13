package beetpx_cli

import "core:fmt"
import "core:hash"
import "core:mem"
import "core:os"
import "core:slice"
import "core:strings"
import "core:time"

// Checks the game for every target. With `--watch`, re-runs the check every
// time an `.odin` file in the game or in BeetPx changes.
@(private)
_check :: proc(args: []string) -> bool {
	watch := false
	for arg in args {
		switch arg {
		case "--watch":
			watch = true
		case:
			_fail_with_usage(fmt.tprintf("Unknown argument: '%s'.", arg))
		}
	}

	if watch {
		return _check_watch()
	}

	if !_check_once() {
		return false
	}
	fmt.println("All checks passed.")
	return true
}

@(private = "file")
_check_once :: proc() -> bool {
	// Game's own packages, comma-separated. This way, we can limit the vetting
	// to the game itself, without vetting against BeetPx.
	game_packages := _game_packages()
	if len(game_packages) == 0 {
		fmt.eprintfln("No Odin packages found in '%s'.", _SRC_DIR)
		return false
	}
	game_packages_csv := strings.join(
		game_packages,
		",",
		context.temp_allocator,
	)

	for target in _TARGETS {
		fmt.printfln("Checking for '%s' ...", target)
		// `-thread-count:1` works around an intermittent segmentation
		// fault of the multithreaded checker, seen in Odin
		// [`dev-2026-09:a2fb372b7`](https://github.com/odin-lang/Odin/releases/tag/dev-2026-09),
		// about once in 20 runs.
		//
		// TODO: Remove the single-threading once the issue is fixed.
		ok := _exec({
			"odin",
			"check",
			_SRC_DIR,
			fmt.tprintf("-collection:beetpx=%s", _beetpx_dir()),
			"-disable-non-constant-globals",
			"-strict-style",
			fmt.tprintf("-strict-style-packages:%s", game_packages_csv),
			"-thread-count:1",
			"-vet",
			"-vet-cast",
			"-vet-tabs",
			fmt.tprintf("-vet-packages:%s", game_packages_csv),
			"-vet-using-param",
			"-vet-using-stmt",
			"-warnings-as-errors",
			fmt.tprintf("-target:%s", target),
		})
		if !ok {
			return false
		}
	}
	return true
}

// Re-runs the check every time an `.odin` file in the game or in BeetPx
// changes. It polls the files, so that it needs no extra tool and works the
// same on every OS.
//
// TODO: Consider removing BeetPx from the watched files.
@(private = "file")
_check_watch :: proc() -> bool {
	watched_dirs := [?]string {
		_SRC_DIR,
		strings.clone(_beetpx_dir(), context.allocator),
	}
	for {
		// Clears the terminal.
		fmt.print("\x1b[2J\x1b[H")
		if _check_once() {
			fmt.println("All checks passed.")
		}
		fmt.println("Waiting for changes ...")

		fingerprint := _odin_files_fingerprint(watched_dirs[:])
		free_all(context.temp_allocator)
		for {
			time.sleep(_WATCH_POLL_INTERVAL)
			changed := _odin_files_fingerprint(watched_dirs[:]) != fingerprint
			free_all(context.temp_allocator)
			if changed {
				break
			}
		}
	}
}

@(private = "file")
_WATCH_POLL_INTERVAL :: 300 * time.Millisecond

// A number that changes whenever an `.odin` file in the directories is added,
// removed, or modified.
@(private = "file")
_odin_files_fingerprint :: proc(dirs: []string) -> (fingerprint: u64) {
	for dir in dirs {
		walker := os.walker_create(dir)
		defer os.walker_destroy(&walker)
		for info in os.walker_walk(&walker) {
			if info.type != .Regular ||
			   !strings.has_suffix(info.name, ".odin") {
				continue
			}
			file_hash := hash.fnv64a(transmute([]byte)info.fullpath)
			stamp := [2]i64 {
				time.to_unix_nanoseconds(info.modification_time),
				info.size,
			}
			file_hash = hash.fnv64a(mem.ptr_to_bytes(&stamp), file_hash)
			// A sum does not depend on the order of the files.
			fingerprint += file_hash
		}
	}
	return
}

// Names of the packages in the game's code, sorted, without duplicates. Each
// one is read from the `package <name>` line of its `.odin` files.
@(private = "file")
_game_packages :: proc() -> []string {
	packages: [dynamic]string
	packages.allocator = context.temp_allocator

	walker := os.walker_create(_SRC_DIR)
	defer os.walker_destroy(&walker)
	for info in os.walker_walk(&walker) {
		if info.type != .Regular || !strings.has_suffix(info.name, ".odin") {
			continue
		}
		data, err := os.read_entire_file(info.fullpath, context.temp_allocator)
		if err != nil {
			continue
		}
		content := string(data)
		for line in strings.split_lines_iterator(&content) {
			words := strings.fields(line, context.temp_allocator)
			if len(words) >= 2 && words[0] == "package" {
				append(&packages, words[1])
				break
			}
		}
	}
	if path, err := os.walker_error(&walker); err != nil {
		fmt.eprintfln("Failed to read '%s': %v", path, err)
	}

	slice.sort(packages[:])
	return slice.unique(packages[:])
}
