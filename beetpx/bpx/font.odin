package beetpx_bpx

// TODO: Port kerning, glyph offsets, color markers, and text scaling.

// A font definition, used by `bpxd.text` and `bpxd.text_measure`.
Font :: struct {
	// An amount of pixels from the baseline (included) to the top-most pixel
	// of font's glyphs.
	ascent  : int,
	// An amount of pixels from the baseline (excluded) to the bottom-most
	// pixel of font's glyphs.
	descent : int,
	// An amount of pixels between the bottom-most pixel of the previous line
	// (excluded) and the top-most pixel of the next line (excluded).
	line_gap: int,
	// Returns the glyph for a given char, or `nil` if the font has none. Chars
	// without a glyph are skipped when drawing.
	//
	// It is also a place to map chars before finding their glyphs, e.g. to
	// lower-case them in a font which has glyphs for lower-case chars only.
	glyph   : proc(char: rune) -> Glyph,
}

// A definition of a glyph used by a font.
Glyph :: union {
	Glyph_Sprite,
	Glyph_Whitespace,
}

Glyph_Sprite :: struct {
	// A sprite to be drawn for this glyph.
	sprite       : Sprite,
	// A proc used to distinguish text from its background on a sprite sheet.
	// Only the text pixels are drawn, in the color of the text.
	is_text_color: proc(color: Rgb) -> bool,
	// How much to move the text drawing cursor to the right after drawing this
	// glyph. Measured from the left edge of the glyph.
	advance      : int,
}

Glyph_Whitespace :: struct {
	// How much to move the text drawing cursor to the right after processing
	// this glyph. Measured from the left edge of the glyph.
	advance: int,
}
