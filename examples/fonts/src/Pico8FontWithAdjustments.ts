import {
  $font,
  $font_pico8,
  $spr,
  BpxFontConfigPico8,
  BpxGlyph,
  BpxPalettePico8,
  BpxPixels,
  BpxRgbColor,
} from "../../../src";

const s = $spr(BpxFontConfigPico8.spriteSheetUrl);

const isTextColor = (color: BpxRgbColor | null) =>
  color?.cssHex === BpxPalettePico8.white.cssHex;

export const pico8FontWithAdjustments = $font($font_pico8, baseFontConfig => ({
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
