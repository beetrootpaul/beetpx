package beetpx_bpxd

import "../bpx"

// TODO: Tests.

camera_xy :: proc() -> bpx.Xy {
	return _s.camera_xy
}

// TODO: Return prev?
set_camera_xy :: proc(xy: bpx.Xy) {
	_s.camera_xy = xy
}
