import { BpxFont, BpxPixels, spr_ } from "../../../src";
import { BpxGlyph } from "../../../src/font/Font";

export class CustomFont extends BpxFont {
  ascent = 5;
  descent = 3;
  leading = 12;

  spriteSheetUrls = ["custom-font.png"];

  getGlyphFor(char: string): BpxGlyph {
    switch (char) {
      case "T":
        return this.#spriteGlyph(5, 8, 3, 0);
      case "b":
        return this.#spriteGlyph(3, 8, 5, 5);
      case "e":
        return this.#spriteGlyph(3, 5, 8, 0);
      case "f":
        return this.#spriteGlyph(3, 8, 8, 5);
      case "h":
        return this.#spriteGlyph(3, 8, 0, 0);
      case "n":
        return this.#pixelsGlyph(`
          ##-
          #-#
          #-#
          #-#
          #-#
        `);
      case "o":
        return this.#spriteGlyph(3, 5, 5, 8);
      case "r":
        return this.#spriteGlyph(3, 5, 5, 0);
      case "w":
        return this.#pixelsGlyph(`
          #-#-#
          #-#-#
          #-#-#
          -#-#-
          -#-#-
        `);
      case "x":
        return this.#spriteGlyph(3, 5, 1, 8);
      default:
        return { type: "none" };
    }
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
}

export const customFont = new CustomFont();
