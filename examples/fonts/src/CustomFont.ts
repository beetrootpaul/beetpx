import {
  BpxFont,
  BpxGlyph,
  BpxKerningNextCharMap,
  BpxPixels,
  spr_,
  v_,
} from "../../../src";

export class CustomFont extends BpxFont {
  ascent = 8;
  descent = 3;
  lineGap = 3;

  spriteSheetUrls = ["custom-font.png"];

  mapChar(char: string): string {
    return char;
  }

  #spriteGlyph(
    w: number,
    h: number,
    x: number,
    y: number,
    extras?: {
      offsetY?: number;
      kerning?: BpxKerningNextCharMap;
    },
  ): BpxGlyph {
    // TODO: where to define the image URL?
    const sprite = spr_("custom-font.png")(w, h, x, y);
    return {
      type: "sprite",
      sprite: sprite,
      advance: sprite.size.x + 1,
      offset: extras?.offsetY ? v_(0, extras.offsetY) : undefined,
      kerning: extras?.kernin,
    };
  }

  #pixelsGlyph(ascii: string): BpxGlyph {
    const pixels = BpxPixels.from(ascii);
    return {
      type: "pixels",
      pixels: pixels,
      advance: pixels.size.x + 1,
    };
  }

  glyphs: Map<string, BpxGlyph> = new Map<string, BpxGlyph>([
    [" ", { type: "whitespace", advance: 3, kerning: { f: -1 } }],
    ["T", this.#spriteGlyph(5, 8, 3, 0, { kerning: { h: -1 } })],
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
    ["o", this.#spriteGlyph(3, 5, 5, 8, { kerning: { o: 1, x: 1 } })],
    ["q", this.#spriteGlyph(3, 8, 5, 8, { offsetY: this.descent })],
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
