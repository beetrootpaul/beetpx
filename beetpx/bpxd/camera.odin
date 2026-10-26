package beetpx_bpxd

import "../bpx"
import "../internal"

// TODO: Tests.
camera_xy :: proc() -> bpx.Xy {
	return internal.camera_xy()
}

// TODO: Consider combining this with `camera_xy` and then calling `camera_xy` 
//       only returns, but `camera_xy(xy)` sets and returns.
// TODO: Return prev?
set_camera_xy :: proc(xy: bpx.Xy) {
	internal.set_camera_xy(xy)
}
