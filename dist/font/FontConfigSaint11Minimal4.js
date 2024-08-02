import { BpxPixels } from "../draw_api/Pixels";
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
//# sourceMappingURL=FontConfigSaint11Minimal4.js.map