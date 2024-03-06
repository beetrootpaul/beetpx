import { BpxImageUrl } from "../assets/Assets";
import { BpxPixels } from "../draw_api/Pixels";
import { BpxVector2d } from "../misc/Vector2d";
import { v_, v_0_0_ } from "../shorthands";
import { BpxSprite } from "../sprite/Sprite";
import { u_ } from "../Utils";

export type BpxKerningNextCharMap = { [nextChar: string]: number };

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
    }
  | {
      type: "pixels";
      pixels: BpxPixels;
    }
);

export abstract class BpxFont {
  /** An amount of pixels from the baseline (included) to the top-most pixel of font's glyphs. */
  abstract readonly ascent: number;
  /** An amount of pixels from the baseline (excluded) to the bottom-most pixel of font's glyphs. */
  abstract readonly descent: number;
  /** An amount of pixels between the bottom-most pixel of the previous line (excluded) and the top-most pixel of the next line (excluded). */
  abstract readonly lineGap: number;

  /** URLs of sprite sheets used by glyphs of this font. */
  abstract readonly spriteSheetUrls: BpxImageUrl[];

  // TODO: add ligatures to the example? Handle "[c1]" such way?
  protected abstract readonly glyphs: Map<string, BpxGlyph>;

  abstract mapChar(char: string): string;

  // TODO: support glyphs for char sequences
  // TODO: test this function
  arrangeGlyphsFor(text: string): BpxArrangedGlyph[] {
    const arrangedGlyphs: BpxArrangedGlyph[] = [];
    let xy = v_0_0_;
    let lineNumber = 0;
    let prevKerningMap: BpxKerningNextCharMap = {};

    for (let char of text) {
      char = this.mapChar(char);
      if (char === "\n") {
        prevKerningMap = {};
        xy = v_(0, xy.y + this.ascent + this.descent + this.lineGap);
        lineNumber += 1;
      } else {
        const kerning = prevKerningMap[char] ?? 0;
        const glyph = this.glyphs.get(char);
        if (!glyph) {
          // do nothing
        } else if (glyph.type === "sprite") {
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
        } else if (glyph.type === "pixels") {
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
        } else if (glyph.type === "whitespace") {
          prevKerningMap = glyph.kerning ?? {};
          xy = xy.add(glyph.advance + kerning, 0);
        } else {
          u_.assertUnreachable(glyph);
        }
      }
    }

    return arrangedGlyphs;
  }
}
