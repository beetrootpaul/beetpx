package beetpx_bpxd

import "../bpx"
import "core:slice"

// Sets every pixel of the canvas to a given color.
clear_canvas :: proc(color: bpx.Rgb) {
	pixels, _ := canvas()
	slice.fill(pixels, [4]u8{color.r, color.g, color.b, 0xff})
}
