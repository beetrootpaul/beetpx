package beetpx_bpx

import "base:runtime"
import "core:fmt"
import "core:hash"
import "core:strings"

// A hash of a type's layout: its size, and recursively the names, offsets, and
// types of its fields, the members of its enums, and so on. It changes with
// any change of the layout, so it tells whether a value saved by old code can
// be read by new code after hot reload.
//
// `typeid` cannot tell it: it stays the same for any two types of the same
// name in the same package.
@(private)
_hot_shape_hash :: proc(ti: ^runtime.Type_Info) -> u64 {
	sb := strings.builder_make(context.temp_allocator)
	_write_shape(&sb, ti)
	return hash.fnv64a(sb.buf[:])
}

@(private = "file")
_write_shape :: proc(sb: ^strings.Builder, ti: ^runtime.Type_Info) {
	base := runtime.type_info_base(ti)
	fmt.sbprintf(sb, "%d/%d:", base.size, base.align)
	#partial switch v in base.variant {
	case runtime.Type_Info_Struct:
		fmt.sbprintf(sb, "struct%v{{", v.flags)
		for i in 0 ..< int(v.field_count) {
			fmt.sbprintf(sb, "%s@%d:", v.names[i], v.offsets[i])
			_write_shape(sb, v.types[i])
			strings.write_byte(sb, ';')
		}
		strings.write_byte(sb, '}')
	case runtime.Type_Info_Union:
		fmt.sbprintf(sb, "union@%d{{", v.tag_offset)
		for variant in v.variants {
			_write_shape(sb, variant)
			strings.write_byte(sb, ';')
		}
		strings.write_byte(sb, '}')
	case runtime.Type_Info_Array:
		fmt.sbprintf(sb, "[%d]", v.count)
		_write_shape(sb, v.elem)
	case runtime.Type_Info_Enumerated_Array:
		strings.write_byte(sb, '[')
		_write_shape(sb, v.index)
		strings.write_byte(sb, ']')
		_write_shape(sb, v.elem)
	case runtime.Type_Info_Fixed_Capacity_Dynamic_Array:
		fmt.sbprintf(sb, "[dynamic;%d]", v.capacity)
		_write_shape(sb, v.elem)
	case runtime.Type_Info_Enum:
		strings.write_string(sb, "enum{")
		for name, i in v.names {
			fmt.sbprintf(sb, "%s=%v;", name, v.values[i])
		}
		strings.write_byte(sb, '}')
	case runtime.Type_Info_Bit_Set:
		fmt.sbprintf(sb, "bit_set[%d..%d;", v.lower, v.upper)
		_write_shape(sb, v.elem)
		strings.write_byte(sb, ']')
	case runtime.Type_Info_Bit_Field:
		strings.write_string(sb, "bit_field{")
		for i in 0 ..< v.field_count {
			fmt.sbprintf(
				sb,
				"%s@%d/%d:",
				v.names[i],
				v.bit_offsets[i],
				v.bit_sizes[i],
			)
			_write_shape(sb, v.types[i])
			strings.write_byte(sb, ';')
		}
		strings.write_byte(sb, '}')
	case:
		fmt.sbprint(sb, base.id)
	}
}

// Finds the first part of a type that is not plain data, e.g. a pointer,
// a string, a slice, or a proc. After hot reload, such a part would point into
// the memory of the old code, so a value of this type cannot be kept.
//
// Returns the path to that part, e.g. `.player.name`, and its type.
@(private)
_hot_find_not_plain :: proc(
	ti: ^runtime.Type_Info,
	path := "",
) -> (
	not_plain_path: string,
	not_plain_type: typeid,
	found: bool,
) {
	base := runtime.type_info_base(ti)
	#partial switch v in base.variant {
	case runtime.Type_Info_Integer,
	     runtime.Type_Info_Rune,
	     runtime.Type_Info_Float,
	     runtime.Type_Info_Complex,
	     runtime.Type_Info_Quaternion,
	     runtime.Type_Info_Boolean,
	     runtime.Type_Info_Enum,
	     runtime.Type_Info_Bit_Set,
	     runtime.Type_Info_Bit_Field:
		return "", nil, false
	case runtime.Type_Info_Struct:
		for i in 0 ..< int(v.field_count) {
			field_path := fmt.tprintf("%s.%s", path, v.names[i])
			p, t, f := _hot_find_not_plain(v.types[i], field_path)
			if f do return p, t, f
		}
		return "", nil, false
	case runtime.Type_Info_Union:
		for variant in v.variants {
			variant_path := fmt.tprintf("%s.(%v)", path, variant.id)
			p, t, f := _hot_find_not_plain(variant, variant_path)
			if f do return p, t, f
		}
		return "", nil, false
	case runtime.Type_Info_Array:
		return _hot_find_not_plain(v.elem, fmt.tprintf("%s[]", path))
	case runtime.Type_Info_Enumerated_Array:
		return _hot_find_not_plain(v.elem, fmt.tprintf("%s[]", path))
	case runtime.Type_Info_Fixed_Capacity_Dynamic_Array:
		return _hot_find_not_plain(v.elem, fmt.tprintf("%s[]", path))
	case runtime.Type_Info_Simd_Vector:
		return _hot_find_not_plain(v.elem, fmt.tprintf("%s[]", path))
	case runtime.Type_Info_Matrix:
		return _hot_find_not_plain(v.elem, fmt.tprintf("%s[]", path))
	}
	return path, ti.id, true
}
