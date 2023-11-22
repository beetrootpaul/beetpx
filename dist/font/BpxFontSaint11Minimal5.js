"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BpxFontSaint11Minimal5_unknownCharSprite, _BpxFontSaint11Minimal5_sprites;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpxFontSaint11Minimal5 = void 0;
const Pixels_1 = require("../draw_api/Pixels");
const Vector2d_1 = require("../misc/Vector2d");
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
class BpxFontSaint11Minimal5 {
    constructor() {
        _BpxFontSaint11Minimal5_unknownCharSprite.set(this, Pixels_1.BpxPixels.from(`
    ###
    ###
    ###
    ###
    ###
  `));
        _BpxFontSaint11Minimal5_sprites.set(this, {
            " ": Pixels_1.BpxPixels.from(`
      ----
      ----
      ----
      ----
      ----
    `),
            ".": Pixels_1.BpxPixels.from(`
      --
      --
      --
      ##
      ##
    `),
            ":": Pixels_1.BpxPixels.from(`
      #
      -
      -
      #
      -
    `),
            "!": Pixels_1.BpxPixels.from(`
      ###
      ###
      -#-
      ---
      -#-
    `),
            "?": Pixels_1.BpxPixels.from(`
      ###
      --#
      -#-
      ---
      -#-
    `),
            "'": Pixels_1.BpxPixels.from(`
      -
      #
      #
      -
      -
    `),
            '"': Pixels_1.BpxPixels.from(`
      #-#
      #-#
      ---
      ---
      ---
    `),
            "*": Pixels_1.BpxPixels.from(`
      --
      ##
      ##
      --
      --
    `),
            "/": Pixels_1.BpxPixels.from(`
      --#
      --#
      -#-
      #--
      #--
    `),
            "+": Pixels_1.BpxPixels.from(`
      ---
      -#-
      ###
      -#-
      ---
    `),
            "-": Pixels_1.BpxPixels.from(`
      ---
      ---
      ###
      ---
      ---
    `),
            0: Pixels_1.BpxPixels.from(`
      -#-
      #-#
      #-#
      #-#
      -#-
    `),
            1: Pixels_1.BpxPixels.from(`
      -#-
      ##-
      -#-
      -#-
      ###
    `),
            2: Pixels_1.BpxPixels.from(`
      -#-
      #-#
      --#
      -#-
      ###
    `),
            3: Pixels_1.BpxPixels.from(`
      ###
      --#
      -##
      --#
      ##-
    `),
            4: Pixels_1.BpxPixels.from(`
      --#
      -##
      #-#
      ###
      --#
    `),
            5: Pixels_1.BpxPixels.from(`
      ###
      #--
      ###
      --#
      ##-
    `),
            6: Pixels_1.BpxPixels.from(`
      ###
      #--
      ###
      #-#
      ###
    `),
            7: Pixels_1.BpxPixels.from(`
      ###
      --#
      -#-
      -#-
      -#-
    `),
            8: Pixels_1.BpxPixels.from(`
      ###
      #-#
      -#-
      #-#
      ###
    `),
            9: Pixels_1.BpxPixels.from(`
      ###
      #-#
      ###
      --#
      ###
    `),
            "%": Pixels_1.BpxPixels.from(`
      #-#
      --#
      -#-
      #--
      #-#
    `),
            $: Pixels_1.BpxPixels.from(`
      ###
      ##-
      -##
      ###
      -#-
    `),
            "(": Pixels_1.BpxPixels.from(`
      -#
      #-
      #-
      #-
      -#
    `),
            ")": Pixels_1.BpxPixels.from(`
      #-
      -#
      -#
      -#
      #-
    `),
            "[": Pixels_1.BpxPixels.from(`
      ##
      #-
      #-
      #-
      ##
    `),
            "]": Pixels_1.BpxPixels.from(`
      ##
      -#
      -#
      -#
      ##
    `),
            "{": Pixels_1.BpxPixels.from(`
      -##
      -#-
      #--
      -#-
      -##
    `),
            "}": Pixels_1.BpxPixels.from(`
      ##-
      -#-
      --#
      -#-
      ##-
    `),
            "<": Pixels_1.BpxPixels.from(`
      --#
      -#-
      #--
      -#-
      --#
    `),
            ">": Pixels_1.BpxPixels.from(`
      #--
      -#-
      --#
      -#-
      #--
    `),
            A: Pixels_1.BpxPixels.from(`
      -#-
      #-#
      ###
      #-#
      #-#
    `),
            B: Pixels_1.BpxPixels.from(`
      ##-
      #-#
      ##-
      #-#
      ###
    `),
            C: Pixels_1.BpxPixels.from(`
      -#-
      #-#
      #--
      #-#
      -#-
    `),
            D: Pixels_1.BpxPixels.from(`
      ##-
      #-#
      #-#
      #-#
      ##-
    `),
            E: Pixels_1.BpxPixels.from(`
      ###
      #--
      ##-
      #--
      ###
    `),
            F: Pixels_1.BpxPixels.from(`
      ###
      #--
      ##-
      #--
      #--
    `),
            G: Pixels_1.BpxPixels.from(`
      -#-
      #-#
      #--
      #-#
      -##
    `),
            H: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      ###
      #-#
      #-#
    `),
            I: Pixels_1.BpxPixels.from(`
      ###
      -#-
      -#-
      -#-
      ###
    `),
            J: Pixels_1.BpxPixels.from(`
      --#
      --#
      --#
      #-#
      -#-
    `),
            K: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      ##-
      #-#
      #-#
    `),
            L: Pixels_1.BpxPixels.from(`
      #--
      #--
      #--
      #--
      ###
    `),
            M: Pixels_1.BpxPixels.from(`
      #-#
      ###
      ###
      #-#
      #-#
    `),
            N: Pixels_1.BpxPixels.from(`
      ##-
      ###
      #-#
      #-#
      #-#
    `),
            O: Pixels_1.BpxPixels.from(`
      -#-
      #-#
      #-#
      #-#
      -#-
    `),
            P: Pixels_1.BpxPixels.from(`
      ##-
      #-#
      ###
      #--
      #--
    `),
            Q: Pixels_1.BpxPixels.from(`
      -#-
      #-#
      #-#
      ###
      -##
    `),
            R: Pixels_1.BpxPixels.from(`
      ##-
      #-#
      ##-
      #-#
      #-#
    `),
            S: Pixels_1.BpxPixels.from(`
      ###
      #--
      -#-
      --#
      ##-
    `),
            T: Pixels_1.BpxPixels.from(`
      ###
      -#-
      -#-
      -#-
      -#-
    `),
            U: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      #-#
      #-#
      ###
    `),
            V: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      #-#
      -#-
      -#-
    `),
            W: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      ###
      ###
      #-#
    `),
            X: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      -#-
      #-#
      #-#
    `),
            Y: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      -#-
      -#-
      -#-
    `),
            Z: Pixels_1.BpxPixels.from(`
      ###
      --#
      -#-
      #--
      ###
    `),
            a: Pixels_1.BpxPixels.from(`
      -#-
      #-#
      #-#
      ###
      #-#
    `),
            b: Pixels_1.BpxPixels.from(`
      #--
      #--
      ##-
      #-#
      ##-
    `),
            c: Pixels_1.BpxPixels.from(`
      -##
      #--
      #--
      #--
      -##
    `),
            d: Pixels_1.BpxPixels.from(`
      --#
      --#
      -##
      #-#
      ###
    `),
            e: Pixels_1.BpxPixels.from(`
      -#-
      #-#
      ###
      #--
      -##
    `),
            f: Pixels_1.BpxPixels.from(`
      -##
      -#-
      ###
      -#-
      -#-
    `),
            g: Pixels_1.BpxPixels.from(`
      -#-
      #-#
      #--
      #-#
      -##
    `),
            h: Pixels_1.BpxPixels.from(`
      #--
      #--
      ##-
      #-#
      #-#
    `),
            i: Pixels_1.BpxPixels.from(`
      -#
      --
      -#
      -#
      -#
    `),
            j: Pixels_1.BpxPixels.from(`
      -##
      --#
      --#
      #-#
      -#-
    `),
            k: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      ##-
      #-#
      #-#
    `),
            l: Pixels_1.BpxPixels.from(`
      #
      #
      #
      #
      #
    `),
            m: Pixels_1.BpxPixels.from(`
      #-#
      ###
      ###
      #-#
      #-#
    `),
            n: Pixels_1.BpxPixels.from(`
      ##-
      #-#
      #-#
      #-#
      #-#
    `),
            o: Pixels_1.BpxPixels.from(`
      -#-
      #-#
      #-#
      #-#
      -#-
    `),
            p: Pixels_1.BpxPixels.from(`
      ##-
      #-#
      ###
      #--
      #--
    `),
            q: Pixels_1.BpxPixels.from(`
      -#-
      #-#
      #-#
      ###
      -##
    `),
            r: Pixels_1.BpxPixels.from(`
      -#-
      #-# 
      #--
      #--
      #--
    `),
            s: Pixels_1.BpxPixels.from(`
      -##
      #--
      -#-
      --#
      ##-
    `),
            t: Pixels_1.BpxPixels.from(`
      -#-
      ###
      -#-
      -#-
      -##
    `),
            u: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      #-#
      #-#
      -#-
    `),
            v: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      #-#
      -#-
      -#-
    `),
            w: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      ###
      ###
      #-#
    `),
            x: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      -#-
      #-#
      #-#
    `),
            y: Pixels_1.BpxPixels.from(`
      #-#
      #-#
      -#-
      -#-
      -#-
    `),
            z: Pixels_1.BpxPixels.from(`
      ###
      --#
      -#-
      #--
      ###
    `),
        });
        this.id = BpxFontSaint11Minimal5.id;
        this.imageUrl = null;
    }
    spritesFor(text) {
        const charSprites = [];
        let positionInText = Vector2d_1.v_0_0_;
        for (let i = 0; i < text.length; i += 1) {
            let char = text[i];
            let sprite = __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_sprites, "f")[char] ?? __classPrivateFieldGet(this, _BpxFontSaint11Minimal5_unknownCharSprite, "f");
            charSprites.push({
                char,
                positionInText,
                type: "pixels",
                pixels: sprite,
            });
            const jumpX = sprite.wh.x + 1;
            positionInText = positionInText.add(jumpX, 0);
        }
        return charSprites;
    }
}
exports.BpxFontSaint11Minimal5 = BpxFontSaint11Minimal5;
_BpxFontSaint11Minimal5_unknownCharSprite = new WeakMap(), _BpxFontSaint11Minimal5_sprites = new WeakMap();
BpxFontSaint11Minimal5.id = "__internal__saint11_Minimal5";
