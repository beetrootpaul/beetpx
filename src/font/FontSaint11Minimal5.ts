import { BpxPixels } from "../draw_api/Pixels";
import { BpxFont, BpxGlyph } from "./Font";

/**
 * A free to use (CC-0) font created by saint11 and distributed on https://saint11.org/blog/fonts/
 *
 * Note: only a subset of characters is implemented here:
 *   . : ! ? ' " * / + -
 *   0 1 2 3 4 5 6 7 8 9
 *   % $ ( ) [ ] { } < >
 *   A B C D E F G H I J K L M
 *   N O P Q R S T U V W X Y Z
 *   a b c d e f g h i j k l m
 *   n o p q r s t u v w x y z
 */
// TODO: update the name in README
export class BpxFontSaint11Minimal5 extends BpxFont {
  ascent = 6;
  descent = 2;
  leading = 6;

  spriteSheetUrls = [];

  getGlyphFor(char: string): BpxGlyph {
    switch (char) {
      case " ":
        return this.#pixelsGlyph(`
          ----
          ----
          ----
          ----
          ----
        `);
      case ".":
        return this.#pixelsGlyph(`
          --
          --
          --
          ##
          ##
        `);
      case ":":
        return this.#pixelsGlyph(`
          #
          -
          -
          #
          -
        `);
      case "!":
        return this.#pixelsGlyph(`
          ###
          ###
          -#-
          ---
          -#-
        `);
      case "?":
        return this.#pixelsGlyph(`
          ###
          --#
          -#-
          ---
          -#-
        `);
      case "'":
        return this.#pixelsGlyph(`
          -
          #
          #
          -
          -
        `);
      case '"':
        return this.#pixelsGlyph(`
          #-#
          #-#
          ---
          ---
          ---
        `);
      case "*":
        return this.#pixelsGlyph(`
          --
          ##
          ##
          --
          --
        `);
      case "/":
        return this.#pixelsGlyph(`
          --#
          --#
          -#-
          #--
          #--
        `);
      case "+":
        return this.#pixelsGlyph(`
          ---
          -#-
          ###
          -#-
          ---
        `);
      case "-":
        return this.#pixelsGlyph(`
          ---
          ---
          ###
          ---
          ---
        `);
      case "0":
        return this.#pixelsGlyph(`
          -#-
          #-#
          #-#
          #-#
          -#-
        `);
      case "1":
        return this.#pixelsGlyph(`
          -#-
          ##-
          -#-
          -#-
          ###
        `);
      case "2":
        return this.#pixelsGlyph(`
          -#-
          #-#
          --#
          -#-
          ###
        `);
      case "3":
        return this.#pixelsGlyph(`
          ###
          --#
          -##
          --#
          ##-
        `);
      case "4":
        return this.#pixelsGlyph(`
          --#
          -##
          #-#
          ###
          --#
        `);
      case "5":
        return this.#pixelsGlyph(`
          ###
          #--
          ###
          --#
          ##-
        `);
      case "6":
        return this.#pixelsGlyph(`
          ###
          #--
          ###
          #-#
          ###
        `);
      case "7":
        return this.#pixelsGlyph(`
          ###
          --#
          -#-
          -#-
          -#-
        `);
      case "8":
        return this.#pixelsGlyph(`
          ###
          #-#
          -#-
          #-#
          ###
        `);
      case "9":
        return this.#pixelsGlyph(`
          ###
          #-#
          ###
          --#
          ###
        `);
      case "%":
        return this.#pixelsGlyph(`
          #-#
          --#
          -#-
          #--
          #-#
        `);
      case "$":
        return this.#pixelsGlyph(`
          ###
          ##-
          -##
          ###
          -#-
        `);
      case "(":
        return this.#pixelsGlyph(`
          -#
          #-
          #-
          #-
          -#
        `);
      case ")":
        return this.#pixelsGlyph(`
          #-
          -#
          -#
          -#
          #-
        `);
      case "[":
        return this.#pixelsGlyph(`
          ##
          #-
          #-
          #-
          ##
        `);
      case "]":
        return this.#pixelsGlyph(`
          ##
          -#
          -#
          -#
          ##
        `);
      case "{":
        return this.#pixelsGlyph(`
          -##
          -#-
          #--
          -#-
          -##
        `);
      case "}":
        return this.#pixelsGlyph(`
          ##-
          -#-
          --#
          -#-
          ##-
        `);
      case "<":
        return this.#pixelsGlyph(`
          --#
          -#-
          #--
          -#-
          --#
        `);
      case ">":
        return this.#pixelsGlyph(`
          #--
          -#-
          --#
          -#-
          #--
        `);
      case "A":
        return this.#pixelsGlyph(`
          -#-
          #-#
          ###
          #-#
          #-#
        `);
      case "B":
        return this.#pixelsGlyph(`
          ##-
          #-#
          ##-
          #-#
          ###
        `);
      case "C":
        return this.#pixelsGlyph(`
          -#-
          #-#
          #--
          #-#
          -#-
        `);
      case "D":
        return this.#pixelsGlyph(`
          ##-
          #-#
          #-#
          #-#
          ##-
        `);
      case "E":
        return this.#pixelsGlyph(`
          ###
          #--
          ##-
          #--
          ###
        `);
      case "F":
        return this.#pixelsGlyph(`
          ###
          #--
          ##-
          #--
          #--
        `);
      case "G":
        return this.#pixelsGlyph(`
          -#-
          #-#
          #--
          #-#
          -##
        `);
      case "H":
        return this.#pixelsGlyph(`
          #-#
          #-#
          ###
          #-#
          #-#
        `);
      case "I":
        return this.#pixelsGlyph(`
          ###
          -#-
          -#-
          -#-
          ###
        `);
      case "J":
        return this.#pixelsGlyph(`
          --#
          --#
          --#
          #-#
          -#-
        `);
      case "K":
        return this.#pixelsGlyph(`
          #-#
          #-#
          ##-
          #-#
          #-#
        `);
      case "L":
        return this.#pixelsGlyph(`
          #--
          #--
          #--
          #--
          ###
        `);
      case "M":
        return this.#pixelsGlyph(`
          #-#
          ###
          ###
          #-#
          #-#
        `);
      case "N":
        return this.#pixelsGlyph(`
          ##-
          ###
          #-#
          #-#
          #-#
        `);
      case "O":
        return this.#pixelsGlyph(`
          -#-
          #-#
          #-#
          #-#
          -#-
        `);
      case "P":
        return this.#pixelsGlyph(`
          ##-
          #-#
          ###
          #--
          #--
        `);
      case "Q":
        return this.#pixelsGlyph(`
          -#-
          #-#
          #-#
          ###
          -##
        `);
      case "R":
        return this.#pixelsGlyph(`
          ##-
          #-#
          ##-
          #-#
          #-#
        `);
      case "S":
        return this.#pixelsGlyph(`
          ###
          #--
          -#-
          --#
          ##-
        `);
      case "T":
        return this.#pixelsGlyph(`
          ###
          -#-
          -#-
          -#-
          -#-
        `);
      case "U":
        return this.#pixelsGlyph(`
          #-#
          #-#
          #-#
          #-#
          ###
        `);
      case "V":
        return this.#pixelsGlyph(`
          #-#
          #-#
          #-#
          -#-
          -#-
        `);
      case "W":
        return this.#pixelsGlyph(`
          #-#
          #-#
          ###
          ###
          #-#
        `);
      case "X":
        return this.#pixelsGlyph(`
          #-#
          #-#
          -#-
          #-#
          #-#
        `);
      case "Y":
        return this.#pixelsGlyph(`
          #-#
          #-#
          -#-
          -#-
          -#-
        `);
      case "Z":
        return this.#pixelsGlyph(`
          ###
          --#
          -#-
          #--
          ###
        `);
      case "a":
        return this.#pixelsGlyph(`
          -#-
          #-#
          #-#
          ###
          #-#
        `);
      case "b":
        return this.#pixelsGlyph(`
          #--
          #--
          ##-
          #-#
          ##-
        `);
      case "c":
        return this.#pixelsGlyph(`
          -##
          #--
          #--
          #--
          -##
        `);
      case "d":
        return this.#pixelsGlyph(`
          --#
          --#
          -##
          #-#
          ###
        `);
      case "e":
        return this.#pixelsGlyph(`
          -#-
          #-#
          ###
          #--
          -##
        `);
      case "f":
        return this.#pixelsGlyph(`
          -##
          -#-
          ###
          -#-
          -#-
        `);
      case "g":
        return this.#pixelsGlyph(`
          -#-
          #-#
          #--
          #-#
          -##
        `);
      case "h":
        return this.#pixelsGlyph(`
          #--
          #--
          ##-
          #-#
          #-#
        `);
      case "i":
        return this.#pixelsGlyph(`
          -#
          --
          -#
          -#
          -#
        `);
      case "j":
        return this.#pixelsGlyph(`
          -##
          --#
          --#
          #-#
          -#-
        `);
      case "k":
        return this.#pixelsGlyph(`
          #-#
          #-#
          ##-
          #-#
          #-#
        `);
      case "l":
        return this.#pixelsGlyph(`
          #
          #
          #
          #
          #
        `);
      case "m":
        return this.#pixelsGlyph(`
          #-#
          ###
          ###
          #-#
          #-#
        `);
      case "n":
        return this.#pixelsGlyph(`
          ##-
          #-#
          #-#
          #-#
          #-#
        `);
      case "o":
        return this.#pixelsGlyph(`
          -#-
          #-#
          #-#
          #-#
          -#-
        `);
      case "p":
        return this.#pixelsGlyph(`
          ##-
          #-#
          ###
          #--
          #--
        `);
      case "q":
        return this.#pixelsGlyph(`
          -#-
          #-#
          #-#
          ###
          -##
        `);
      case "r":
        return this.#pixelsGlyph(`
          -#-
          #-#
          #--
          #--
          #--
        `);
      case "s":
        return this.#pixelsGlyph(`
          -##
          #--
          -#-
          --#
          ##-
        `);
      case "t":
        return this.#pixelsGlyph(`
          -#-
          ###
          -#-
          -#-
          -##
        `);
      case "u":
        return this.#pixelsGlyph(`
          #-#
          #-#
          #-#
          #-#
          -#-
        `);
      case "v":
        return this.#pixelsGlyph(`
          #-#
          #-#
          #-#
          -#-
          -#-
        `);
      case "w":
        return this.#pixelsGlyph(`
          #-#
          #-#
          ###
          ###
          #-#
        `);
      case "x":
        return this.#pixelsGlyph(`
          #-#
          #-#
          -#-
          #-#
          #-#
        `);
      case "y":
        return this.#pixelsGlyph(`
          #-#
          #-#
          -#-
          -#-
          -#-
        `);
      case "z":
        return this.#pixelsGlyph(`
          ###
          --#
          -#-
          #--
          ###
        `);
      default:
        return { type: "none" };
    }
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

export const font_saint11Minimal5_ = new BpxFontSaint11Minimal5();
