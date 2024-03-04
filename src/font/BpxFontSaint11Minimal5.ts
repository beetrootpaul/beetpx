import { BpxImageUrl } from "../assets/Assets";
import { BpxPixels } from "../draw_api/Pixels";
import { BpxVector2d, v_, v_0_0_ } from "../misc/Vector2d";
import { BpxCharSprite, BpxFont, BpxFontId } from "./Font";

// TODO: export all fields necessary for overrides
// TODO: rework this
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
export class BpxFontSaint11Minimal5 implements BpxFont {
  static id: BpxFontId = "__internal__saint11_Minimal5";

  readonly spriteTextColor = null;

  #unknownCharSprite = BpxPixels.from(`
    ###
    ###
    ###
    ###
    ###
  `);
  #sprites: { [char: string]: BpxPixels } = {
    " ": BpxPixels.from(`
      ----
      ----
      ----
      ----
      ----
    `),
    ".": BpxPixels.from(`
      --
      --
      --
      ##
      ##
    `),
    ":": BpxPixels.from(`
      #
      -
      -
      #
      -
    `),
    "!": BpxPixels.from(`
      ###
      ###
      -#-
      ---
      -#-
    `),
    "?": BpxPixels.from(`
      ###
      --#
      -#-
      ---
      -#-
    `),
    "'": BpxPixels.from(`
      -
      #
      #
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
      --
      ##
      ##
      --
      --
    `),
    "/": BpxPixels.from(`
      --#
      --#
      -#-
      #--
      #--
    `),
    "+": BpxPixels.from(`
      ---
      -#-
      ###
      -#-
      ---
    `),
    "-": BpxPixels.from(`
      ---
      ---
      ###
      ---
      ---
    `),
    0: BpxPixels.from(`
      -#-
      #-#
      #-#
      #-#
      -#-
    `),
    1: BpxPixels.from(`
      -#-
      ##-
      -#-
      -#-
      ###
    `),
    2: BpxPixels.from(`
      -#-
      #-#
      --#
      -#-
      ###
    `),
    3: BpxPixels.from(`
      ###
      --#
      -##
      --#
      ##-
    `),
    4: BpxPixels.from(`
      --#
      -##
      #-#
      ###
      --#
    `),
    5: BpxPixels.from(`
      ###
      #--
      ###
      --#
      ##-
    `),
    6: BpxPixels.from(`
      ###
      #--
      ###
      #-#
      ###
    `),
    7: BpxPixels.from(`
      ###
      --#
      -#-
      -#-
      -#-
    `),
    8: BpxPixels.from(`
      ###
      #-#
      -#-
      #-#
      ###
    `),
    9: BpxPixels.from(`
      ###
      #-#
      ###
      --#
      ###
    `),
    "%": BpxPixels.from(`
      #-#
      --#
      -#-
      #--
      #-#
    `),
    $: BpxPixels.from(`
      ###
      ##-
      -##
      ###
      -#-
    `),
    "(": BpxPixels.from(`
      -#
      #-
      #-
      #-
      -#
    `),
    ")": BpxPixels.from(`
      #-
      -#
      -#
      -#
      #-
    `),
    "[": BpxPixels.from(`
      ##
      #-
      #-
      #-
      ##
    `),
    "]": BpxPixels.from(`
      ##
      -#
      -#
      -#
      ##
    `),
    "{": BpxPixels.from(`
      -##
      -#-
      #--
      -#-
      -##
    `),
    "}": BpxPixels.from(`
      ##-
      -#-
      --#
      -#-
      ##-
    `),
    "<": BpxPixels.from(`
      --#
      -#-
      #--
      -#-
      --#
    `),
    ">": BpxPixels.from(`
      #--
      -#-
      --#
      -#-
      #--
    `),
    A: BpxPixels.from(`
      -#-
      #-#
      ###
      #-#
      #-#
    `),
    B: BpxPixels.from(`
      ##-
      #-#
      ##-
      #-#
      ###
    `),
    C: BpxPixels.from(`
      -#-
      #-#
      #--
      #-#
      -#-
    `),
    D: BpxPixels.from(`
      ##-
      #-#
      #-#
      #-#
      ##-
    `),
    E: BpxPixels.from(`
      ###
      #--
      ##-
      #--
      ###
    `),
    F: BpxPixels.from(`
      ###
      #--
      ##-
      #--
      #--
    `),
    G: BpxPixels.from(`
      -#-
      #-#
      #--
      #-#
      -##
    `),
    H: BpxPixels.from(`
      #-#
      #-#
      ###
      #-#
      #-#
    `),
    I: BpxPixels.from(`
      ###
      -#-
      -#-
      -#-
      ###
    `),
    J: BpxPixels.from(`
      --#
      --#
      --#
      #-#
      -#-
    `),
    K: BpxPixels.from(`
      #-#
      #-#
      ##-
      #-#
      #-#
    `),
    L: BpxPixels.from(`
      #--
      #--
      #--
      #--
      ###
    `),
    M: BpxPixels.from(`
      #-#
      ###
      ###
      #-#
      #-#
    `),
    N: BpxPixels.from(`
      ##-
      ###
      #-#
      #-#
      #-#
    `),
    O: BpxPixels.from(`
      -#-
      #-#
      #-#
      #-#
      -#-
    `),
    P: BpxPixels.from(`
      ##-
      #-#
      ###
      #--
      #--
    `),
    Q: BpxPixels.from(`
      -#-
      #-#
      #-#
      ###
      -##
    `),
    R: BpxPixels.from(`
      ##-
      #-#
      ##-
      #-#
      #-#
    `),
    S: BpxPixels.from(`
      ###
      #--
      -#-
      --#
      ##-
    `),
    T: BpxPixels.from(`
      ###
      -#-
      -#-
      -#-
      -#-
    `),
    U: BpxPixels.from(`
      #-#
      #-#
      #-#
      #-#
      ###
    `),
    V: BpxPixels.from(`
      #-#
      #-#
      #-#
      -#-
      -#-
    `),
    W: BpxPixels.from(`
      #-#
      #-#
      ###
      ###
      #-#
    `),
    X: BpxPixels.from(`
      #-#
      #-#
      -#-
      #-#
      #-#
    `),
    Y: BpxPixels.from(`
      #-#
      #-#
      -#-
      -#-
      -#-
    `),
    Z: BpxPixels.from(`
      ###
      --#
      -#-
      #--
      ###
    `),
    a: BpxPixels.from(`
      -#-
      #-#
      #-#
      ###
      #-#
    `),
    b: BpxPixels.from(`
      #--
      #--
      ##-
      #-#
      ##-
    `),
    c: BpxPixels.from(`
      -##
      #--
      #--
      #--
      -##
    `),
    d: BpxPixels.from(`
      --#
      --#
      -##
      #-#
      ###
    `),
    e: BpxPixels.from(`
      -#-
      #-#
      ###
      #--
      -##
    `),
    f: BpxPixels.from(`
      -##
      -#-
      ###
      -#-
      -#-
    `),
    g: BpxPixels.from(`
      -#-
      #-#
      #--
      #-#
      -##
    `),
    h: BpxPixels.from(`
      #--
      #--
      ##-
      #-#
      #-#
    `),
    i: BpxPixels.from(`
      -#
      --
      -#
      -#
      -#
    `),
    j: BpxPixels.from(`
      -##
      --#
      --#
      #-#
      -#-
    `),
    k: BpxPixels.from(`
      #-#
      #-#
      ##-
      #-#
      #-#
    `),
    l: BpxPixels.from(`
      #
      #
      #
      #
      #
    `),
    m: BpxPixels.from(`
      #-#
      ###
      ###
      #-#
      #-#
    `),
    n: BpxPixels.from(`
      ##-
      #-#
      #-#
      #-#
      #-#
    `),
    o: BpxPixels.from(`
      -#-
      #-#
      #-#
      #-#
      -#-
    `),
    p: BpxPixels.from(`
      ##-
      #-#
      ###
      #--
      #--
    `),
    q: BpxPixels.from(`
      -#-
      #-#
      #-#
      ###
      -##
    `),
    r: BpxPixels.from(`
      -#-
      #-# 
      #--
      #--
      #--
    `),
    s: BpxPixels.from(`
      -##
      #--
      -#-
      --#
      ##-
    `),
    t: BpxPixels.from(`
      -#-
      ###
      -#-
      -#-
      -##
    `),
    u: BpxPixels.from(`
      #-#
      #-#
      #-#
      #-#
      -#-
    `),
    v: BpxPixels.from(`
      #-#
      #-#
      #-#
      -#-
      -#-
    `),
    w: BpxPixels.from(`
      #-#
      #-#
      ###
      ###
      #-#
    `),
    x: BpxPixels.from(`
      #-#
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
      -#-
    `),
    z: BpxPixels.from(`
      ###
      --#
      -#-
      #--
      ###
    `),
  };

  readonly id: BpxFontId = BpxFontSaint11Minimal5.id;

  readonly imageUrl: BpxImageUrl | null = null;

  spritesFor(text: string): BpxCharSprite[] {
    const charSprites: BpxCharSprite[] = [];
    let positionInText: BpxVector2d = v_0_0_;

    for (let i = 0; i < text.length; i += 1) {
      let char = text[i]!;
      // TODO: REWORK THIS
      if (char === "\n") {
        positionInText = v_(0, positionInText.y + 6);
      } else {
        let sprite = this.#sprites[char] ?? this.#unknownCharSprite;
        charSprites.push({
          char,
          positionInText,
          type: "pixels",
          pixels: sprite,
        });
        const jumpX = sprite.wh.x + 1;
        positionInText = positionInText.add(jumpX, 0);
      }
    }

    return charSprites;
  }
}
