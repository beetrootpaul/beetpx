import { BpxFontPico8, BpxGlyph, BpxPixels, spr_, v_ } from "../../../src";

export class Pico8FontWithAdjustments extends BpxFontPico8 {
  constructor() {
    super();

    this.ascent = 6;
    this.descent = 1;
    this.lineGap = 1;

    this.glyphs = new Map<string, BpxGlyph>([
      ...this.glyphs,

      //
      // additional sprites from the spritesheet
      //
      [
        "⭐",
        {
          type: "sprite",
          sprite: spr_(BpxFontPico8.spriteSheetUrl)(7, 5, 16, 72),
          advance: 8,
        },
      ],
      [
        "x",
        {
          type: "sprite",
          sprite: spr_(BpxFontPico8.spriteSheetUrl)(5, 5, 57, 72),
          advance: 4,
        },
      ],
      [
        "➡",
        {
          type: "sprite",
          sprite: spr_(BpxFontPico8.spriteSheetUrl)(7, 5, 8, 72),
          advance: 8,
        },
      ],
      [
        "❎",
        {
          type: "sprite",
          sprite: spr_(BpxFontPico8.spriteSheetUrl)(7, 5, 56, 72),
          advance: 8,
        },
      ],
      [
        "❤",
        {
          type: "sprite",
          sprite: spr_(BpxFontPico8.spriteSheetUrl)(5, 5, 57, 64),
          advance: 6,
        },
      ],

      //
      // additional manually defined sprites
      //
      [
        "q",
        {
          type: "pixels",
          pixels: BpxPixels.from(`
            -#-
            #-#
            #-#
            #-#
            -#-
            -##
          `),
          advance: 4,
          offset: v_(0, 1),
        },
      ],
      [
        "[",
        {
          type: "pixels",
          pixels: BpxPixels.from(`
            ##
            #-
            #-
            #-
            #-
            #-
            ##
          `),
          advance: 3,
          offset: v_(0, 1),
        },
      ],
      [
        "]",
        {
          type: "pixels",
          pixels: BpxPixels.from(`
            ##
            -#
            -#
            -#
            -#
            -#
            ##
          `),
          advance: 3,
          offset: v_(0, 1),
        },
      ],
    ]);
  }
}

export const pico8FontWithAdjustments = new Pico8FontWithAdjustments();
