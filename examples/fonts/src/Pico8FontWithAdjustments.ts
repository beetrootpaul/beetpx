import { BpxFontPico8, BpxGlyph, BpxPixels, spr_ } from "../../../src";

export class Pico8FontWithAdjustments extends BpxFontPico8 {
  constructor() {
    super();

    this.leading = 8;

    this.glyphs = new Map<string, BpxGlyph>([
      ...this.glyphs,
      ["]", this.#spriteGlyph(13, 5)],
      [
        "[",
        this.#pixelsGlyph(`
        ##-
        #--
        #--
        #--
        ##-
      `),
      ],
    ]);
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
