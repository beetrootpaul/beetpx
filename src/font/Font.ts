import { BpxImageUrl } from "../assets/Assets";
import { BpxPixels } from "../draw_api/Pixels";
import { BpxVector2d, v_, v_0_0_ } from "../misc/Vector2d";
import { BpxSprite } from "../sprite/Sprite";
import { u_ } from "../Utils";

export type BpxGlyph =
  | { type: "sprite"; sprite: BpxSprite; advanceX: number }
  | { type: "pixels"; pixels: BpxPixels; advanceX: number }
  | { type: "blank"; advanceX: number }
  | { type: "none" };

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
  /** An amount of pixels from the baseline of the previous line (excluded) to the baseline of the next line (included). */
  abstract readonly leading: number;

  /** URLs of sprite sheets used by glyphs of this font. */
  abstract readonly spriteSheetUrls: BpxImageUrl[];

  abstract getGlyphFor(char: string): BpxGlyph;

  // TODO: support glyphs for char sequences
  // TODO: test this function
  arrangeGlyphsFor(text: string): BpxArrangedGlyph[] {
    const arrangedGlyphs: BpxArrangedGlyph[] = [];
    let xy: BpxVector2d = v_0_0_;

    for (const char of text) {
      if (char === "\n") {
        xy = v_(0, xy.y + this.leading);
      } else {
        const glyph = this.getGlyphFor(char);
        if (glyph.type === "sprite") {
          arrangedGlyphs.push({
            type: "sprite",
            sprite: glyph.sprite,
            xy: xy,
            // TODO: offset glyph
          });
          xy = xy.add(glyph.advanceX, 0);
        } else if (glyph.type === "pixels") {
          arrangedGlyphs.push({
            type: "pixels",
            pixels: glyph.pixels,
            xy: xy,
            // TODO: offset glyph
          });
          xy = xy.add(glyph.advanceX, 0);
        } else if (glyph.type === "blank") {
          xy = xy.add(glyph.advanceX, 0);
        } else if (glyph.type === "none") {
          // do nothing
        } else {
          u_.assertUnreachable(glyph);
        }
      }
    }

    return arrangedGlyphs;
  }
}
