// A stand-in for bpx: one state struct, `start` with a typed game state, and
// the "restart instead of reload" guard.
package fw

import "base:runtime"
import "core:fmt"
import "core:hash"
import "core:strings"

// True when the game is built as a hot-reloadable library.
HOT :: #config(FW_HOT, false)

State :: struct {
	frame_number: u32,
	game_state:   rawptr,
	game_size:    int,
	game_shape:   u64,
	started:      bool,
}

@(private)
_state: ^State

@(private)
_On_Callback :: proc(game_state: rawptr)
@(private)
_on_started, _on_update: _On_Callback

state_set :: proc(s: ^State) {
	_state = s
}

start :: proc($S: typeid, on_started: proc(s: ^S) = nil, on_update: proc(s: ^S) = nil) {
	_on_started = transmute(_On_Callback)on_started
	_on_update = transmute(_On_Callback)on_update

	shape := shape_hash(S)
	if _state.game_state != nil && _state.game_size == size_of(S) && _state.game_shape == shape {
		fmt.println("  fw: game state kept")
	} else {
		if _state.game_state != nil {
			fmt.println("  fw: game state changed, restarting")
			free(_state.game_state)
		}
		_state.game_state = new(S)
		_state.game_size = size_of(S)
		_state.game_shape = shape
		_state.started = false
	}

	when !HOT {
		for _ in 0 ..< 3 do advance()
	}
}

advance :: proc() {
	if !_state.started {
		_state.started = true
		if _on_started != nil do _on_started(_state.game_state)
	}
	if _on_update != nil do _on_update(_state.game_state)
	_state.frame_number += 1
}

frame_number :: proc() -> u32 {
	return _state.frame_number
}

// A hash of the type's field names, offsets, and types, recursively, but not
// through pointers. Unlike `typeid`, which is the same for any two types of
// the same name in the same package.
shape_hash :: proc($T: typeid) -> u64 {
	sb := strings.builder_make(context.temp_allocator)
	_write_shape(&sb, type_info_of(T))
	return hash.fnv64a(sb.buf[:])
}

@(private)
_write_shape :: proc(sb: ^strings.Builder, ti: ^runtime.Type_Info) {
	base := runtime.type_info_base(ti)
	#partial switch v in base.variant {
	case runtime.Type_Info_Struct:
		strings.write_string(sb, "struct{")
		for i in 0 ..< int(v.field_count) {
			fmt.sbprintf(sb, "%s@%d:", v.names[i], v.offsets[i])
			_write_shape(sb, v.types[i])
			strings.write_string(sb, ";")
		}
		strings.write_string(sb, "}")
	case runtime.Type_Info_Union:
		strings.write_string(sb, "union{")
		for t in v.variants {
			_write_shape(sb, t)
			strings.write_string(sb, ";")
		}
		strings.write_string(sb, "}")
	case runtime.Type_Info_Array:
		fmt.sbprintf(sb, "[%d]", v.count)
		_write_shape(sb, v.elem)
	case runtime.Type_Info_Enum:
		strings.write_string(sb, "enum{")
		for n, i in v.names do fmt.sbprintf(sb, "%s=%v;", n, v.values[i])
		strings.write_string(sb, "}")
	case:
		fmt.sbprint(sb, ti.id)
	}
}
