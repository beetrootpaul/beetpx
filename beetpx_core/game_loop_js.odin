#+private file
package beetpx_core

// Called once per host animation frame by `odin.js``.
//
// See: https://github.com/odin-lang/Odin/blob/f1fd03364d5e45a987e1cd354188a3f018f45d1c/core/sys/wasm/js/odin.js#L2258-L2284
@(export)
step :: proc(delta_time: f64) -> bool {
	_game_loop_advance(delta_time)
	return true
}
