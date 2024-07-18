import { BpxRgbColor } from "../color/RgbColor";
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { BpxPixels } from "../draw_api/Pixels";
import { BpxVector2d } from "../misc/Vector2d";
import { BpxSprite } from "../sprite/Sprite";
import { assertUnreachable } from "../utils/assertUnreachable";
import { identity } from "../utils/identity";

export type BpxKerningPrevCharMap = { [prevChar: string]: number };

export type BpxTextColorMarkers = { [marker: string]: BpxRgbColor };

export type BpxGlyph =
  | {
      type: "sprite";
      sprite: BpxSprite;
      /** This function is used to distinguish text from its background on a font's sprite sheet. */
      isTextColor: (colorFromSpriteSheet: BpxRgbColor | null) => boolean;
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

export type BpxArrangedGlyph = {
  /** Left-top position of a glyph in relation to the left-top of the entire text. */
  leftTop: BpxVector2d;
  lineNumber: number;
  char: string;
} & (
  | {
      type: "sprite";
      sprite: BpxSprite;
      spriteColorMapping: BpxSpriteColorMapping;
    }
  | {
      type: "pixels";
      pixels: BpxPixels;
      color: BpxRgbColor;
    }
);

export type BpxFontConfig = {
  /** An amount of pixels from the baseline (included) to the top-most pixel of font's glyphs. */
  ascent: number;
  /** An amount of pixels from the baseline (excluded) to the bottom-most pixel of font's glyphs. */
  descent: number;
  /** An amount of pixels between the bottom-most pixel of the previous line (excluded) and
   *  the top-most pixel of the next line (excluded). */
  lineGap: number;

  mapChar: (char: string) => string;

  glyphs: Map<string, BpxGlyph>;
};

export class BpxFont {
  static of(config: Partial<BpxFontConfig>) {
    return new BpxFont({
      ascent: config.ascent ?? 8,
      descent: config.descent ?? 8,
      lineGap: config.lineGap ?? 1,
      mapChar: config.mapChar ?? identity,
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

  readonly #config: BpxFontConfig;

  readonly #computedSpriteSheetUrls: string[];

  constructor(config: BpxFontConfig) {
    this.#config = config;

    this.#computedSpriteSheetUrls = Array.from(config.glyphs.values())
      .filter(glyph => glyph.type === "sprite")
      .map(glyph => glyph.sprite.imageUrl);
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
    let prevChar = "\n";

    for (let i = 0; i < text.length; i++) {
      const char = this.#config.mapChar(text[i]!);

      if (char === "\n") {
        prevChar = "\n";
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

      if (char === "[") {
        let newColor: BpxRgbColor | undefined;
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

      const glyph = this.#config.glyphs.get(char);
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
          spriteColorMapping: BpxSpriteColorMapping.of(colorFromSpriteSheet =>
            glyph.isTextColor(colorFromSpriteSheet) ? glyphColor : null,
          ),
          lineNumber: lineNumber,
          leftTop: xy
            .add(0, this.#config.ascent)
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
