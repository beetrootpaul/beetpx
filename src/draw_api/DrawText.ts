import { Canvas } from "../canvas_pixels/Canvas";
import { BpxColorId } from "../color/Color";
import { BpxSolidColor } from "../color/SolidColor";
import { BpxTransparentColor, transparent_ } from "../color/TransparentColor";
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
    color: BpxSolidColor | ((charSprite: BpxCharSprite) => BpxSolidColor),
  ): void {
    canvasXy = canvasXy.round();

    const colorFn = typeof color === "function" ? color : () => color;

    for (const charSprite of fontAsset.font.spritesFor(text)) {
      this.#sprite.draw(
        fontAsset.image,
        charSprite.sprite,
        canvasXy.add(charSprite.positionInText),
        v_1_1_,
        new Map<BpxColorId, BpxSolidColor | BpxTransparentColor>([
          [fontAsset.imageTextColor.id, colorFn(charSprite)],
          [fontAsset.imageBgColor.id, transparent_],
        ]),
        BpxFillPattern.primaryOnly,
      );
    }
  }
}
