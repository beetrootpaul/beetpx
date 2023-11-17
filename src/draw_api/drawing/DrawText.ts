import { FontAsset } from "../../assets/Assets";
import { Canvas } from "../../canvas/Canvas";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxSpriteColorMapping } from "../../color/SpriteColorMapping";
import { BpxCharSprite } from "../../font/Font";
import { BpxVector2d, v_0_0_ } from "../../misc/Vector2d";
import { BpxPattern } from "../Pattern";
import { DrawSprite } from "./DrawSprite";

export class DrawText {
  readonly #canvas: Canvas;

  readonly #sprite: DrawSprite;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;

    this.#sprite = new DrawSprite(this.#canvas, {
      disableRounding: true,
    });
  }

  draw(
    text: string,
    canvasXy: BpxVector2d,
    fontAsset: FontAsset,
    color: BpxRgbColor | ((charSprite: BpxCharSprite) => BpxRgbColor),
    scaleXy: BpxVector2d,
    pattern: BpxPattern,
  ): void {
    canvasXy = canvasXy.round();
    scaleXy = BpxVector2d.max(scaleXy.floor(), v_0_0_);

    const colorMapping =
      typeof color === "function"
        ? (charSprite: BpxCharSprite) =>
            new BpxSpriteColorMapping((spriteColor) =>
              spriteColor?.cssHex === fontAsset.imageTextColor.cssHex
                ? color(charSprite)
                : null,
            )
        : new BpxSpriteColorMapping((spriteColor) =>
            spriteColor?.cssHex === fontAsset.imageTextColor.cssHex
              ? color
              : null,
          );

    for (const charSprite of fontAsset.font.spritesFor(text)) {
      this.#sprite.draw(
        fontAsset.image,
        charSprite.sprite,
        canvasXy.add(charSprite.positionInText.mul(scaleXy)),
        scaleXy,
        typeof colorMapping === "function"
          ? colorMapping(charSprite)
          : colorMapping,
        pattern,
      );
    }
  }
}
