package beetpx_bpx

@(private)
_s := struct {
	tick_rate_hz : u8,
	tick_s       : f64,
	on_update    : On_Update,
	on_draw      : On_Draw,
	frame_number : u32,
	accumulated_s: f64,
	buttons      : _Buttons_State,
} {
	on_update = u_noop,
	on_draw   = u_noop,
}
