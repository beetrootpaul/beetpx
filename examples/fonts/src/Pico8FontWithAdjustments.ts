import {
  BpxGlyph,
  BpxPixels,
  BpxRgbColor,
  font_,
  font_pico8_,
  spr_,
  v_,
} from "../../../src";
import { BpxPalettePico8 } from "../../../src/color/PalettePico8";

const s = spr_(".beetpx/pico-8-font.png");

const isTextColor = (colorFromSpriteSheet: BpxRgbColor | null) =>
  colorFromSpriteSheet?.cssHex === BpxPalettePico8.white.cssHex;

export const pico8FontWithAdjustments = font_(font_pico8_, baseFontConfig => ({
  ...baseFontConfig,

  ascent: 6,
  descent: 1,

  glyphs: new Map<string, BpxGlyph>([
    ...baseFontConfig.glyphs,

    //
    // additional sprites from the spritesheet
    //
    [
      "⭐",
      {
        type: "sprite",
        sprite: s(7, 5, 16, 72),
        isTextColor,
        advance: 8,
      },
    ],
    [
      "x",
      {
        type: "sprite",
        sprite: s(5, 5, 57, 72),
        isTextColor,
        advance: 4,
      },
    ],
    [
      "➡",
      {
        type: "sprite",
        sprite: s(7, 5, 8, 72),
        isTextColor,
        advance: 8,
      },
    ],
    [
      "❎",
      {
        type: "sprite",
        sprite: s(7, 5, 56, 72),
        isTextColor,
        advance: 8,
      },
    ],
    [
      "❤",
      {
        type: "sprite",
        sprite: s(5, 5, 57, 64),
        isTextColor,
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
  ]),
}));
