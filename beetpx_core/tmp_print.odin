package beetpx_core

import "core:fmt"

tmp_print :: proc(message: string) {
	_print_low_level(fmt.tprintf("BeetPx core tmp_print: %s", message))
	when ODIN_OS == .JS {
		_print_web_note()
	} else when ODIN_OS == .Darwin {
		_print_macos_note()
	}
}
