// The long-lived host. Loads each library given as an argument in turn,
// keeping the framework state, and advances 3 frames after each load.
package host

import fw "../fw"
import "core:dynlib"
import "core:fmt"
import "core:os"

Api :: struct {
	runtime_started: proc() -> bool,
	load:            proc(fw_state: ^fw.State),
	advance:         proc(),
	lib:             dynlib.Library,
}

main :: proc() {
	unload_old := len(os.args) > 1 && os.args[1] == "--unload-old"
	paths := os.args[2:] if unload_old else os.args[1:]

	fw_state := new(fw.State)
	prev: Api
	for path in paths {
		fmt.println("host: loading", path)
		api: Api
		_, ok := dynlib.initialize_symbols(&api, path, "hot_", "lib")
		if !ok {
			fmt.eprintln("host: load failed:", dynlib.last_error())
			os.exit(1)
		}

		// The loader should run the library's Odin runtime startup (and so its
		// `@(init)` procs). Odin dev-2026-09 on Linux links it wrongly, so
		// call it by hand when it did not run.
		if !api.runtime_started() {
			fmt.println("host: runtime startup did not run, calling it")
			// On macOS, `dlsym` adds the leading `_` of C symbols itself.
			entry, found := dynlib.symbol_address(api.lib, "_odin_entry_point")
			assert(found)
			(cast(proc "c" ())entry)()
		}

		if unload_old && prev.lib != nil {
			dynlib.unload_library(prev.lib)
		}
		prev = api
		api.load(fw_state)
		for _ in 0 ..< 3 do api.advance()
	}
}
