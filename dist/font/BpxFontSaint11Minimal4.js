var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BpxFontSaint11Minimal4_unknownCharSprite, _BpxFontSaint11Minimal4_sprites;
import { BpxPixels } from "../draw_api/Pixels";
import { v_0_0_ } from "../misc/Vector2d";
/**
 * A free to use font created by saint11 and distributed on https:
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
export class BpxFontSaint11Minimal4 {
    constructor() {
        _BpxFontSaint11Minimal4_unknownCharSprite.set(this, BpxPixels.from(`
    ###
    ###
    ###
    ###
  `));
        _BpxFontSaint11Minimal4_sprites.set(this, {
            " ": BpxPixels.from(`
      ----
      ----
      ----
      ----
    `),
            ".": BpxPixels.from(`
      -
      -
      -
      #
    `),
            ":": BpxPixels.from(`
      #
      -
      -
      #
    `),
            "!": BpxPixels.from(`
      #
      #
      #
      -
      #
    `),
            "?": BpxPixels.from(`
      -#-
      #-#
      --#
      -#-
      -#-
    `),
            "'": BpxPixels.from(`
      #
      #
      -
      -
      -
    `),
            '"': BpxPixels.from(`
      #-#
      #-#
      ---
      ---
      ---
    `),
            "*": BpxPixels.from(`
      #-#
      -#-
      #-#
      ---
    `),
            "/": BpxPixels.from(`
      --#
      -#-
      -#-
      #--
    `),
            "+": BpxPixels.from(`
      ---
      -#-
      ###
      -#-
    `),
            "-": BpxPixels.from(`
      ---
      ---
      ###
      ---
    `),
            0: BpxPixels.from(`
      -#-
      #-#
      #-#
      -#-
    `),
            1: BpxPixels.from(`
      -#-
      ##-
      -#-
      -#-
    `),
            2: BpxPixels.from(`
      ##-
      -##
      #--
      ###
    `),
            3: BpxPixels.from(`
      ###
      -##
      --#
      ###
    `),
            4: BpxPixels.from(`
      #-#
      #-#
      ###
      --#
    `),
            5: BpxPixels.from(`
      ###
      ##-
      --#
      ##-
    `),
            6: BpxPixels.from(`
      -#-
      #--
      ###
      -#-
    `),
            7: BpxPixels.from(`
      ###
      --#
      -#-
      #--
    `),
            8: BpxPixels.from(`
      ###
      -#-
      #-#
      -#-
    `),
            9: BpxPixels.from(`
      ###
      ###
      --#
      ##-
    `),
            "%": BpxPixels.from(`
      #--#
      --#-
      -#--
      #--#
    `),
            $: BpxPixels.from(`
      -##
      ##-
      -##
      ##-
    `),
            "(": BpxPixels.from(`
      -#
      #-
      #-
      -#
    `),
            ")": BpxPixels.from(`
      #-
      -#
      -#
      #-
    `),
            "[": BpxPixels.from(`
      ##
      #-
      #-
      ##
    `),
            "]": BpxPixels.from(`
      ##
      -#
      -#
      ##
    `),
            "{": BpxPixels.from(`
      -#
      ##
      ##
      -#
    `),
            "}": BpxPixels.from(`
      #-
      ##
      ##
      #-
    `),
            "<": BpxPixels.from(`
      ---
      -##
      #--
      -##
    `),
            ">": BpxPixels.from(`
      ##-
      --#
      ##-
      ---
    `),
            a: BpxPixels.from(`
      ##-
      #-#
      ###
      #-#
    `),
            b: BpxPixels.from(`
      #--
      ##-
      #-#
      ###
    `),
            c: BpxPixels.from(`
      -##
      #--
      #--
      -##
    `),
            d: BpxPixels.from(`
      ##-
      #-#
      #-#
      ##-
    `),
            e: BpxPixels.from(`
      ###
      ##-
      #--
      ###
    `),
            f: BpxPixels.from(`
      ###
      #--
      ##-
      #--
    `),
            g: BpxPixels.from(`
      -##
      #--
      #-#
      -##
    `),
            h: BpxPixels.from(`
      #--
      ##-
      #-#
      #-#
    `),
            i: BpxPixels.from(`
      #
      #
      #
      #
    `),
            j: BpxPixels.from(`
      ##
      -#
      -#
      #-
    `),
            k: BpxPixels.from(`
      #-#
      ##-
      #-#
      #-#
    `),
            l: BpxPixels.from(`
      #-
      #-
      #-
      ##
    `),
            m: BpxPixels.from(`
      #-#
      ###
      #-#
      #-#
    `),
            n: BpxPixels.from(`
      ##-
      #-#
      #-#
      #-#
    `),
            o: BpxPixels.from(`
      -##
      #-#
      #-#
      ##-
    `),
            p: BpxPixels.from(`
      ###
      #-#
      ##-
      #--
    `),
            q: BpxPixels.from(`
      -#-
      #-#
      ###
      -#-
    `),
            r: BpxPixels.from(`
      ##-
      #-#
      ##-
      #-#
    `),
            s: BpxPixels.from(`
      -##
      ##-
      --#
      ##-
    `),
            t: BpxPixels.from(`
      ###
      -#-
      -#-
      -#-
    `),
            u: BpxPixels.from(`
      #-#
      #-#
      #-#
      ##-
    `),
            v: BpxPixels.from(`
      #-#
      #-#
      #-#
      -#-
    `),
            w: BpxPixels.from(`
      #-#
      #-#
      ###
      #-#
    `),
            x: BpxPixels.from(`
      #-#
      -#-
      #-#
      #-#
    `),
            y: BpxPixels.from(`
      #-#
      #-#
      -#-
      -#-
    `),
            z: BpxPixels.from(`
      ###
      -#-
      #--
      ###
    `),
        });
        this.id = BpxFontSaint11Minimal4.id;
        this.imageUrl = null;
    }
    spritesFor(text) {
        const charSprites = [];
        let positionInText = v_0_0_;
        for (let i = 0; i < text.length; i += 1) {
            let char = text[i].toLowerCase();
            let sprite = __classPrivateFieldGet(this, _BpxFontSaint11Minimal4_sprites, "f")[char] ?? __classPrivateFieldGet(this, _BpxFontSaint11Minimal4_unknownCharSprite, "f");
            if (sprite.wh.y > 4) {
                positionInText = positionInText.sub(0, 1);
            }
            charSprites.push({
                char,
                positionInText,
                type: "pixels",
                pixels: sprite,
            });
            const jumpX = sprite.wh.x + 1;
            positionInText = positionInText.add(jumpX, 0);
            if (sprite.wh.y > 4) {
                positionInText = positionInText.add(0, 1);
            }
        }
        return charSprites;
    }
}
_BpxFontSaint11Minimal4_unknownCharSprite = new WeakMap(), _BpxFontSaint11Minimal4_sprites = new WeakMap();
BpxFontSaint11Minimal4.id = "__internal__saint11_Minimal4";
