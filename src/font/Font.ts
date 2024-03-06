import { BpxImageUrl } from "../assets/Assets";
import { BpxPixels } from "../draw_api/Pixels";
import { BpxVector2d, v_, v_0_0_ } from "../misc/Vector2d";
import { BpxSprite } from "../sprite/Sprite";
import { u_ } from "../Utils";

export type BpxGlyph =
  | { type: "sprite"; sprite: BpxSprite; advance: number; offset?: BpxVector2d }
  | { type: "pixels"; pixels: BpxPixels; advance: number; offset?: BpxVector2d }
  | { type: "whitespace"; advance: number };

export type BpxArrangedGlyph = {
  /** Left-top position of a glyph in relation to the left-top of the entire text. */
  xy: BpxVector2d;
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

// TODO: kerning pairs

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

  abstract getGlyph(char: string): BpxGlyph | undefined;

  // TODO: support glyphs for char sequences
  // TODO: test this function
  arrangeGlyphsFor(text: string): BpxArrangedGlyph[] {
    const arrangedGlyphs: BpxArrangedGlyph[] = [];
    let xy: BpxVector2d = v_0_0_;

    for (const char of text) {
      if (char === "\n") {
        xy = v_(0, xy.y + this.ascent + this.descent + this.lineGap);
      } else {
        const glyph = this.getGlyph(char);
        if (!glyph) {
          // do nothing
        } else if (glyph.type === "sprite") {
          arrangedGlyphs.push({
            type: "sprite",
            sprite: glyph.sprite,
            xy: xy
              .add(0, this.ascent)
              .sub(0, glyph.sprite.size.y)
              .add(glyph.offset ?? v_0_0_),
            // TODO: offset glyph
          });
          xy = xy.add(glyph.advance, 0);
        } else if (glyph.type === "pixels") {
          arrangedGlyphs.push({
            type: "pixels",
            pixels: glyph.pixels,
            xy: xy
              .add(0, this.ascent)
              .sub(0, glyph.pixels.size.y)
              .add(glyph.offset ?? v_0_0_),
            // TODO: offset glyph
          });
          xy = xy.add(glyph.advance, 0);
        } else if (glyph.type === "whitespace") {
          xy = xy.add(glyph.advance, 0);
        } else {
          u_.assertUnreachable(glyph);
        }
      }
    }

    return arrangedGlyphs;
  }
}
