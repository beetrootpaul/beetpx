package beetpx_bpx

import "../internal"
import "core:fmt"
import "core:mem"

// Whether the game is built for hot reload: as a library for the hot reload
// host on desktop, or as a module which the page swaps on the web.
@(private)
_HOT :: #config(BPX_HOT, false)

// A snapshot is this header, then `_s`, `internal.State`, and the game's
// state, each at an offset aligned for it.
@(private = "file")
_Hot_Header :: struct {
	engine_shape: u64,
	game_shape  : u64,
}

@(private = "file")
_Hot_Offsets :: struct {
	bpx, internal, game, end: int,
}

// Reused by every `_hot_save`.
@(private = "file")
_hot_snapshot: [dynamic]u8

// Saves the state of BeetPx and of the game, so that the next code can load it
// after hot reload.
//
// The bytes are valid until the next call.
@(private)
_hot_save :: proc() -> []u8 {
	offsets := _hot_offsets()
	resize(&_hot_snapshot, offsets.end)

	header := _Hot_Header {
		engine_shape = _hot_engine_shape(),
		game_shape   = _hot_shape_hash(type_info_of(_game_state.type)),
	}
	mem.copy(&_hot_snapshot[0], &header, size_of(header))
	mem.copy(&_hot_snapshot[offsets.bpx], &_s, size_of(_s))
	mem.copy(
		&_hot_snapshot[offsets.internal],
		internal.state(),
		size_of(internal.State),
	)
	mem.copy(
		&_hot_snapshot[offsets.game],
		_game_state.ptr,
		offsets.end - offsets.game,
	)

	return _hot_snapshot[:]
}

// Loads the state saved by the previous code, if this code can use it. If it
// cannot, e.g. because the type of the game's state changed, the game starts
// from scratch, and the reason is printed. An empty `snapshot` means the first
// load.
//
// Has to be called after `start`, before the first host frame. Returns whether
// the state was loaded.
@(private)
_hot_load :: proc(snapshot: []u8) -> (loaded: bool) {
	if len(snapshot) == 0 {
		// Warns early that the state will not survive.
		if reason, ok := _hot_game_state_not_plain(); ok {
			fmt.println("BeetPx: hot reload will restart the game:", reason)
		}
		return false
	}

	if reason, ok := _hot_restart_reason(snapshot); ok {
		fmt.println("BeetPx: hot reload restarted the game:", reason)
		return false
	}

	offsets := _hot_offsets()
	mem.copy(&_s, &snapshot[offsets.bpx], size_of(_s))
	mem.copy(
		internal.state(),
		&snapshot[offsets.internal],
		size_of(internal.State),
	)
	mem.copy(
		_game_state.ptr,
		&snapshot[offsets.game],
		offsets.end - offsets.game,
	)
	fmt.println("BeetPx: hot reload kept the game state.")
	return true
}

@(private = "file")
_hot_restart_reason :: proc(snapshot: []u8) -> (reason: string, ok: bool) {
	if not_plain, found := _hot_game_state_not_plain(); found {
		return not_plain, true
	}

	offsets := _hot_offsets()
	if len(snapshot) < size_of(_Hot_Header) {
		return "the snapshot is broken.", true
	}
	header: _Hot_Header
	mem.copy(&header, &snapshot[0], size_of(header))
	if header.engine_shape != _hot_engine_shape() {
		return "the state of BeetPx changed.", true
	}
	game_shape := _hot_shape_hash(type_info_of(_game_state.type))
	if header.game_shape != game_shape {
		return "the type of the game state changed.", true
	}
	if len(snapshot) != offsets.end {
		return "the snapshot is broken.", true
	}

	prev_s: type_of(_s)
	mem.copy(&prev_s, &snapshot[offsets.bpx], size_of(_s))
	if prev_s.tick_rate_hz != _s.tick_rate_hz {
		return "the tick rate changed.", true
	}
	prev_canvas_size: [2]int
	mem.copy(
		&prev_canvas_size,
		&snapshot[offsets.internal + int(offset_of(internal.State, size_px))],
		size_of(prev_canvas_size),
	)
	if prev_canvas_size != internal.canvas_size() {
		return "the canvas size changed.", true
	}

	return "", false
}

@(private = "file")
_hot_game_state_not_plain :: proc() -> (reason: string, ok: bool) {
	path, type := _hot_find_not_plain(
		type_info_of(_game_state.type),
	) or_return
	return fmt.tprintf(
			"the game state is not plain data: `%v%s` is a `%v`.",
			_game_state.type,
			path,
			type,
		),
		true
}

@(private = "file")
_hot_engine_shape :: proc() -> u64 {
	return _hot_shape_hash(
		type_info_of(struct {
				bpx     : type_of(_s),
				internal: internal.State,
			}),
	)
}

@(private = "file")
_hot_offsets :: proc() -> (offsets: _Hot_Offsets) {
	game_ti := type_info_of(_game_state.type)
	offsets.bpx = mem.align_forward_int(size_of(_Hot_Header), align_of(_s))
	offsets.internal = mem.align_forward_int(
		offsets.bpx + size_of(_s),
		align_of(internal.State),
	)
	offsets.game = mem.align_forward_int(
		offsets.internal + size_of(internal.State),
		game_ti.align,
	)
	offsets.end = offsets.game + game_ti.size
	return offsets
}
