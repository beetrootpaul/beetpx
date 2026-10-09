package beetpx_bpxd

import "../bpx"
import "core:slice"

// Sets every pixel of the canvas to a given color.
clear_canvas :: proc(color: bpx.Rgb) {
	slice.fill(bpx.canvas_rgba8(), [4]u8{color.r, color.g, color.b, 0xff})
}
