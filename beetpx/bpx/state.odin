package beetpx_bpx

@(private)
_s := struct {
	tick_rate_hz : u8,
	tick_s       : f64,
	on_tick      : On_Tick,
	on_draw      : On_Draw,
	tick_number  : u32,
	accumulated_s: f64,
	assets       : _Assets_State,
	buttons      : _Buttons_State,
} {
	on_tick = u_noop,
	on_draw = u_noop,
}
