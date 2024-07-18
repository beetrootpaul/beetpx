var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BpxFontConfigSaint11Minimal4_instances, _BpxFontConfigSaint11Minimal4_pixelsGlyph;
import { BpxPixels } from "../draw_api/Pixels";
/**
 * A free to use (CC-0) font created by saint11 and distributed on https:
 *
 * Note: only a subset of characters is implemented here:
 *   . : ! ? ' " * / + -
 *   0 1 2 3 4 5 6 7 8 9
 *   % $ ( ) [ ] { } < >
 *   A B C D E F G H I J K L M
 *   N O P Q R S T U V W X Y Z
 *   a b c d e f g h i j k l m      (note: both upper- and lower-case
 *   n o p q r s t u v w x y z             characters use same glyphs)
 */
export class BpxFontConfigSaint11Minimal4 {
    constructor() {
        _BpxFontConfigSaint11Minimal4_instances.add(this);
        this.ascent = 4;
        this.descent = 0;
        this.lineGap = 2;
        this.glyphs = new Map([
            [
                " ",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ----
        ----
        ----
        ----
      `),
            ],
            [
                ".",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -
        -
        -
        #
      `),
            ],
            [
                ":",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #
        -
        -
        #
      `),
            ],
            [
                "!",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #
        #
        #
        -
        #
      `),
            ],
            [
                "?",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -#-
        #-#
        --#
        -#-
        -#-
      `),
            ],
            [
                "'",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #
        #
        -
        -
        -
      `),
            ],
            [
                '"',
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-#
        #-#
        ---
        ---
        ---
      `),
            ],
            [
                "*",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-#
        -#-
        #-#
        ---
      `),
            ],
            [
                "/",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        --#
        -#-
        -#-
        #--
      `),
            ],
            [
                "+",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ---
        -#-
        ###
        -#-
      `),
            ],
            [
                "-",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ---
        ---
        ###
        ---
      `),
            ],
            [
                "0",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -#-
        #-#
        #-#
        -#-
      `),
            ],
            [
                "1",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -#-
        ##-
        -#-
        -#-
      `),
            ],
            [
                "2",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ##-
        -##
        #--
        ###
      `),
            ],
            [
                "3",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ###
        -##
        --#
        ###
      `),
            ],
            [
                "4",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-#
        #-#
        ###
        --#
      `),
            ],
            [
                "5",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ###
        ##-
        --#
        ##-
      `),
            ],
            [
                "6",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -#-
        #--
        ###
        -#-
      `),
            ],
            [
                "7",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ###
        --#
        -#-
        #--
      `),
            ],
            [
                "8",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ###
        -#-
        #-#
        -#-
      `),
            ],
            [
                "9",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ###
        ###
        --#
        ##-
      `),
            ],
            [
                "%",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #--#
        --#-
        -#--
        #--#
      `),
            ],
            [
                "$",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -##
        ##-
        -##
        ##-
      `),
            ],
            [
                "(",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -#
        #-
        #-
        -#
      `),
            ],
            [
                ")",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-
        -#
        -#
        #-
      `),
            ],
            [
                "[",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ##
        #-
        #-
        ##
      `),
            ],
            [
                "]",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ##
        -#
        -#
        ##
      `),
            ],
            [
                "{",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -#
        ##
        ##
        -#
      `),
            ],
            [
                "}",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-
        ##
        ##
        #-
      `),
            ],
            [
                "<",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ---
        -##
        #--
        -##
      `),
            ],
            [
                ">",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ##-
        --#
        ##-
        ---
      `),
            ],
            [
                "a",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ##-
        #-#
        ###
        #-#
      `),
            ],
            [
                "b",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #--
        ##-
        #-#
        ###
      `),
            ],
            [
                "c",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -##
        #--
        #--
        -##
      `),
            ],
            [
                "d",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ##-
        #-#
        #-#
        ##-
      `),
            ],
            [
                "e",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ###
        ##-
        #--
        ###
      `),
            ],
            [
                "f",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ###
        #--
        ##-
        #--
      `),
            ],
            [
                "g",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -##
        #--
        #-#
        -##
      `),
            ],
            [
                "h",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #--
        ##-
        #-#
        #-#
      `),
            ],
            [
                "i",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #
        #
        #
        #
      `),
            ],
            [
                "j",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ##
        -#
        -#
        #-
      `),
            ],
            [
                "k",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-#
        ##-
        #-#
        #-#
      `),
            ],
            [
                "l",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-
        #-
        #-
        ##
      `),
            ],
            [
                "m",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-#
        ###
        #-#
        #-#
      `),
            ],
            [
                "n",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ##-
        #-#
        #-#
        #-#
      `),
            ],
            [
                "o",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -##
        #-#
        #-#
        ##-
      `),
            ],
            [
                "p",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ###
        #-#
        ##-
        #--
      `),
            ],
            [
                "q",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -#-
        #-#
        ###
        -#-
      `),
            ],
            [
                "r",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ##-
        #-#
        ##-
        #-#
      `),
            ],
            [
                "s",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        -##
        ##-
        --#
        ##-
      `),
            ],
            [
                "t",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ###
        -#-
        -#-
        -#-
      `),
            ],
            [
                "u",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-#
        #-#
        #-#
        ##-
      `),
            ],
            [
                "v",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-#
        #-#
        #-#
        -#-
      `),
            ],
            [
                "w",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-#
        #-#
        ###
        #-#
      `),
            ],
            [
                "x",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-#
        -#-
        #-#
        #-#
      `),
            ],
            [
                "y",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        #-#
        #-#
        -#-
        -#-
      `),
            ],
            [
                "z",
                __classPrivateFieldGet(this, _BpxFontConfigSaint11Minimal4_instances, "m", _BpxFontConfigSaint11Minimal4_pixelsGlyph).call(this, `
        ###
        -#-
        #--
        ###
      `),
            ],
        ]);
    }
    mapChar(char) {
        return char.toLowerCase();
    }
}
_BpxFontConfigSaint11Minimal4_instances = new WeakSet(), _BpxFontConfigSaint11Minimal4_pixelsGlyph = function _BpxFontConfigSaint11Minimal4_pixelsGlyph(ascii) {
    const pixels = BpxPixels.from(ascii);
    return {
        type: "pixels",
        pixels: pixels,
        advance: pixels.size.x + 1,
    };
};
