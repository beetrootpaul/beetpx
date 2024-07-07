import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { BpxVector2d } from "../misc/Vector2d";
import { assertUnreachable } from "../utils/assertUnreachable";
export class BpxFont {
    arrangeGlyphsFor(text, textColor, colorMarkers) {
        colorMarkers ??= {};
        const arrangedGlyphs = [];
        let xy = BpxVector2d.of(0, 0);
        let lineNumber = 0;
        let prevChar = "\n";
        for (let i = 0; i < text.length; i++) {
            const char = this.mapChar(text[i]);
            if (char === "\n") {
                prevChar = "\n";
                xy = BpxVector2d.of(0, xy.y + this.ascent + this.descent + this.lineGap);
                lineNumber += 1;
                continue;
            }
            if (char === "[") {
                let newColor;
                for (const [marker, markedColor] of Object.entries(colorMarkers)) {
                    const markerText = `[${marker}]`;
                    if (text.slice(i, i + markerText.length) === markerText) {
                        newColor = markedColor;
                        i += markerText.length - 1;
                        break;
                    }
                }
                if (newColor) {
                    textColor = newColor;
                    continue;
                }
            }
            const glyph = this.glyphs.get(char);
            if (!glyph) {
                continue;
            }
            const kerning = glyph.kerning?.[prevChar] ?? 0;
            const glyphColor = textColor;
            if (glyph.type === "sprite") {
                arrangedGlyphs.push({
                    type: "sprite",
                    char: char,
                    sprite: glyph.sprite,
                    spriteColorMapping: BpxSpriteColorMapping.of(sourceColor => this.isSpriteSheetTextColor(sourceColor) ? glyphColor : null),
                    lineNumber: lineNumber,
                    leftTop: xy
                        .add(0, this.ascent)
                        .sub(0, glyph.sprite.size.y)
                        .add(glyph.offset ?? BpxVector2d.of(0, 0))
                        .add(kerning, 0),
                });
                prevChar = char;
                xy = xy.add(glyph.advance + kerning, 0);
                continue;
            }
            if (glyph.type === "pixels") {
                arrangedGlyphs.push({
                    type: "pixels",
                    char: char,
                    pixels: glyph.pixels,
                    color: glyphColor,
                    lineNumber: lineNumber,
                    leftTop: xy
                        .add(0, this.ascent)
                        .sub(0, glyph.pixels.size.y)
                        .add(glyph.offset ?? BpxVector2d.of(0, 0))
                        .add(kerning, 0),
                });
                prevChar = char;
                xy = xy.add(glyph.advance + kerning, 0);
                continue;
            }
            if (glyph.type === "whitespace") {
                prevChar = char;
                xy = xy.add(glyph.advance + kerning, 0);
                continue;
            }
            assertUnreachable(glyph);
        }
        return arrangedGlyphs;
    }
}
