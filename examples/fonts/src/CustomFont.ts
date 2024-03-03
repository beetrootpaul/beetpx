import {
  BpxCharSprite,
  BpxFont,
  BpxFontId,
  BpxImageUrl,
  BpxPixels,
  BpxRgbColor,
  BpxVector2d,
  v_,
  v_0_0_,
} from "../../../src";

// TODO: rework
export class CustomFont implements BpxFont {
  readonly id: BpxFontId = "custom-font";
  readonly imageUrl: BpxImageUrl = "custom-font.png";
  spriteTextColor = BpxRgbColor.fromCssHex("#99e550");

  #spriteFor(character: string): [BpxVector2d, BpxVector2d] | BpxPixels | null {
    if (character === "T") {
      return [v_(3, 0), v_(5, 8)];
    }
    if (character === "b") {
      return [v_(5, 5), v_(3, 8)];
    }
    if (character === "e") {
      return [v_(8, 0), v_(3, 5)];
    }
    if (character === "f") {
      return [v_(8, 5), v_(3, 8)];
    }
    if (character === "h") {
      return [v_(0, 0), v_(3, 8)];
    }
    if (character === "n") {
      return BpxPixels.from(`
        ##-
        #-#
        #-#
        #-#
        #-#
      `);
    }
    if (character === "o") {
      return [v_(5, 8), v_(3, 5)];
    }
    if (character === "r") {
      return [v_(5, 0), v_(3, 5)];
    }
    if (character === "w") {
      return BpxPixels.from(`
        #-#-#
        #-#-#
        #-#-#
        -#-#-
        -#-#-
      `);
    }
    if (character === "x") {
      return [v_(1, 8), v_(3, 5)];
    }
    return null;
  }

  spritesFor(text: string): BpxCharSprite[] {
    const sprites: BpxCharSprite[] = [];
    let positionInText = v_0_0_;
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i]!;
      const sprite = this.#spriteFor(char);
      if (sprite) {
        sprites.push({
          char,
          positionInText,
          ...(sprite instanceof BpxPixels
            ? { type: "pixels", pixels: sprite }
            : { type: "image", spriteXyWh: sprite }),
        });
      }
      positionInText = positionInText
        .add(
          sprite == null
            ? 2
            : sprite instanceof BpxPixels
              ? sprite.wh.x
              : sprite[1].x,
          0,
        )
        .add(v_(1, 0));
    }
    return sprites;
  }
}
