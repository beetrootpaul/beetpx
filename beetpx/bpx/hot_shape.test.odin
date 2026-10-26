#+test
package beetpx_bpx

import tt "core:testing"

@(test)
hot_shape_hash_same_layout :: proc(t: ^tt.T) {
	A :: struct {
		x: int,
		y: f64,
	}
	B :: struct {
		x: int,
		y: f64,
	}
	tt.expect_value(
		t,
		_hot_shape_hash(type_info_of(A)),
		_hot_shape_hash(type_info_of(B)),
	)
}

@(test)
hot_shape_hash_changed_layout :: proc(t: ^tt.T) {
	A :: struct {
		x: int,
		y: f64,
	}
	Reordered :: struct {
		y: f64,
		x: int,
	}
	Renamed :: struct {
		x: int,
		z: f64,
	}
	Retyped :: struct {
		x: int,
		y: f32,
	}
	Extended :: struct {
		x: int,
		y: f64,
		z: bool,
	}
	a := _hot_shape_hash(type_info_of(A))
	tt.expect(t, a != _hot_shape_hash(type_info_of(Reordered)))
	tt.expect(t, a != _hot_shape_hash(type_info_of(Renamed)))
	tt.expect(t, a != _hot_shape_hash(type_info_of(Retyped)))
	tt.expect(t, a != _hot_shape_hash(type_info_of(Extended)))
}

@(test)
hot_shape_hash_changed_enum :: proc(t: ^tt.T) {
	A :: enum {
		X,
		Y,
	}
	Extended :: enum {
		X,
		Y,
		Z,
	}
	Reordered :: enum {
		Y,
		X,
	}
	a := _hot_shape_hash(type_info_of([2]A))
	tt.expect(t, a != _hot_shape_hash(type_info_of([2]Extended)))
	tt.expect(t, a != _hot_shape_hash(type_info_of([2]Reordered)))
}

@(test)
hot_find_not_plain_none :: proc(t: ^tt.T) {
	Inner :: struct {
		timer: Timer,
		flags: bit_set[Button],
	}
	Variant :: struct {
		xy: Xy,
	}
	State :: struct {
		inner  : Inner,
		items  : [4]Inner,
		by_btn : [Button]u8,
		variant: Maybe(Variant),
	}
	_, _, found := _hot_find_not_plain(type_info_of(State))
	tt.expect_value(t, found, false)
}

@(test)
hot_find_not_plain_nested :: proc(t: ^tt.T) {
	Inner :: struct {
		count: int,
		name : string,
	}
	State :: struct {
		xy   : Xy,
		items: [3]Inner,
	}
	path, type, found := _hot_find_not_plain(type_info_of(State))
	tt.expect_value(t, found, true)
	tt.expect_value(t, path, ".items[].name")
	tt.expect_value(t, type, string)
}

@(test)
hot_find_not_plain_kinds :: proc(t: ^tt.T) {
	Variant :: struct {
		ptr: ^int,
	}
	found: bool
	_, _, found = _hot_find_not_plain(type_info_of(struct {
			s: []int,
		}))
	tt.expect(t, found)
	_, _, found = _hot_find_not_plain(type_info_of(struct {
			d: [dynamic]int,
		}))
	tt.expect(t, found)
	_, _, found = _hot_find_not_plain(type_info_of(struct {
			m: map[int]int,
		}))
	tt.expect(t, found)
	_, _, found = _hot_find_not_plain(type_info_of(struct {
			p: proc(),
		}))
	tt.expect(t, found)
	_, _, found = _hot_find_not_plain(type_info_of(struct {
			u: Maybe(Variant),
		}))
	tt.expect(t, found)
}
