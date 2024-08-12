import { BpxRgbColor } from "../color/RgbColor";
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { BpxPixels } from "../draw_api/Pixels";
import { BpxVector2d } from "../misc/Vector2d";
import { BpxSprite } from "../sprite/Sprite";
import { assertUnreachable } from "../utils/assertUnreachable";
import { identity } from "../utils/identity";
import { range } from "../utils/range";

/**
 * The map of how much to adjust the vertical placement of this glyph if the
 * previous text segment (char) was one of the keys in this map.
 *
 * @example
 * ```ts
 * $d.setFont(
 *   $font({
 *     glyphs: new Map<string, BpxGlyph>([
 *       [
 *         "T",
 *         {
 *           // ...
 *         },
 *       ],
 *       [
 *         "i",
 *         {
 *           // ...
 *           kerning: {
 *             // put "i" a 1 px closer to "T", so they do not look so distant visually
 *             T: -1,
 *           },
 *         },
 *       ],
 *     ]),
 *   }),
 * );
 * ```
 *
 * @category Fonts
 */
export type BpxKerningPrevSegmentMap = { [prevSegment: string]: number };

/**
 * A map of special text sequences to be treated as instructions to change the color of the
 * printed text from a given char position.
 *
 * @example
 * ```ts
 * const prevMarkers = $d.setTextColorMarkers({
 *   red_theBest: $rgb_red,
 *   b: $rgb_blue,
 * });
 * $d.text("colors are: green, [b]blue, [red_theBest]red", $v(10), $rgb_green);
 * $d.setTextColorMarkers(prevMarkers);
 * ```
 *
 * @see {@link BeetPxDraw.setTextColorMarkers}
 *
 * @category Drawing
 */
export type BpxTextColorMarkers = { [marker: string]: BpxRgbColor };

/**
 * A definition of a glyph used by a font. Used as values in {@link BpxFontConfig.glyphs}.
 *
 * @category Fonts
 */
export type BpxGlyph =
  | {
      /** A property used in checking which type of a glyph it is, so TypeScript can infer its properties correctly. */
      type: "sprite";
      /** A sprite to be drawn for this glyph. */
      sprite: BpxSprite;
      /** A function used to distinguish text from its background on a sprite sheet. */
      isTextColor: (color: BpxRgbColor | null) => boolean;
      /** How much to move the text drawing cursor to the right after drawing this glyph. Measured from the left edge of the glyph. */
      advance: number;
      /** The relative position of the glyph to be drawn in relation to the current cursor position. */
      offset?: BpxVector2d;
      /** The map of how much to adjust the vertical placement of this glyph if the previous text segment (char) was one of the keys in this map. */
      kerning?: BpxKerningPrevSegmentMap;
    }
  | {
      /** A property used in checking which type of a glyph it is, so TypeScript can infer its properties correctly. */
      type: "pixels";
      /** A sprite to be drawn for this glyph, represented by 1-bit representation in the game code. */
      pixels: BpxPixels;
      /** How much to move the text drawing cursor to the right after drawing this glyph. Measured from the left edge of the glyph. */
      advance: number;
      /** The relative position of the glyph to be drawn in relation to the current cursor position. */
      offset?: BpxVector2d;
      /** The map of how much to adjust the vertical placement of this glyph if the previous text segment (char) was one of the keys in this map. */
      kerning?: BpxKerningPrevSegmentMap;
    }
  | {
      /** A property used in checking which type of a glyph it is, so TypeScript can infer its properties correctly. */
      type: "whitespace";
      /** How much to move the text drawing cursor to the right after processing this glyph. Measured from the left edge of the glyph. */
      advance: number;
      /** The map of how much to adjust the vertical placement of this glyph if the previous text segment (char) was one of the keys in this map. */
      kerning?: BpxKerningPrevSegmentMap;
    };

/**
 * Similar to {@link BpxGlyph}, but after being arranged by {@link BpxFont.arrangeGlyphsFor}
 * in context of given glyphs' placement, text color, and color markers.
 *
 * Used by {@link BeetPxDraw.measureText} for a headless text rendering. Also, used
 * by {@link BeetPxDraw.text} for an actual text rendering.
 *
 * @category Fonts
 */
export type BpxArrangedGlyph =
  | {
      type: "sprite";
      char: string;
      /** Left-top position of a glyph in relation to the left-top of the entire text. */
      leftTop: BpxVector2d;
      /** Line number within the entire text (multiple lines can be achieved by including `\n` within the text). */
      lineNumber: number;
      sprite: BpxSprite;
      /** The color mapping used to draw a glyph's sprite in a desired text color. */
      spriteColorMapping: BpxSpriteColorMapping;
    }
  | {
      type: "pixels";
      char: string;
      /** Left-top position of a glyph in relation to the left-top of the entire text. */
      leftTop: BpxVector2d;
      /** Line number within the entire text (multiple lines can be achieved by including `\n` within the text). */
      lineNumber: number;
      pixels: BpxPixels;
      color: BpxRgbColor;
    }
  | {
      type: "line_break";
      /** Line number within the entire text (multiple lines can be achieved by including `\n` within the text). */
      lineNumber: number;
    };

/**
 * A font definition.
 *
 * @example
 * ```ts
 * $d.setFont($font({
 *   ascent: 5,
 *   descent: 0,
 *   lineGap: 1,
 *
 *   mapGrapheme(grapheme: string): string {
 *     return grapheme.toLowerCase();
 *   },
 *
 *   glyphs: new Map<string, BpxGlyph>([
 *     [" ", { type: "whitespace", advance: 4 }],
 *     ["0", { type: "sprite", ... }],
 *     // a lot more glyphs defined here
 *   ]),
 * });
 * ```
 *
 * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/fonts
 *
 * @category Fonts
 */
export type BpxFontConfig = {
  /**
   * An amount of pixels from the baseline (included) to the top-most pixel of font's glyphs.
   */
  ascent: number;

  /**
   * An amount of pixels from the baseline (excluded) to the bottom-most pixel of font's glyphs.
   */
  descent: number;

  /**
   * An amount of pixels between the bottom-most pixel of the previous line (excluded) and
   * the top-most pixel of the next line (excluded).
   */
  lineGap: number;

  /**
   * This functions maps the text grapheme (a user-perceived character like `a` or a
   * multi-character emoji like `❤️`) before trying to find its corresponding glyph
   * in a `glyphs` map. It would be typically used to call `grapheme.toLowerCase()`
   * in fonts which have glyphs defined for lower-case characters only.
   */
  mapGrapheme: (grapheme: string) => string;

  /**
   * A map which contains the glyphs for specified graphemes (keys of the map).
   * Grapheme is a user-perceived character like `a` or a multi-character emoji
   * like `❤️`. Before retrieving a glyph from this map, a grapheme is normalized
   * with use of `mapGrapheme` function. Typically, it would be useful when you
   * want to specify same glyphs for both upper-case and lower-case characters,
   * so you are able to define lower-case ones only and then implement
   * `mapGrapheme` as `grapheme.toLowerCase()`.
   */
  glyphs: Map<string, BpxGlyph>;
};

/**
 * An instance of a font, defined with use of {@link BpxFontConfig}.
 *
 * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/fonts
 *
 * @category Fonts
 */
export class BpxFont {
  /**
   * A method to create a font from scratch.
   *
   * @group Static factories
   */
  static of(config: Partial<BpxFontConfig>) {
    return new BpxFont({
      ascent: config.ascent ?? 8,
      descent: config.descent ?? 8,
      lineGap: config.lineGap ?? 1,
      mapGrapheme: config.mapGrapheme ?? identity,
      glyphs: config.glyphs ?? new Map<string, BpxGlyph>(),
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
   *     // additional glyphs defined here
   *   ]),
   * });
   * ```
   *
   * @group Static factories
   */
  static basedOn(
    baseFont: BpxFont,
    extendedConfig: (baseFontConfig: BpxFontConfig) => BpxFontConfig,
  ) {
    const config = extendedConfig(baseFont.#config);
    return new BpxFont(config);
  }

  static readonly #segmenter: Intl.Segmenter = new Intl.Segmenter("en", {
    granularity: "grapheme",
    localeMatcher: "best fit",
  });

  readonly #config: BpxFontConfig;

  readonly #computedSpriteSheetUrls: string[];

  private constructor(config: BpxFontConfig) {
    this.#config = config;

    this.#computedSpriteSheetUrls = [
      ...new Set(
        Array.from(config.glyphs.values())
          .filter(glyph => glyph.type === "sprite")
          .map(glyph => glyph.sprite.imageUrl),
      ),
    ];
  }

  /**
   * A list of sprite sheets gathered from the all sprite glyphs defined for this font.
   *
   * Useful for defining the assets to fetch in {@link BeetPx.start}
   *
   * @example
   * ```ts
   * $x.start({
   *   // ...
   *   assets: [
   *     ...myFont.spriteSheetUrls
   *   ],
   * })
   * ```
   */
  get spriteSheetUrls(): string[] {
    return this.#computedSpriteSheetUrls;
  }

  /**
   * @see {@link BpxFontConfig.ascent}
   */
  get ascent(): number {
    return this.#config.ascent;
  }
  /**
   * @see {@link BpxFontConfig.descent}
   */
  get descent(): number {
    return this.#config.descent;
  }
  /**
   * @see {@link BpxFontConfig.lineGap}
   */
  get lineGap(): number {
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
  arrangeGlyphsFor(
    text: string,
    textColor: BpxRgbColor,
    colorMarkers?: BpxTextColorMarkers,
  ): BpxArrangedGlyph[] {
    colorMarkers ??= {};

    const arrangedGlyphs: BpxArrangedGlyph[] = [];
    let xy = BpxVector2d.of(0, 0);
    let lineNumber = 0;
    let prevSegment = "\n";

    const segmentsIterator = BpxFont.#segmenter
      .segment(text)
      [Symbol.iterator]();
    for (
      let iteratorResult = segmentsIterator.next();
      !iteratorResult.done;
      iteratorResult = segmentsIterator.next()
    ) {
      const grapheme = this.#config.mapGrapheme(iteratorResult.value.segment);
      const index = iteratorResult.value.index;

      if (grapheme === "\n") {
        arrangedGlyphs.push({
          type: "line_break",
          lineNumber: lineNumber,
        });

        prevSegment = "\n";
        xy = BpxVector2d.of(
          0,
          xy.y +
            this.#config.ascent +
            this.#config.descent +
            this.#config.lineGap,
        );
        lineNumber += 1;
        continue;
      }

      if (grapheme === "[") {
        let newColor: BpxRgbColor | undefined;
        for (const [marker, markedColor] of Object.entries(colorMarkers)) {
          const markerText = `[${marker}]`;
          if (text.slice(index, index + markerText.length) === markerText) {
            newColor = markedColor;

            // "- 1", because one segments is already processed right now, since we encountered "["
            const segmentsToSkip =
              [...BpxFont.#segmenter.segment(markerText)].length - 1;
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
          spriteColorMapping: BpxSpriteColorMapping.of(color =>
            glyph.isTextColor(color) ? glyphColor : null,
          ),
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
