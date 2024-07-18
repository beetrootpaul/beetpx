var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _BpxFont_config, _BpxFont_computedSpriteSheetUrls;
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { BpxVector2d } from "../misc/Vector2d";
import { assertUnreachable } from "../utils/assertUnreachable";
import { identity } from "../utils/identity";
export class BpxFont {
    static of(config) {
        return new BpxFont({
            ascent: config.ascent ?? 8,
            descent: config.descent ?? 8,
            lineGap: config.lineGap ?? 1,
            mapChar: config.mapChar ?? identity,
            glyphs: config.glyphs ?? new Map(),
        });
    }
    static basedOn(baseFont, extendedConfig) {
        const config = extendedConfig(__classPrivateFieldGet(baseFont, _BpxFont_config, "f"));
        return new BpxFont(config);
    }
    constructor(config) {
        _BpxFont_config.set(this, void 0);
        _BpxFont_computedSpriteSheetUrls.set(this, void 0);
        __classPrivateFieldSet(this, _BpxFont_config, config, "f");
        __classPrivateFieldSet(this, _BpxFont_computedSpriteSheetUrls, Array.from(config.glyphs.values())
            .filter(glyph => glyph.type === "sprite")
            .map(glyph => glyph.sprite.imageUrl), "f");
    }
    get spriteSheetUrls() {
        return __classPrivateFieldGet(this, _BpxFont_computedSpriteSheetUrls, "f");
    }
    get ascent() {
        return __classPrivateFieldGet(this, _BpxFont_config, "f").ascent;
    }
    get descent() {
        return __classPrivateFieldGet(this, _BpxFont_config, "f").descent;
    }
    get lineGap() {
        return __classPrivateFieldGet(this, _BpxFont_config, "f").lineGap;
    }
    arrangeGlyphsFor(text, textColor, colorMarkers) {
        colorMarkers ??= {};
        const arrangedGlyphs = [];
        let xy = BpxVector2d.of(0, 0);
        let lineNumber = 0;
        let prevChar = "\n";
        for (let i = 0; i < text.length; i++) {
            const char = __classPrivateFieldGet(this, _BpxFont_config, "f").mapChar(text[i]);
            if (char === "\n") {
                prevChar = "\n";
                xy = BpxVector2d.of(0, xy.y +
                    __classPrivateFieldGet(this, _BpxFont_config, "f").ascent +
                    __classPrivateFieldGet(this, _BpxFont_config, "f").descent +
                    __classPrivateFieldGet(this, _BpxFont_config, "f").lineGap);
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
            const glyph = __classPrivateFieldGet(this, _BpxFont_config, "f").glyphs.get(char);
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
                    spriteColorMapping: BpxSpriteColorMapping.of(colorFromSpriteSheet => glyph.isTextColor(colorFromSpriteSheet) ? glyphColor : null),
                    lineNumber: lineNumber,
                    leftTop: xy
                        .add(0, __classPrivateFieldGet(this, _BpxFont_config, "f").ascent)
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
_BpxFont_config = new WeakMap(), _BpxFont_computedSpriteSheetUrls = new WeakMap();
