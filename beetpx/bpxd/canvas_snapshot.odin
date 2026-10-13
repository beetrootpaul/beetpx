#+vet explicit-allocators
package beetpx_bpxd

import "../bpx"
import "../internal"

// TODO: Tests.
// TODO: `canvas_snapshot_delete` has to get the same allocator as
//       `canvas_snapshot`, so the game has to remember which one it used.
//       Consider keeping the allocator in `Canvas_Snapshot` instead, like
//       `strings.Builder` does.

// A copy of the canvas pixels, row by row.
Canvas_Snapshot :: struct {
	size  : bpx.Xy_Int,
	pixels: []bpx.Rgb,
}

// Takes a snapshot of what is drawn on the canvas so far.
//
// Its pixels are allocated with `allocator`. Free them with
// `canvas_snapshot_delete` and the same allocator, unless the allocator frees
// them on its own, e.g. `context.temp_allocator`.
canvas_snapshot :: proc(allocator := context.allocator) -> Canvas_Snapshot {
	size := internal.canvas_size()
	pixels := make([]bpx.Rgb, size.x * size.y, allocator)
	for y in 0 ..< size.y {
		for x in 0 ..< size.x {
			pixels[y * size.x + x] = internal.canvas_get({x, y})
		}
	}
	return {size = size, pixels = pixels}
}

// Frees the pixels of a snapshot made by `canvas_snapshot`.
canvas_snapshot_delete :: proc(
	s: Canvas_Snapshot,
	allocator := context.allocator,
) {
	delete(s.pixels, allocator)
}

// The color of the snapshot pixel at `(x,y)`. Black outside of the snapshot.
canvas_snapshot_get :: proc(s: Canvas_Snapshot, xy: bpx.Xy_Int) -> bpx.Rgb {
	if xy.x < 0 || xy.x >= s.size.x do return {}
	if xy.y < 0 || xy.y >= s.size.y do return {}
	return s.pixels[xy.y * s.size.x + xy.x]
}
