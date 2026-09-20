package main

import bpx "../../beetpx_core"
import "core:fmt"

main :: proc() {
	fmt.println("printed directly from the example code")
	bpx.tmp_print("printed from the example code, through bpx.tmp_print")
}
