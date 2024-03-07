var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BpxFontSaint11Minimal5_instances, _BpxFontSaint11Minimal5_pixelsGlyph;
import { BpxPixels } from "../draw_api/Pixels";
import { BpxFont } from "./Font";
/**
 * A free to use (CC-0) font created by saint11 and distributed on https:
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
export class BpxFontSaint11Minimal5 extends BpxFont {
    constructor() {
        super(...arguments);
        _BpxFontSaint11Minimal5_instances.add(this);
        this.ascent = 5;
        this.descent = 0;
        this.lineGap = 2;
        this.spriteSheetUrls = [];
        this.glyphs = new Map([
            [
                " ",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ----
        ----
        ----
        ----
        ----
      `),
            ],
            [
                ".",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        --
        --
        --
        ##
        ##
      `),
            ],
            [
                ":",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #
        -
        -
        #
        -
      `),
            ],
            [
                "!",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        ###
        -#-
        ---
        -#-
      `),
            ],
            [
                "?",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        --#
        -#-
        ---
        -#-
      `),
            ],
            [
                "'",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -
        #
        #
        -
        -
      `),
            ],
            [
                '"',
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        ---
        ---
        ---
      `),
            ],
            [
                "*",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        --
        ##
        ##
        --
        --
      `),
            ],
            [
                "/",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        --#
        --#
        -#-
        #--
        #--
      `),
            ],
            [
                "+",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ---
        -#-
        ###
        -#-
        ---
      `),
            ],
            [
                "-",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ---
        ---
        ###
        ---
        ---
      `),
            ],
            [
                "0",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        #-#
        #-#
        -#-
      `),
            ],
            [
                "1",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        ##-
        -#-
        -#-
        ###
      `),
            ],
            [
                "2",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        --#
        -#-
        ###
      `),
            ],
            [
                "3",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        --#
        -##
        --#
        ##-
      `),
            ],
            [
                "4",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        --#
        -##
        #-#
        ###
        --#
      `),
            ],
            [
                "5",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        #--
        ###
        --#
        ##-
      `),
            ],
            [
                "6",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        #--
        ###
        #-#
        ###
      `),
            ],
            [
                "7",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        --#
        -#-
        -#-
        -#-
      `),
            ],
            [
                "8",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        #-#
        -#-
        #-#
        ###
      `),
            ],
            [
                "9",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        #-#
        ###
        --#
        ###
      `),
            ],
            [
                "%",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        --#
        -#-
        #--
        #-#
      `),
            ],
            [
                "$",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        ##-
        -##
        ###
        -#-
      `),
            ],
            [
                "(",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#
        #-
        #-
        #-
        -#
      `),
            ],
            [
                ")",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-
        -#
        -#
        -#
        #-
      `),
            ],
            [
                "[",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ##
        #-
        #-
        #-
        ##
      `),
            ],
            [
                "]",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ##
        -#
        -#
        -#
        ##
      `),
            ],
            [
                "{",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -##
        -#-
        #--
        -#-
        -##
      `),
            ],
            [
                "}",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ##-
        -#-
        --#
        -#-
        ##-
      `),
            ],
            [
                "<",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        --#
        -#-
        #--
        -#-
        --#
      `),
            ],
            [
                ">",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #--
        -#-
        --#
        -#-
        #--
      `),
            ],
            [
                "A",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        ###
        #-#
        #-#
      `),
            ],
            [
                "B",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ##-
        #-#
        ##-
        #-#
        ###
      `),
            ],
            [
                "C",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        #--
        #-#
        -#-
      `),
            ],
            [
                "D",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ##-
        #-#
        #-#
        #-#
        ##-
      `),
            ],
            [
                "E",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        #--
        ##-
        #--
        ###
      `),
            ],
            [
                "F",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        #--
        ##-
        #--
        #--
      `),
            ],
            [
                "G",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        #--
        #-#
        -##
      `),
            ],
            [
                "H",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        ###
        #-#
        #-#
      `),
            ],
            [
                "I",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        -#-
        -#-
        -#-
        ###
      `),
            ],
            [
                "J",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        --#
        --#
        --#
        #-#
        -#-
      `),
            ],
            [
                "K",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        ##-
        #-#
        #-#
      `),
            ],
            [
                "L",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #--
        #--
        #--
        #--
        ###
      `),
            ],
            [
                "M",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        ###
        ###
        #-#
        #-#
      `),
            ],
            [
                "N",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ##-
        ###
        #-#
        #-#
        #-#
      `),
            ],
            [
                "O",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        #-#
        #-#
        -#-
      `),
            ],
            [
                "P",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ##-
        #-#
        ###
        #--
        #--
      `),
            ],
            [
                "Q",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        #-#
        ###
        -##
      `),
            ],
            [
                "R",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ##-
        #-#
        ##-
        #-#
        #-#
      `),
            ],
            [
                "S",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        #--
        -#-
        --#
        ##-
      `),
            ],
            [
                "T",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        -#-
        -#-
        -#-
        -#-
      `),
            ],
            [
                "U",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        #-#
        #-#
        ###
      `),
            ],
            [
                "V",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        #-#
        -#-
        -#-
      `),
            ],
            [
                "W",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        ###
        ###
        #-#
      `),
            ],
            [
                "X",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        -#-
        #-#
        #-#
      `),
            ],
            [
                "Y",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        -#-
        -#-
        -#-
      `),
            ],
            [
                "Z",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        --#
        -#-
        #--
        ###
      `),
            ],
            [
                "a",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        #-#
        ###
        #-#
      `),
            ],
            [
                "b",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #--
        #--
        ##-
        #-#
        ##-
      `),
            ],
            [
                "c",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -##
        #--
        #--
        #--
        -##
      `),
            ],
            [
                "d",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        --#
        --#
        -##
        #-#
        ###
      `),
            ],
            [
                "e",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        ###
        #--
        -##
      `),
            ],
            [
                "f",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -##
        -#-
        ###
        -#-
        -#-
      `),
            ],
            [
                "g",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        #--
        #-#
        -##
      `),
            ],
            [
                "h",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #--
        #--
        ##-
        #-#
        #-#
      `),
            ],
            [
                "i",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#
        --
        -#
        -#
        -#
      `),
            ],
            [
                "j",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -##
        --#
        --#
        #-#
        -#-
      `),
            ],
            [
                "k",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        ##-
        #-#
        #-#
      `),
            ],
            [
                "l",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #
        #
        #
        #
        #
      `),
            ],
            [
                "m",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        ###
        ###
        #-#
        #-#
      `),
            ],
            [
                "n",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ##-
        #-#
        #-#
        #-#
        #-#
      `),
            ],
            [
                "o",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        #-#
        #-#
        -#-
      `),
            ],
            [
                "p",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ##-
        #-#
        ###
        #--
        #--
      `),
            ],
            [
                "q",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        #-#
        ###
        -##
      `),
            ],
            [
                "r",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        #-#
        #--
        #--
        #--
      `),
            ],
            [
                "s",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -##
        #--
        -#-
        --#
        ##-
      `),
            ],
            [
                "t",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        -#-
        ###
        -#-
        -#-
        -##
      `),
            ],
            [
                "u",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        #-#
        #-#
        -#-
      `),
            ],
            [
                "v",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        #-#
        -#-
        -#-
      `),
            ],
            [
                "w",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        ###
        ###
        #-#
      `),
            ],
            [
                "x",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        -#-
        #-#
        #-#
      `),
            ],
            [
                "y",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        #-#
        #-#
        -#-
        -#-
        -#-
      `),
            ],
            [
                "z",
                __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_instances, "m", _BpxFontSaint11Minimal5_pixelsGlyph).call(this, `
        ###
        --#
        -#-
        #--
        ###
      `),
            ],
        ]);
    }
    isSpriteSheetTextColor(color) {
        return true;
    }
    mapChar(char) {
        return char;
    }
}
_BpxFontSaint11Minimal5_instances = new WeakSet(), _BpxFontSaint11Minimal5_pixelsGlyph = function _BpxFontSaint11Minimal5_pixelsGlyph(ascii) {
    const pixels = BpxPixels.from(ascii);
    return {
        type: "pixels",
        pixels: pixels,
        advance: pixels.size.x + 1,
    };
};
