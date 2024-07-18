import {
  BpxGlyph,
  BpxKerningPrevCharMap,
  BpxPixels,
  font_,
  spr_,
  v_,
} from "../../../src";

const descent = 3;

export const customFont = font_({
  ascent: 8,
  descent,
  lineGap: 3,

  glyphs: new Map<string, BpxGlyph>([
    [" ", { type: "whitespace", advance: 3 }],
    ["T", spriteGlyph(5, 8, 3, 0)],
    ["b", spriteGlyph(3, 8, 5, 5)],
    ["e", spriteGlyph(3, 5, 8, 0)],
    [
      "f",
      spriteGlyph(3, 8, 6, 9, {
        kerning: { " ": -1 },
        useExternalSpriteSheet: true,
      }),
    ],
    [
      "h",
      spriteGlyph(3, 8, 0, 0, {
        kerning: { t: -1, T: -1 },
        useExternalSpriteSheet: true,
      }),
    ],
    [
      "n",
      pixelsGlyph(`
        ##-
        #-#
        #-#
        #-#
        #-#
      `),
    ],
    ["o", spriteGlyph(3, 5, 5, 8)],
    ["q", spriteGlyph(3, 8, 5, 8, { offsetY: descent })],
    ["r", spriteGlyph(3, 5, 5, 0, { useExternalSpriteSheet: true })],
    [
      "w",
      pixelsGlyph(`
        #-#-#
        #-#-#
        #-#-#
        -#-#-
        -#-#-
      `),
    ],
    ["x", spriteGlyph(3, 5, 1, 8, { kerning: { o: 1 } })],
    [
      "➡",
      pixelsGlyph(`
        ----------
        ----------
        -------#--
        -------##-
        ##########
        -------##-
        -------#--
        ----------
      `),
    ],
  ]),
});

function spriteGlyph(
  w: number,
  h: number,
  x: number,
  y: number,
  extras?: {
    offsetY?: number;
    kerning?: BpxKerningPrevCharMap;
    useExternalSpriteSheet?: boolean;
  },
): BpxGlyph {
  const sprite = spr_(
    // We use two sprite sheets in order to make an example of:
    //   - using more than 1 sprite sheet for a single font,
    //   - using both local (deployed together with the game) and external sprite sheets.
    extras?.useExternalSpriteSheet ?
      "https://raw.githubusercontent.com/beetrootpaul/beetpx/main/examples/fonts/public/custom-font.png"
    : "custom-font.png",
  )(w, h, x, y);
  return {
    type: "sprite",
    sprite: sprite,
    isTextColor: colorFromSpriteSheet =>
      colorFromSpriteSheet?.cssHex === "#99e550",
    advance: sprite.size.x + 1,
    offset: extras?.offsetY ? v_(0, extras.offsetY) : undefined,
    kerning: extras?.kerning,
  };
}

function pixelsGlyph(ascii: string): BpxGlyph {
  const pixels = BpxPixels.from(ascii);
  return {
    type: "pixels",
    pixels: pixels,
    advance: pixels.size.x + 1,
  };
}
