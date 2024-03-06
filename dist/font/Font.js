import { v_, v_0_0_ } from "../shorthands";
import { u_ } from "../Utils";
export class BpxFont {
    
    arrangeGlyphsFor(text) {
        const arrangedGlyphs = [];
        let xy = v_0_0_;
        let lineNumber = 0;
        let prevKerningMap = {};
        for (let char of text) {
            char = this.mapChar(char);
            if (char === "\n") {
                prevKerningMap = {};
                xy = v_(0, xy.y + this.ascent + this.descent + this.lineGap);
                lineNumber += 1;
            }
            else {
                const kerning = prevKerningMap[char] ?? 0;
                const glyph = this.glyphs.get(char);
                if (!glyph) {
                    
                }
                else if (glyph.type === "sprite") {
                    arrangedGlyphs.push({
                        type: "sprite",
                        char: char,
                        sprite: glyph.sprite,
                        lineNumber: lineNumber,
                        leftTop: xy
                            .add(0, this.ascent)
                            .sub(0, glyph.sprite.size.y)
                            .add(glyph.offset ?? v_0_0_)
                            .add(kerning, 0),
                    });
                    prevKerningMap = glyph.kerning ?? {};
                    xy = xy.add(glyph.advance + kerning, 0);
                }
                else if (glyph.type === "pixels") {
                    arrangedGlyphs.push({
                        type: "pixels",
                        char: char,
                        pixels: glyph.pixels,
                        lineNumber: lineNumber,
                        leftTop: xy
                            .add(0, this.ascent)
                            .sub(0, glyph.pixels.size.y)
                            .add(glyph.offset ?? v_0_0_)
                            .add(kerning, 0),
                    });
                    prevKerningMap = glyph.kerning ?? {};
                    xy = xy.add(glyph.advance + kerning, 0);
                }
                else if (glyph.type === "whitespace") {
                    prevKerningMap = glyph.kerning ?? {};
                    xy = xy.add(glyph.advance + kerning, 0);
                }
                else {
                    u_.assertUnreachable(glyph);
                }
            }
        }
        return arrangedGlyphs;
    }
}
