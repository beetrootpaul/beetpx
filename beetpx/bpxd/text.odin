package beetpx_bpxd

import "../bpx"
import "../internal"
import "core:unicode/utf8"

// TODO: Tests.

@(private = "file")
_font: bpx.Font = bpx.font_pico8

// Sets the font used by `text` and `text_measure`. Returns the previous one.
//
// The PICO-8 font is used until this is called.
set_font :: proc(font: bpx.Font) -> (prev: bpx.Font) {
	prev = _font
	_font = font
	return prev
}

// Draws a text with its top-left corner at `xy`, in the current font (see
// `set_font`).
//
// Multiple lines can be achieved by including `\n` within the text. Chars
// without a glyph in the font are skipped.
text :: proc(text: string, xy: bpx.Xy, color: bpx.Rgb) {
	xy_min := bpx.u_round(xy)
	it := _Glyph_Iterator {
		text = text,
	}
	for glyph, glyph_xy_min in _glyph_iterate(&it) {
		_glyph_sprite(glyph, xy_min + glyph_xy_min, color)
	}
}

// Measures a text the way `text` would draw it, without drawing anything.
//
// Returns the size of the drawn text.
text_measure :: proc(text: string) -> (wh: bpx.Xy) {
	it := _Glyph_Iterator {
		text = text,
	}
	x_max := 0
	for glyph, glyph_xy_min in _glyph_iterate(&it) {
		x_max = max(x_max, glyph_xy_min.x + glyph.sprite.wh.x)
	}
	lines := it.line + 1
	return {
		f64(x_max),
		f64(
			lines * (_font.ascent + _font.descent) +
			(lines - 1) * _font.line_gap,
		),
	}
}

// Arranges the glyphs of a text one by one, relative to the top-left corner of
// the text. Whitespace glyphs only move the cursor, so they are not returned.
@(private = "file")
_Glyph_Iterator :: struct {
	text  : string,
	// The byte offset of the next char in `text`.
	offset: int,
	cursor: bpx.Xy_Int,
	line  : int,
}

@(private = "file")
_glyph_iterate :: proc(
	it: ^_Glyph_Iterator,
) -> (
	glyph: bpx.Glyph_Sprite,
	xy_min: bpx.Xy_Int,
	ok: bool,
) {
	for it.offset < len(it.text) {
		char, char_len := utf8.decode_rune_in_string(it.text[it.offset:])
		it.offset += char_len

		if char == '\n' {
			it.cursor = {
				0,
				it.cursor.y + _font.ascent + _font.descent + _font.line_gap,
			}
			it.line += 1
			continue
		}

		switch g in _font.glyph(char) {
		case bpx.Glyph_Whitespace:
			it.cursor.x += g.advance
		case bpx.Glyph_Sprite:
			// Glyphs are aligned to the baseline.
			xy_min = it.cursor + {0, _font.ascent - g.sprite.wh.y}
			it.cursor.x += g.advance
			return g, xy_min, true
		}
	}
	return {}, {}, false
}

// Draws the text pixels of a glyph's sprite in `color`.
@(private = "file")
_glyph_sprite :: proc(
	glyph: bpx.Glyph_Sprite,
	xy_min: bpx.Xy_Int,
	color: bpx.Rgb,
) {
	sprite := glyph.sprite
	if sprite.image == nil do return
	image := sprite.image^

	// The part of the sprite that lies within the image.
	x_min_incl := max(sprite.xy_min.x, 0)
	y_min_incl := max(sprite.xy_min.y, 0)
	x_max_excl := min(sprite.xy_min.x + sprite.wh.x, image.size.x)
	y_max_excl := min(sprite.xy_min.y + sprite.wh.y, image.size.y)

	image_to_canvas := xy_min - sprite.xy_min
	for y in y_min_incl ..< y_max_excl {
		for x in x_min_incl ..< x_max_excl {
			if !glyph.is_text_color(image.pixels[y * image.size.x + x]) {
				continue
			}
			internal.canvas_set(bpx.Xy_Int{x, y} + image_to_canvas, color)
		}
	}
}
