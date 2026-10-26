package beetpx_internal

camera_xy :: proc() -> [2]f64 {
	return _s.camera_xy
}

set_camera_xy :: proc(xy: [2]f64) {
	_s.camera_xy = xy
}
