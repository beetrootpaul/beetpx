import { BpxRgbColor } from "../color/RgbColor";
import { rgb_p8_ } from "../shorthands";
import { BpxSprite } from "../sprite/Sprite";
import { BpxFont, BpxGlyph } from "./Font";

// TODO: add a comment here and in README about the origin of this font and its CC-0 license
export class BpxFontPico8 extends BpxFont {
  static spriteSheetUrl = ".beetpx/pico-8-font.png";

  ascent = 5;
  descent = 0;
  lineGap = 1;

  spriteSheetUrls = [BpxFontPico8.spriteSheetUrl];

  protected isSpriteSheetTextColor(color: BpxRgbColor | null): boolean {
    return color?.cssHex === rgb_p8_.white.cssHex;
  }

  protected mapChar(char: string): string {
    return char.toLowerCase();
  }

  glyphs: Map<string, BpxGlyph> = new Map<string, BpxGlyph>([
    [" ", { type: "whitespace", advance: 4 }],
    //
    ["0", this.#spriteGlyph(0, 3)],
    ["1", this.#spriteGlyph(1, 3)],
    ["2", this.#spriteGlyph(2, 3)],
    ["3", this.#spriteGlyph(3, 3)],
    ["4", this.#spriteGlyph(4, 3)],
    ["5", this.#spriteGlyph(5, 3)],
    ["6", this.#spriteGlyph(6, 3)],
    ["7", this.#spriteGlyph(7, 3)],
    ["8", this.#spriteGlyph(8, 3)],
    //
    ["-", this.#spriteGlyph(13, 2)],
    ["+", this.#spriteGlyph(11, 2)],
    ["=", this.#spriteGlyph(13, 3)],
    //
    ["(", this.#spriteGlyph(8, 2)],
    [")", this.#spriteGlyph(9, 2)],
    ["[", this.#spriteGlyph(11, 5)],
    ["]", this.#spriteGlyph(13, 5)],
    ["{", this.#spriteGlyph(11, 7)],
    ["}", this.#spriteGlyph(13, 7)],
    ["<", this.#spriteGlyph(12, 3)],
    [">", this.#spriteGlyph(14, 3)],
    //
    ["~", this.#spriteGlyph(14, 7)],
    ["!", this.#spriteGlyph(1, 2)],
    ["?", this.#spriteGlyph(15, 3)],
    ["@", this.#spriteGlyph(0, 4)],
    ["#", this.#spriteGlyph(3, 2)],
    ["$", this.#spriteGlyph(4, 2)],
    ["%", this.#spriteGlyph(5, 2)],
    ["^", this.#spriteGlyph(14, 5)],
    ["&", this.#spriteGlyph(6, 2)],
    ["*", this.#spriteGlyph(10, 2)],
    ["_", this.#spriteGlyph(15, 5)],
    //
    [".", this.#spriteGlyph(14, 2)],
    [",", this.#spriteGlyph(12, 2)],
    [":", this.#spriteGlyph(10, 3)],
    [";", this.#spriteGlyph(11, 3)],
    //
    ["`", this.#spriteGlyph(0, 6)],
    ["'", this.#spriteGlyph(7, 2)],
    ['"', this.#spriteGlyph(2, 2)],
    //
    ["/", this.#spriteGlyph(15, 2)],
    ["|", this.#spriteGlyph(12, 7)],
    ["\\", this.#spriteGlyph(12, 5)],
    //
    ["a", this.#spriteGlyph(1, 6)],
    ["b", this.#spriteGlyph(2, 6)],
    ["c", this.#spriteGlyph(3, 6)],
    ["d", this.#spriteGlyph(4, 6)],
    ["e", this.#spriteGlyph(5, 6)],
    ["f", this.#spriteGlyph(6, 6)],
    ["g", this.#spriteGlyph(7, 6)],
    ["h", this.#spriteGlyph(8, 6)],
    ["i", this.#spriteGlyph(9, 6)],
    ["j", this.#spriteGlyph(10, 6)],
    ["k", this.#spriteGlyph(11, 6)],
    ["l", this.#spriteGlyph(12, 6)],
    ["m", this.#spriteGlyph(13, 6)],
    ["n", this.#spriteGlyph(14, 6)],
    ["o", this.#spriteGlyph(15, 6)],
    ["p", this.#spriteGlyph(0, 7)],
    ["q", this.#spriteGlyph(1, 7)],
    ["r", this.#spriteGlyph(2, 7)],
    ["s", this.#spriteGlyph(3, 7)],
    ["t", this.#spriteGlyph(4, 7)],
    ["u", this.#spriteGlyph(5, 7)],
    ["v", this.#spriteGlyph(6, 7)],
    ["w", this.#spriteGlyph(7, 7)],
    ["x", this.#spriteGlyph(8, 7)],
    ["y", this.#spriteGlyph(9, 7)],
    ["z", this.#spriteGlyph(10, 7)],
  ]);

  #spriteGlyph(tileX: number, tileY: number): BpxGlyph {
    const sprite = BpxSprite.from(
      BpxFontPico8.spriteSheetUrl,
      3,
      5,
      tileX * 8,
      tileY * 8,
    );
    return {
      type: "sprite",
      sprite: sprite,
      advance: sprite.size.x + 1,
    };
  }
}
