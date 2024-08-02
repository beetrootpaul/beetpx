import { BpxPixels } from "../draw_api/Pixels";
/**
 * A free to use (CC-0) font created by saint11 and distributed on https:
 *
 * Note: only a subset of characters is implemented here:
 * ```
 * . : ! ? ' " * / + -
 * 0 1 2 3 4 5 6 7 8 9
 * % $ ( ) [ ] { } < >
 * A B C D E F G H I J K L M
 * N O P Q R S T U V W X Y Z
 * a b c d e f g h i j k l m      (note: both upper- and lower-case
 * n o p q r s t u v w x y z             characters use same glyphs)
 * ```
 * @category Fonts
 */
export class BpxFontConfigSaint11Minimal4 {
    ascent = 4;
    descent = 0;
    lineGap = 2;
    mapGrapheme(grapheme) {
        return grapheme.toLowerCase();
    }
    #pixelsGlyph(ascii) {
        const pixels = BpxPixels.from(ascii);
        return {
            type: "pixels",
            pixels: pixels,
            advance: pixels.size.x + 1,
        };
    }
    glyphs = new Map([
        [
            " ",
            this.#pixelsGlyph(`
        ----
        ----
        ----
        ----
      `),
        ],
        [
            ".",
            this.#pixelsGlyph(`
        -
        -
        -
        #
      `),
        ],
        [
            ":",
            this.#pixelsGlyph(`
        #
        -
        -
        #
      `),
        ],
        [
            "!",
            this.#pixelsGlyph(`
        #
        #
        #
        -
        #
      `),
        ],
        [
            "?",
            this.#pixelsGlyph(`
        -#-
        #-#
        --#
        -#-
        -#-
      `),
        ],
        [
            "'",
            this.#pixelsGlyph(`
        #
        #
        -
        -
        -
      `),
        ],
        [
            '"',
            this.#pixelsGlyph(`
        #-#
        #-#
        ---
        ---
        ---
      `),
        ],
        [
            "*",
            this.#pixelsGlyph(`
        #-#
        -#-
        #-#
        ---
      `),
        ],
        [
            "/",
            this.#pixelsGlyph(`
        --#
        -#-
        -#-
        #--
      `),
        ],
        [
            "+",
            this.#pixelsGlyph(`
        ---
        -#-
        ###
        -#-
      `),
        ],
        [
            "-",
            this.#pixelsGlyph(`
        ---
        ---
        ###
        ---
      `),
        ],
        [
            "0",
            this.#pixelsGlyph(`
        -#-
        #-#
        #-#
        -#-
      `),
        ],
        [
            "1",
            this.#pixelsGlyph(`
        -#-
        ##-
        -#-
        -#-
      `),
        ],
        [
            "2",
            this.#pixelsGlyph(`
        ##-
        -##
        #--
        ###
      `),
        ],
        [
            "3",
            this.#pixelsGlyph(`
        ###
        -##
        --#
        ###
      `),
        ],
        [
            "4",
            this.#pixelsGlyph(`
        #-#
        #-#
        ###
        --#
      `),
        ],
        [
            "5",
            this.#pixelsGlyph(`
        ###
        ##-
        --#
        ##-
      `),
        ],
        [
            "6",
            this.#pixelsGlyph(`
        -#-
        #--
        ###
        -#-
      `),
        ],
        [
            "7",
            this.#pixelsGlyph(`
        ###
        --#
        -#-
        #--
      `),
        ],
        [
            "8",
            this.#pixelsGlyph(`
        ###
        -#-
        #-#
        -#-
      `),
        ],
        [
            "9",
            this.#pixelsGlyph(`
        ###
        ###
        --#
        ##-
      `),
        ],
        [
            "%",
            this.#pixelsGlyph(`
        #--#
        --#-
        -#--
        #--#
      `),
        ],
        [
            "$",
            this.#pixelsGlyph(`
        -##
        ##-
        -##
        ##-
      `),
        ],
        [
            "(",
            this.#pixelsGlyph(`
        -#
        #-
        #-
        -#
      `),
        ],
        [
            ")",
            this.#pixelsGlyph(`
        #-
        -#
        -#
        #-
      `),
        ],
        [
            "[",
            this.#pixelsGlyph(`
        ##
        #-
        #-
        ##
      `),
        ],
        [
            "]",
            this.#pixelsGlyph(`
        ##
        -#
        -#
        ##
      `),
        ],
        [
            "{",
            this.#pixelsGlyph(`
        -#
        ##
        ##
        -#
      `),
        ],
        [
            "}",
            this.#pixelsGlyph(`
        #-
        ##
        ##
        #-
      `),
        ],
        [
            "<",
            this.#pixelsGlyph(`
        ---
        -##
        #--
        -##
      `),
        ],
        [
            ">",
            this.#pixelsGlyph(`
        ##-
        --#
        ##-
        ---
      `),
        ],
        [
            "a",
            this.#pixelsGlyph(`
        ##-
        #-#
        ###
        #-#
      `),
        ],
        [
            "b",
            this.#pixelsGlyph(`
        #--
        ##-
        #-#
        ###
      `),
        ],
        [
            "c",
            this.#pixelsGlyph(`
        -##
        #--
        #--
        -##
      `),
        ],
        [
            "d",
            this.#pixelsGlyph(`
        ##-
        #-#
        #-#
        ##-
      `),
        ],
        [
            "e",
            this.#pixelsGlyph(`
        ###
        ##-
        #--
        ###
      `),
        ],
        [
            "f",
            this.#pixelsGlyph(`
        ###
        #--
        ##-
        #--
      `),
        ],
        [
            "g",
            this.#pixelsGlyph(`
        -##
        #--
        #-#
        -##
      `),
        ],
        [
            "h",
            this.#pixelsGlyph(`
        #--
        ##-
        #-#
        #-#
      `),
        ],
        [
            "i",
            this.#pixelsGlyph(`
        #
        #
        #
        #
      `),
        ],
        [
            "j",
            this.#pixelsGlyph(`
        ##
        -#
        -#
        #-
      `),
        ],
        [
            "k",
            this.#pixelsGlyph(`
        #-#
        ##-
        #-#
        #-#
      `),
        ],
        [
            "l",
            this.#pixelsGlyph(`
        #-
        #-
        #-
        ##
      `),
        ],
        [
            "m",
            this.#pixelsGlyph(`
        #-#
        ###
        #-#
        #-#
      `),
        ],
        [
            "n",
            this.#pixelsGlyph(`
        ##-
        #-#
        #-#
        #-#
      `),
        ],
        [
            "o",
            this.#pixelsGlyph(`
        -##
        #-#
        #-#
        ##-
      `),
        ],
        [
            "p",
            this.#pixelsGlyph(`
        ###
        #-#
        ##-
        #--
      `),
        ],
        [
            "q",
            this.#pixelsGlyph(`
        -#-
        #-#
        ###
        -#-
      `),
        ],
        [
            "r",
            this.#pixelsGlyph(`
        ##-
        #-#
        ##-
        #-#
      `),
        ],
        [
            "s",
            this.#pixelsGlyph(`
        -##
        ##-
        --#
        ##-
      `),
        ],
        [
            "t",
            this.#pixelsGlyph(`
        ###
        -#-
        -#-
        -#-
      `),
        ],
        [
            "u",
            this.#pixelsGlyph(`
        #-#
        #-#
        #-#
        ##-
      `),
        ],
        [
            "v",
            this.#pixelsGlyph(`
        #-#
        #-#
        #-#
        -#-
      `),
        ],
        [
            "w",
            this.#pixelsGlyph(`
        #-#
        #-#
        ###
        #-#
      `),
        ],
        [
            "x",
            this.#pixelsGlyph(`
        #-#
        -#-
        #-#
        #-#
      `),
        ],
        [
            "y",
            this.#pixelsGlyph(`
        #-#
        #-#
        -#-
        -#-
      `),
        ],
        [
            "z",
            this.#pixelsGlyph(`
        ###
        -#-
        #--
        ###
      `),
        ],
    ]);
}
