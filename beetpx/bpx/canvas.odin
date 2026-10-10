package beetpx_bpx

import "../internal"

// The size of the game drawing canvas, in logical pixels.
Canvas_Size_Preset :: enum {
	Square_64,
	Square_128,
	Square_256,
}

// TODO: Use it in some example.

canvas_size :: proc() -> Xy_Int {
	return internal.canvas_size()
}

@(private)
_canvas_size_preset_as_px :: proc(preset: Canvas_Size_Preset) -> Xy_Int {
	switch preset {
	case .Square_256:
		return {256, 256}
	case .Square_128:
		return {128, 128}
	case .Square_64:
		fallthrough
	case:
		// TODO: Consider `panic` here.
		return {64, 64}
	}
}
