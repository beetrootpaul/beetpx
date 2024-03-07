import {
  BpxFont,
  BpxGlyph,
  BpxKerningPrevCharMap,
  BpxPixels,
  BpxRgbColor,
  spr_,
  v_,
} from "../../../src";

export class CustomFont extends BpxFont {
  // We use both sprite sheets only to make an example of:
  //   - using more than 1 sprite sheet for a single font,
  //   - using both local (deployed together with the game) and external sprite sheets.
  static #internalSpriteSheetUrl = "custom-font.png";
  static #externalSpriteSheetUrl =
    "https://raw.githubusercontent.com/beetrootpaul/beetpx/fonts_rework/examples/fonts/public/custom-font.png";

  ascent = 8;
  descent = 3;
  lineGap = 3;

  spriteSheetUrls = [
    CustomFont.#internalSpriteSheetUrl,
    CustomFont.#externalSpriteSheetUrl,
  ];

  protected isSpriteSheetTextColor(color: BpxRgbColor | null): boolean {
    return color?.cssHex === "#99e550";
  }

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
      kerning?: BpxKerningPrevCharMap;
      useExternalSpriteSheet?: boolean;
    },
  ): BpxGlyph {
    const sprite = spr_(
      extras?.useExternalSpriteSheet
        ? CustomFont.#externalSpriteSheetUrl
        : CustomFont.#internalSpriteSheetUrl,
    )(w, h, x, y);
    return {
      type: "sprite",
      sprite: sprite,
      advance: sprite.size.x + 1,
      offset: extras?.offsetY ? v_(0, extras.offsetY) : undefined,
      kerning: extras?.kerning,
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
    [" ", { type: "whitespace", advance: 3 }],
    ["T", this.#spriteGlyph(5, 8, 3, 0)],
    ["b", this.#spriteGlyph(3, 8, 5, 5)],
    ["e", this.#spriteGlyph(3, 5, 8, 0)],
    [
      "f",
      this.#spriteGlyph(3, 8, 6, 9, {
        kerning: { " ": -1 },
        useExternalSpriteSheet: true,
      }),
    ],
    [
      "h",
      this.#spriteGlyph(3, 8, 0, 0, {
        kerning: { t: -1, T: -1 },
        useExternalSpriteSheet: true,
      }),
    ],
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
    ["q", this.#spriteGlyph(3, 8, 5, 8, { offsetY: this.descent })],
    ["r", this.#spriteGlyph(3, 5, 5, 0, { useExternalSpriteSheet: true })],
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
    ["x", this.#spriteGlyph(3, 5, 1, 8, { kerning: { o: 1 } })],
  ]);
}

export const customFont = new CustomFont();
