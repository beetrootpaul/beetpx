import { BpxImageUrl } from "../assets/Assets";
import { BpxRgbColor } from "../color/RgbColor";
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { BpxPixels } from "../draw_api/Pixels";
import { BpxVector2d } from "../misc/Vector2d";
import { v_, v_0_0_ } from "../shorthands";
import { BpxSprite } from "../sprite/Sprite";
import { u_ } from "../Utils";

export type BpxKerningNextCharMap = { [nextChar: string]: number };

export type BpxTextColorMarkers = { [marker: string]: BpxRgbColor };

export type BpxGlyph =
  | {
      type: "sprite";
      sprite: BpxSprite;
      advance: number;
      offset?: BpxVector2d;
      kerning?: BpxKerningNextCharMap;
    }
  | {
      type: "pixels";
      pixels: BpxPixels;
      advance: number;
      offset?: BpxVector2d;
      kerning?: BpxKerningNextCharMap;
    }
  | {
      type: "whitespace";
      advance: number;
      kerning?: BpxKerningNextCharMap;
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

export abstract class BpxFont {
  /** An amount of pixels from the baseline (included) to the top-most pixel of font's glyphs. */
  abstract readonly ascent: number;
  /** An amount of pixels from the baseline (excluded) to the bottom-most pixel of font's glyphs. */
  abstract readonly descent: number;
  /** An amount of pixels between the bottom-most pixel of the previous line (excluded) and
   * the top-most pixel of the next line (excluded). */
  abstract readonly lineGap: number;

  /** URLs of sprite sheets used by glyphs of this font. */
  abstract readonly spriteSheetUrls: BpxImageUrl[];

  /** This function is used to distinguish text from its background on a font's sprite sheet.
   *  If there is no sprite sheet in use at all, feel free to return `true` here. */
  protected abstract isSpriteSheetTextColor(color: BpxRgbColor | null): boolean;

  protected abstract readonly glyphs: Map<string, BpxGlyph>;

  protected abstract mapChar(char: string): string;

  // TODO: test this function
  arrangeGlyphsFor(
    text: string,
    textColor: BpxRgbColor,
    colorMarkers?: BpxTextColorMarkers,
  ): BpxArrangedGlyph[] {
    colorMarkers ??= {};

    const arrangedGlyphs: BpxArrangedGlyph[] = [];
    let xy = v_0_0_;
    let lineNumber = 0;
    let prevKerningMap: BpxKerningNextCharMap = {};

    for (let i = 0; i < text.length; i++) {
      const char = this.mapChar(text[i]!);

      if (char === "\n") {
        prevKerningMap = {};
        xy = v_(0, xy.y + this.ascent + this.descent + this.lineGap);
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
            // TODO: test for this edge case of `textColor` returned from a function being always the last assigned value
            this.isSpriteSheetTextColor(sourceColor) ? glyphColor : null,
          ),
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
