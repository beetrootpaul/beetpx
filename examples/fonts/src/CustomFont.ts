import { BpxFont, BpxGlyph, BpxPixels, spr_ } from "../../../src";

export class CustomFont extends BpxFont {
  ascent = 8;
  descent = 3;
  leading = 12;

  spriteSheetUrls = ["custom-font.png"];

  getGlyph(char: string): BpxGlyph | undefined {
    return this.glyphs.get(char);
  }

  #spriteGlyph(w: number, h: number, x: number, y: number): BpxGlyph {
    // TODO: where to define the image URL?
    const sprite = spr_("custom-font.png")(w, h, x, y);
    return {
      type: "sprite",
      sprite: sprite,
      advanceX: sprite.size.x + 1,
    };
  }

  #pixelsGlyph(ascii: string): BpxGlyph {
    const pixels = BpxPixels.from(ascii);
    return {
      type: "pixels",
      pixels: pixels,
      advanceX: pixels.size.x + 1,
    };
  }

  glyphs: Map<string, BpxGlyph> = new Map<string, BpxGlyph>([
    ["T", this.#spriteGlyph(5, 8, 3, 0)],
    ["b", this.#spriteGlyph(3, 8, 5, 5)],
    ["e", this.#spriteGlyph(3, 5, 8, 0)],
    ["f", this.#spriteGlyph(3, 8, 6, 9)],
    ["h", this.#spriteGlyph(3, 8, 0, 0)],
    [
      "n",
      this.#pixelsGlyph(`
        ##-
        #-#
        #-#
        #-#
        #-#
      `),
    ],
    ["o", this.#spriteGlyph(3, 5, 5, 8)],
    ["q", this.#spriteGlyph(3, 8, 5, 8)],
    ["r", this.#spriteGlyph(3, 5, 5, 0)],
    [
      "w",
      this.#pixelsGlyph(`
         #-#-#
        #-#-#
        #-#-#
        -#-#-
        -#-#-
      `),
    ],
    ["x", this.#spriteGlyph(3, 5, 1, 8)],
  ]);
}

export const customFont = new CustomFont();
