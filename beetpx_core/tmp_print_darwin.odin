package beetpx_core

import "core:fmt"

@(private)
_print_low_level :: proc(message: string) {
	fmt.printfln("BeetPx DARWIN print_low_level: %s", message)
}

@(private)
_print_macos_note :: proc() {
	fmt.printfln("BeetPx DARWIN__ONLY__ print_note")
}
