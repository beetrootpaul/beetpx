import { Canvas } from "../canvas_pixels/Canvas";
import { BpxRgbColor } from "../color/RgbColor";
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { BpxCharSprite } from "../font/Font";
import { FontAsset } from "../misc/Assets";
import { BpxVector2d, v_1_1_ } from "../misc/Vector2d";
import { DrawSprite } from "./DrawSprite";
import { BpxFillPattern } from "./FillPattern";

export class DrawText {
  readonly #canvas: Canvas;

  readonly #sprite: DrawSprite;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;

    this.#sprite = new DrawSprite(this.#canvas, {
      disableRounding: true,
    });
  }

  // TODO: tests, especially to check that we iterate over emojis like "➡️" correctly
  // TODO: cover ClippingRegion with tests
  draw(
    text: string,
    canvasXy: BpxVector2d,
    fontAsset: FontAsset,
    color: BpxRgbColor | ((charSprite: BpxCharSprite) => BpxRgbColor),
    // TODO: use scaleXy + cover it with tests
    scaleXy: BpxVector2d = v_1_1_,
  ): void {
    canvasXy = canvasXy.round();

    const colorMapping =
      typeof color === "function"
        ? (charSprite: BpxCharSprite) =>
            new BpxSpriteColorMapping((spriteColor) => {
              return spriteColor?.cssHex === fontAsset.imageTextColor.cssHex
                ? color(charSprite)
                : null;
            })
        : new BpxSpriteColorMapping((spriteColor) => {
            return spriteColor?.cssHex === fontAsset.imageTextColor.cssHex
              ? color
              : null;
          });

    for (const charSprite of fontAsset.font.spritesFor(text)) {
      this.#sprite.draw(
        fontAsset.image,
        charSprite.sprite,
        canvasXy.add(charSprite.positionInText),
        v_1_1_,
        typeof colorMapping === "function"
          ? colorMapping(charSprite)
          : colorMapping,
        BpxFillPattern.primaryOnly,
      );
    }
  }
}
