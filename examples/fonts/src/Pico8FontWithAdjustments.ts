import { BpxPixels, spr_ } from "../../../src";
import { BpxGlyph } from "../../../src/font/Font";
import { BpxFontPico8 } from "../../../src/font/FontPico8";

export class Pico8FontWithAdjustments extends BpxFontPico8 {
  leading = 6;

  getGlyphFor(char: string): BpxGlyph {
    switch (char) {
      case "]":
        return this.#spriteGlyph(13, 5);
      case "[":
        return this.#pixelsGlyph(`
          ##-
          #--
          #--
          #--
          ##-
        `);
      default:
        return super.getGlyphFor(char);
    }
  }

  #spriteGlyph(tileX: number, tileY: number): BpxGlyph {
    // TODO: where to define the image URL? to derive it from PICO-8 definition?
    const sprite = spr_(".beetpx/pico-8-font.png")(3, 5, tileX * 8, tileY * 8);
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

export const pico8FontWithAdjustments = new Pico8FontWithAdjustments();
