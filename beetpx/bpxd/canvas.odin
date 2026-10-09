package beetpx_bpxd

import "../bpx"

// A canvas to draw on instead of the real one, e.g. in tests.
@(private)
Fake_Canvas :: struct {
	pixels: [][4]u8,
	size  : bpx.Xy_Int,
}

// When set, drawing on this thread goes to it instead of the real canvas.
// Thread-local, so that tests, which run in parallel, do not share it.
@(private, thread_local)
fake_canvas: ^Fake_Canvas

// The pixels to draw on, row by row, as RGBA8, and the canvas size.
@(private)
canvas :: proc() -> (pixels: [][4]u8, size: bpx.Xy_Int) {
	if fake_canvas != nil do return fake_canvas.pixels, fake_canvas.size
	return bpx.canvas_rgba8(), bpx.canvas_size()
}
