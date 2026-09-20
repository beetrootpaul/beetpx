package beetpx_core

import "core:fmt"

@(private)
_print_low_level :: proc(message: string) {
	fmt.printfln("BeetPx WEB print_low_level: %s", message)
}

// Browser-only, deliberately without a macOS counterpart.
@(private)
_print_web_note :: proc() {
	fmt.printfln("BeetPx WEB__ONLY__ print_note")
}
