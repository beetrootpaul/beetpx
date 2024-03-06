import { spr_ } from "../sprite/Sprite";
import { BpxFont, BpxGlyph } from "./Font";

// TODO: update the name in README
// TODO: add a comment here and in README about the origin of this font and its CC-0 license
export class BpxFontPico8 extends BpxFont {
  ascent = 5;
  descent = 0;
  leading = 6;

  spriteSheetUrls = [".beetpx/pico-8-font.png"];

  getGlyphFor(char: string): BpxGlyph {
    switch (char.toLowerCase()) {
      case " ":
        return { type: "blank", advanceX: 4 };
      case "0":
        return this.#spriteGlyph(0, 3);
      case "1":
        return this.#spriteGlyph(1, 3);
      case "2":
        return this.#spriteGlyph(2, 3);
      case "3":
        return this.#spriteGlyph(3, 3);
      case "4":
        return this.#spriteGlyph(4, 3);
      case "5":
        return this.#spriteGlyph(5, 3);
      case "6":
        return this.#spriteGlyph(6, 3);
      case "7":
        return this.#spriteGlyph(7, 3);
      case "8":
        return this.#spriteGlyph(8, 3);
      case "9":
        return this.#spriteGlyph(9, 3);
      case "@":
        return this.#spriteGlyph(0, 4);
      case "?":
        return this.#spriteGlyph(15, 3);
      case "&":
        return this.#spriteGlyph(6, 2);
      case "/":
        return this.#spriteGlyph(15, 2);
      case ".":
        return this.#spriteGlyph(14, 2);
      case ":":
        return this.#spriteGlyph(10, 3);
      case "a":
        return this.#spriteGlyph(1, 6);
      case "b":
        return this.#spriteGlyph(2, 6);
      case "c":
        return this.#spriteGlyph(3, 6);
      case "d":
        return this.#spriteGlyph(4, 6);
      case "e":
        return this.#spriteGlyph(5, 6);
      case "f":
        return this.#spriteGlyph(6, 6);
      case "g":
        return this.#spriteGlyph(7, 6);
      case "h":
        return this.#spriteGlyph(8, 6);
      case "i":
        return this.#spriteGlyph(9, 6);
      case "j":
        return this.#spriteGlyph(10, 6);
      case "k":
        return this.#spriteGlyph(11, 6);
      case "l":
        return this.#spriteGlyph(12, 6);
      case "m":
        return this.#spriteGlyph(13, 6);
      case "n":
        return this.#spriteGlyph(14, 6);
      case "o":
        return this.#spriteGlyph(15, 6);
      case "p":
        return this.#spriteGlyph(0, 7);
      case "q":
        return this.#spriteGlyph(1, 7);
      case "r":
        return this.#spriteGlyph(2, 7);
      case "s":
        return this.#spriteGlyph(3, 7);
      case "t":
        return this.#spriteGlyph(4, 7);
      case "u":
        return this.#spriteGlyph(5, 7);
      case "v":
        return this.#spriteGlyph(6, 7);
      case "w":
        return this.#spriteGlyph(7, 7);
      case "x":
        return this.#spriteGlyph(8, 7);
      case "y":
        return this.#spriteGlyph(9, 7);
      case "z":
        return this.#spriteGlyph(10, 7);
      default:
        return { type: "none" };
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
}

export const font_pico8_ = new BpxFontPico8();
