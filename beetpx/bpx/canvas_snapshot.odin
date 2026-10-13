package beetpx_bpx

// Maps a color of the canvas snapshot at `xy` into a new one. Returning
// `false` leaves the pixel at `xy` as it is.
//
// See `bpxd.take_canvas_snapshot`.
Canvas_Snapshot_Color_Mapping :: #type proc(
	snapshot_color: Rgb,
	xy: Xy_Int,
) -> (
	mapped: Rgb,
	ok: bool,
)
