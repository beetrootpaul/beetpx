package beetpx_bpx

import "core:slice"

// The pixel art of the game icon, row by row. `nil` is a transparent pixel.
//
// TODO: Allow other sizes than 16x16 px?
Icon :: [16][16]Maybe(Rgb)

@(private)
_ICON_SIZE_PX :: len(Icon)

// The icon in use, as RGBA8, row by row.
@(private = "file")
_icon_rgba8: [_ICON_SIZE_PX * _ICON_SIZE_PX][4]u8

@(private = "file")
_icon_is_set: bool

// Sets the icon of the game window on desktop, or of the browser tab on the
// web. Without it, the game has the BeetPx logo as its icon.
//
// Can be called both before and after `start`.
set_icon :: proc(icon: Icon) {
	_store_icon(icon)
	_platform_set_icon(_icon_rgba8_bytes())
}

// Returns the RGBA8 bytes of the icon in use, of size `_ICON_SIZE_PX` by
// `_ICON_SIZE_PX`.
@(private)
_icon_rgba8_bytes :: proc() -> []u8 {
	if !_icon_is_set {
		_store_icon(_beetpx_logo_icon())
	}
	return slice.to_bytes(_icon_rgba8[:])
}

@(private = "file")
_store_icon :: proc(icon: Icon) {
	for row, y in icon {
		for pixel, x in row {
			rgb, is_opaque := pixel.?
			_icon_rgba8[y * _ICON_SIZE_PX + x] =
				is_opaque ? {rgb.r, rgb.g, rgb.b, 0xff} : {0, 0, 0, 0}
		}
	}
	_icon_is_set = true
}

// The BeetPx logo. Like the BeetPx name, it is not covered by the zlib
// license (see `README.md`).
@(private = "file")
_beetpx_logo_icon :: proc() -> (icon: Icon) {
	rows := [_ICON_SIZE_PX]string {
		"############.#.#",
		"#..............#",
		"#..............#",
		"#.........###..#",
		"#....###.#..#..#",
		"#...###.#..#.#.#",
		"#..####.#.#..#.#",
		"#.########.##..#",
		"#...#.###...#..#",
		"#....###.#...#.#",
		"#.........###..#",
		"#.###.#.#......#",
		"#.###..#.......#",
		"#.#...#.#......#",
		"#..............#",
		"################",
	}
	for row, y in rows {
		for char, x in row {
			icon[y][x] = char == '#' ? Rgb{255, 110, 89} : Rgb{18, 83, 89}
		}
	}
	return
}
