package beetpx_internal

CANVAS_WIDTH       :: _CANVAS_WIDTH
CANVAS_HEIGHT      :: _CANVAS_HEIGHT
canvas_fill        :: proc(color: Color_Rgb) {
	_canvas_fill(color)
}
canvas_set         :: proc(xy: Xy_Int, color: Color_Rgb) {
	_canvas_set(xy, color)
}
canvas_rgba8_bytes :: proc() -> []u8 {
	return _canvas_rgba8_bytes()
}

Color_Rgb :: _Color_Rgb

Xy       :: _Xy
Xy_Int   :: _Xy_Int
xy_round :: proc(xy: Xy) -> Xy_Int {
	return _xy_round(xy)
}
