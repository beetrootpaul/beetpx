import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { BpxVector2d } from "../misc/Vector2d";
import { assertUnreachable } from "../utils/assertUnreachable";
import { identity } from "../utils/identity";
import { range } from "../utils/range";
/**
 * An instance of a font, defined with use of {@link BpxFontConfig}.
 *
 * @see https:
 *
 * @category Fonts
 */
export class BpxFont {
    /**
     * A method to create a font from scratch.
     *
     * @group Static factories
     */
    static of(config) {
        return new BpxFont({
            ascent: config.ascent ?? 8,
            descent: config.descent ?? 8,
            lineGap: config.lineGap ?? 1,
            mapGrapheme: config.mapGrapheme ?? identity,
            glyphs: config.glyphs ?? new Map(),
        });
    }
    /**
     * A method to create a font as an extension of an already defined font.
     *
     * @example
     * ```ts
     * const pico8FontWithExtraGlyphs = BpxFont.basedOn($font_pico8, baseFontConfig => ({
     *   ...baseFontConfig,
     *   glyphs: new Map<string, BpxGlyph>([
     *     ...baseFontConfig.glyphs,
     *     
     *   ]),
     * });
     * ```
     *
     * @group Static factories
     */
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
    /**
     * A list of sprite sheets gathered from the all sprite glyphs defined for this font.
     *
     * Useful for defining the assets to fetch in {@link BeetPx.start}
     *
     * @example
     * ```ts
     * $.start({
     *   
     *   assets: [
     *     ...myFont.spriteSheetUrls
     *   ],
     * })
     * ```
     */
    get spriteSheetUrls() {
        return this.#computedSpriteSheetUrls;
    }
    /**
     * @see {@link BpxFontConfig.ascent}
     */
    get ascent() {
        return this.#config.ascent;
    }
    /**
     * @see {@link BpxFontConfig.descent}
     */
    get descent() {
        return this.#config.descent;
    }
    /**
     * @see {@link BpxFontConfig.lineGap}
     */
    get lineGap() {
        return this.#config.lineGap;
    }
    /**
     * The main methods of the font, which iterates of the text segments (characters, but with a support
     * for multi-char emojis, e.g. "❤️"), and arranges their corresponding glyphs in a virtual visual space.
     *
     * The resulting array of {@link BpxArrangedGlyph} is further used by {@link BeetPxDraw.measureText}
     * for a headless text rendering and by {@link BeetPxDraw.text} for an actual text rendering.
     *
     * You rather doesn't have to use this method directly.
     */
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
