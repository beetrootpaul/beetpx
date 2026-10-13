package beetpx_bpx

import "base:runtime"
import "core:unicode"

// A font created by zep for the PICO-8 fantasy console and free to use under
// CC0. It has glyphs for lower-case letters only, so upper-case ones are drawn
// as lower-case.
//
// Besides ASCII chars, it has glyphs for: ⬅ ➡ ⬆ ⬇ ⭐ ❤ ❎ ⭕ ♪
//
// - License: https://www.lexaloffle.com/pico-8.php?page=faq
font_pico8 :: Font {
	ascent   = 5,
	descent  = 0,
	line_gap = 1,
	glyph    = _pico8_glyph,
}

@(private = "file")
_pico8_image: Image

// Decoded once, before the game starts, so that drawing text never allocates.
@(init)
@(private = "file")
_pico8_image_init :: proc "contextless" () {
	context = runtime.default_context()
	_pico8_image = image_from_png(#load("font_pico8.png"))
}

@(private = "file")
_pico8_glyph :: proc(char: rune) -> Glyph {
	switch unicode.to_lower(char) {
	case ' ':
		return Glyph_Whitespace{advance = 4}
	case '0':
		return _pico8_glyph_sprite({0, 3})
	case '1':
		return _pico8_glyph_sprite({1, 3})
	case '2':
		return _pico8_glyph_sprite({2, 3})
	case '3':
		return _pico8_glyph_sprite({3, 3})
	case '4':
		return _pico8_glyph_sprite({4, 3})
	case '5':
		return _pico8_glyph_sprite({5, 3})
	case '6':
		return _pico8_glyph_sprite({6, 3})
	case '7':
		return _pico8_glyph_sprite({7, 3})
	case '8':
		return _pico8_glyph_sprite({8, 3})
	case '9':
		return _pico8_glyph_sprite({9, 3})
	case '-':
		return _pico8_glyph_sprite({13, 2})
	case '+':
		return _pico8_glyph_sprite({11, 2})
	case '=':
		return _pico8_glyph_sprite({13, 3})
	case '(':
		return _pico8_glyph_sprite({8, 2})
	case ')':
		return _pico8_glyph_sprite({9, 2})
	case '[':
		return _pico8_glyph_sprite({11, 5})
	case ']':
		return _pico8_glyph_sprite({13, 5})
	case '{':
		return _pico8_glyph_sprite({11, 7})
	case '}':
		return _pico8_glyph_sprite({13, 7})
	case '<':
		return _pico8_glyph_sprite({12, 3})
	case '>':
		return _pico8_glyph_sprite({14, 3})
	case '~':
		return _pico8_glyph_sprite({14, 7})
	case '!':
		return _pico8_glyph_sprite({1, 2})
	case '?':
		return _pico8_glyph_sprite({15, 3})
	case '@':
		return _pico8_glyph_sprite({0, 4})
	case '#':
		return _pico8_glyph_sprite({3, 2})
	case '$':
		return _pico8_glyph_sprite({4, 2})
	case '%':
		return _pico8_glyph_sprite({5, 2})
	case '^':
		return _pico8_glyph_sprite({14, 5})
	case '&':
		return _pico8_glyph_sprite({6, 2})
	case '*':
		return _pico8_glyph_sprite({10, 2})
	case '_':
		return _pico8_glyph_sprite({15, 5})
	case '.':
		return _pico8_glyph_sprite({14, 2})
	case ',':
		return _pico8_glyph_sprite({12, 2})
	case ':':
		return _pico8_glyph_sprite({10, 3})
	case ';':
		return _pico8_glyph_sprite({11, 3})
	case '`':
		return _pico8_glyph_sprite({0, 6})
	case '\'':
		return _pico8_glyph_sprite({7, 2})
	case '"':
		return _pico8_glyph_sprite({2, 2})
	case '/':
		return _pico8_glyph_sprite({15, 2})
	case '|':
		return _pico8_glyph_sprite({12, 7})
	case '\\':
		return _pico8_glyph_sprite({12, 5})
	case 'a':
		return _pico8_glyph_sprite({1, 6})
	case 'b':
		return _pico8_glyph_sprite({2, 6})
	case 'c':
		return _pico8_glyph_sprite({3, 6})
	case 'd':
		return _pico8_glyph_sprite({4, 6})
	case 'e':
		return _pico8_glyph_sprite({5, 6})
	case 'f':
		return _pico8_glyph_sprite({6, 6})
	case 'g':
		return _pico8_glyph_sprite({7, 6})
	case 'h':
		return _pico8_glyph_sprite({8, 6})
	case 'i':
		return _pico8_glyph_sprite({9, 6})
	case 'j':
		return _pico8_glyph_sprite({10, 6})
	case 'k':
		return _pico8_glyph_sprite({11, 6})
	case 'l':
		return _pico8_glyph_sprite({12, 6})
	case 'm':
		return _pico8_glyph_sprite({13, 6})
	case 'n':
		return _pico8_glyph_sprite({14, 6})
	case 'o':
		return _pico8_glyph_sprite({15, 6})
	case 'p':
		return _pico8_glyph_sprite({0, 7})
	case 'q':
		return _pico8_glyph_sprite({1, 7})
	case 'r':
		return _pico8_glyph_sprite({2, 7})
	case 's':
		return _pico8_glyph_sprite({3, 7})
	case 't':
		return _pico8_glyph_sprite({4, 7})
	case 'u':
		return _pico8_glyph_sprite({5, 7})
	case 'v':
		return _pico8_glyph_sprite({6, 7})
	case 'w':
		return _pico8_glyph_sprite({7, 7})
	case 'x':
		return _pico8_glyph_sprite({8, 7})
	case 'y':
		return _pico8_glyph_sprite({9, 7})
	case 'z':
		return _pico8_glyph_sprite({10, 7})
	case '⬅':
		return _pico8_glyph_sprite({11, 8}, w = 7)
	case '➡':
		return _pico8_glyph_sprite({1, 9}, w = 7)
	case '⬆':
		return _pico8_glyph_sprite({4, 9}, w = 7)
	case '⬇':
		return _pico8_glyph_sprite({3, 8}, w = 7)
	case '⭐':
		return _pico8_glyph_sprite({2, 9}, w = 7)
	case '❤':
		return _pico8_glyph_sprite({7, 8}, w = 7)
	case '❎':
		return _pico8_glyph_sprite({7, 9}, w = 7)
	case '⭕':
		return _pico8_glyph_sprite({14, 8}, w = 7)
	case '♪':
		return _pico8_glyph_sprite({13, 8}, w = 7)
	}
	return nil
}

// Makes a sprite glyph out of the 8x8 tile at `tile_xy` on the sprite sheet.
@(private = "file")
_pico8_glyph_sprite :: proc(tile_xy: Xy, w: f64 = 3) -> Glyph {
	return Glyph_Sprite {
		sprite = sprite_make(&_pico8_image, tile_xy * 8, {w, 5}),
		is_text_color = proc(color: Rgb) -> bool {
			return color == p_pico8_white
		},
		advance = int(w) + 1,
	}
}
