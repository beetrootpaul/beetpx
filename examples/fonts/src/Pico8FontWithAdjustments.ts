import {
  BpxFontConfigPico8,
  BpxGlyph,
  BpxPalettePico8,
  BpxPixels,
  BpxRgbColor,
  font_,
  font_pico8_,
  spr_,
} from "../../../src";

const s = spr_(BpxFontConfigPico8.spriteSheetUrl);

const isTextColor = (color: BpxRgbColor | null) =>
  color?.cssHex === BpxPalettePico8.white.cssHex;

export const pico8FontWithAdjustments = font_(font_pico8_, baseFontConfig => ({
  ...baseFontConfig,

  ascent: 6,
  descent: 1,

  glyphs: new Map<string, BpxGlyph>([
    ...baseFontConfig.glyphs,

    //
    // replacement of the original "x" with another x-like sprite
    //
    [
      "x",
      {
        type: "sprite",
        sprite: s(5, 5, 57, 72),
        isTextColor,
        advance: 6,
      },
    ],

    //
    // additional, manually defined "eject" sprite
    //
    [
      "⏏️",
      {
        type: "pixels",
        pixels: BpxPixels.from(`
          --#--
          -###-
          #####
          -----
          #####
        `),
        advance: 6,
      },
    ],
  ]),
}));
