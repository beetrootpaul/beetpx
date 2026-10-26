package beetpx_bpx

// The state of `bpx`. It holds only data, so that it can be copied over to
// new code on hot reload. That is why the callbacks are kept elsewhere.
@(private)
_s: struct {
	tick_rate_hz : u8,
	tick_s       : f64,
	tick_number  : u32,
	accumulated_s: f64,
	buttons      : _Buttons_State,
	// Whether `on_started` has run already.
	started      : bool,
}
