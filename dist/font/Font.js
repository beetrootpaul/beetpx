import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { v_, v_0_0_ } from "../shorthands";
import { u_ } from "../Utils";
export class BpxFont {
    
    arrangeGlyphsFor(text, textColor, colorMarkers) {
        colorMarkers ?? (colorMarkers = {});
        const arrangedGlyphs = [];
        let xy = v_0_0_;
        let lineNumber = 0;
        let prevKerningMap = {};
        for (let i = 0; i < text.length; i++) {
            const char = this.mapChar(text[i]);
            if (char === "\n") {
                prevKerningMap = {};
                xy = v_(0, xy.y + this.ascent + this.descent + this.lineGap);
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
            const kerning = prevKerningMap[char] ?? 0;
            const glyph = this.glyphs.get(char);
            if (!glyph) {
                continue;
            }
            const glyphColor = textColor;
            if (glyph.type === "sprite") {
                arrangedGlyphs.push({
                    type: "sprite",
                    char: char,
                    sprite: glyph.sprite,
                    spriteColorMapping: BpxSpriteColorMapping.of((sourceColor) => 
                    
                    this.isSpriteSheetTextColor(sourceColor) ? glyphColor : null),
                    lineNumber: lineNumber,
                    leftTop: xy
                        .add(0, this.ascent)
                        .sub(0, glyph.sprite.size.y)
                        .add(glyph.offset ?? v_0_0_)
                        .add(kerning, 0),
                });
                prevKerningMap = glyph.kerning ?? {};
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
                        .add(glyph.offset ?? v_0_0_)
                        .add(kerning, 0),
                });
                prevKerningMap = glyph.kerning ?? {};
                xy = xy.add(glyph.advance + kerning, 0);
                continue;
            }
            if (glyph.type === "whitespace") {
                prevKerningMap = glyph.kerning ?? {};
                xy = xy.add(glyph.advance + kerning, 0);
                continue;
            }
            u_.assertUnreachable(glyph);
        }
        return arrangedGlyphs;
    }
}
