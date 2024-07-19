import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { BpxVector2d } from "../misc/Vector2d";
import { assertUnreachable } from "../utils/assertUnreachable";
import { identity } from "../utils/identity";
import { range } from "../utils/range";
export class BpxFont {
    static of(config) {
        return new BpxFont({
            ascent: config.ascent ?? 8,
            descent: config.descent ?? 8,
            lineGap: config.lineGap ?? 1,
            mapGrapheme: config.mapGrapheme ?? identity,
            glyphs: config.glyphs ?? new Map(),
        });
    }
    static basedOn(baseFont, extendedConfig) {
        const config = extendedConfig(baseFont.#config);
        return new BpxFont(config);
    }
    static #segmenter = new Intl.Segmenter("en", {
        granularity: "grapheme",
        localeMatcher: "best fit",
    });
    #config;
    #computedSpriteSheetUrls;
    constructor(config) {
        this.#config = config;
        this.#computedSpriteSheetUrls = [
            ...new Set(Array.from(config.glyphs.values())
                .filter(glyph => glyph.type === "sprite")
                .map(glyph => glyph.sprite.imageUrl)),
        ];
    }
    get spriteSheetUrls() {
        return this.#computedSpriteSheetUrls;
    }
    get ascent() {
        return this.#config.ascent;
    }
    get descent() {
        return this.#config.descent;
    }
    get lineGap() {
        return this.#config.lineGap;
    }
    arrangeGlyphsFor(text, textColor, colorMarkers) {
        colorMarkers ??= {};
        const arrangedGlyphs = [];
        let xy = BpxVector2d.of(0, 0);
        let lineNumber = 0;
        let prevSegment = "\n";
        const segmentsIterator = BpxFont.#segmenter
            .segment(text)[Symbol.iterator]();
        for (let iteratorResult = segmentsIterator.next(); !iteratorResult.done; iteratorResult = segmentsIterator.next()) {
            const grapheme = this.#config.mapGrapheme(iteratorResult.value.segment);
            const index = iteratorResult.value.index;
            if (grapheme === "\n") {
                arrangedGlyphs.push({
                    type: "line_break",
                    lineNumber: lineNumber,
                });
                prevSegment = "\n";
                xy = BpxVector2d.of(0, xy.y +
                    this.#config.ascent +
                    this.#config.descent +
                    this.#config.lineGap);
                lineNumber += 1;
                continue;
            }
            if (grapheme === "[") {
                let newColor;
                for (const [marker, markedColor] of Object.entries(colorMarkers)) {
                    const markerText = `[${marker}]`;
                    if (text.slice(index, index + markerText.length) === markerText) {
                        newColor = markedColor;
                        
                        const segmentsToSkip = [...BpxFont.#segmenter.segment(markerText)].length - 1;
                        range(segmentsToSkip).forEach(() => {
                            segmentsIterator.next();
                        });
                        break;
                    }
                }
                if (newColor) {
                    textColor = newColor;
                    continue;
                }
            }
            const glyph = this.#config.glyphs.get(grapheme);
            if (!glyph) {
                continue;
            }
            const kerning = glyph.kerning?.[prevSegment] ?? 0;
            const glyphColor = textColor;
            if (glyph.type === "sprite") {
                arrangedGlyphs.push({
                    type: "sprite",
                    char: grapheme,
                    sprite: glyph.sprite,
                    spriteColorMapping: BpxSpriteColorMapping.of(color => glyph.isTextColor(color) ? glyphColor : null),
                    lineNumber: lineNumber,
                    leftTop: xy
                        .add(0, this.#config.ascent)
                        .sub(0, glyph.sprite.size.y)
                        .add(glyph.offset ?? BpxVector2d.of(0, 0))
                        .add(kerning, 0),
                });
                prevSegment = grapheme;
                xy = xy.add(glyph.advance + kerning, 0);
                continue;
            }
            if (glyph.type === "pixels") {
                arrangedGlyphs.push({
                    type: "pixels",
                    char: grapheme,
                    pixels: glyph.pixels,
                    color: glyphColor,
                    lineNumber: lineNumber,
                    leftTop: xy
                        .add(0, this.ascent)
                        .sub(0, glyph.pixels.size.y)
                        .add(glyph.offset ?? BpxVector2d.of(0, 0))
                        .add(kerning, 0),
                });
                prevSegment = grapheme;
                xy = xy.add(glyph.advance + kerning, 0);
                continue;
            }
            if (glyph.type === "whitespace") {
                prevSegment = grapheme;
                xy = xy.add(glyph.advance + kerning, 0);
                continue;
            }
            assertUnreachable(glyph);
        }
        return arrangedGlyphs;
    }
}
