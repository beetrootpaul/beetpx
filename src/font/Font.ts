import { BpxRgbColor } from "../color/RgbColor";
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { BpxPixels } from "../draw_api/Pixels";
import { BpxVector2d } from "../misc/Vector2d";
import { BpxSprite } from "../sprite/Sprite";
import { assertUnreachable } from "../utils/assertUnreachable";
import { identity } from "../utils/identity";
import { range } from "../utils/range";

export type BpxKerningPrevCharMap = { [prevChar: string]: number };

export type BpxTextColorMarkers = { [marker: string]: BpxRgbColor };

export type BpxGlyph =
  | {
      type: "sprite";
      sprite: BpxSprite;
      /** This function is used to distinguish text from its background on a font's sprite sheet. */
      isTextColor: (color: BpxRgbColor | null) => boolean;
      advance: number;
      offset?: BpxVector2d;
      kerning?: BpxKerningPrevCharMap;
    }
  | {
      type: "pixels";
      pixels: BpxPixels;
      advance: number;
      offset?: BpxVector2d;
      kerning?: BpxKerningPrevCharMap;
    }
  | {
      type: "whitespace";
      advance: number;
      kerning?: BpxKerningPrevCharMap;
    };

export type BpxArrangedGlyph =
  | {
      type: "sprite";
      char: string;
      /** Left-top position of a glyph in relation to the left-top of the entire text. */
      leftTop: BpxVector2d;
      lineNumber: number;
      sprite: BpxSprite;
      spriteColorMapping: BpxSpriteColorMapping;
    }
  | {
      type: "pixels";
      char: string;
      /** Left-top position of a glyph in relation to the left-top of the entire text. */
      leftTop: BpxVector2d;
      lineNumber: number;
      pixels: BpxPixels;
      color: BpxRgbColor;
    }
  | {
      type: "line_break";
      lineNumber: number;
    };

export type BpxFontConfig = {
  /** An amount of pixels from the baseline (included) to the top-most pixel of font's glyphs. */
  ascent: number;

  /** An amount of pixels from the baseline (excluded) to the bottom-most pixel of font's glyphs. */
  descent: number;

  /** An amount of pixels between the bottom-most pixel of the previous line (excluded) and
   *  the top-most pixel of the next line (excluded). */
  lineGap: number;

  /** This functions maps the text grapheme (a user-perceived character like `a` or a
   *  multi-character emoji like `❤️`) before trying to find its corresponding glyph
   *  in a `glyphs` map. It would be typically used to call `grapheme.toLowerCase()`
   *  in fonts which have glyphs defined for lower-case characters only. */
  mapGrapheme: (grapheme: string) => string;

  /** A map which contains the glyphs for specified graphemes (keys of the map).
   *  Grapheme is a user-perceived character like `a` or a multi-character emoji
   *  like `❤️`. Before retrieving a glyph from this map, a grapheme is normalized
   *  with use of `mapGrapheme` function. Typically, it would be useful when you
   *  want to specify same glyphs for both upper-case and lower-case characters,
   *  so you are able to define lower-case ones only and then implement
   *  `mapGrapheme` as `grapheme.toLowerCase()`. */
  glyphs: Map<string, BpxGlyph>;
};

export class BpxFont {
  static of(config: Partial<BpxFontConfig>) {
    return new BpxFont({
      ascent: config.ascent ?? 8,
      descent: config.descent ?? 8,
      lineGap: config.lineGap ?? 1,
      mapGrapheme: config.mapGrapheme ?? identity,
      glyphs: config.glyphs ?? new Map<string, BpxGlyph>(),
    });
  }

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

  constructor(config: BpxFontConfig) {
    this.#config = config;

    this.#computedSpriteSheetUrls = [
      ...new Set(
        Array.from(config.glyphs.values())
          .filter(glyph => glyph.type === "sprite")
          .map(glyph => glyph.sprite.imageUrl),
      ),
    ];
  }

  get spriteSheetUrls(): string[] {
    return this.#computedSpriteSheetUrls;
  }

  get ascent(): number {
    return this.#config.ascent;
  }
  get descent(): number {
    return this.#config.descent;
  }
  get lineGap(): number {
    return this.#config.lineGap;
  }

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
