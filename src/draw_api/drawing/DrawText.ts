import { FontAsset } from "../../assets/Assets";
import { Canvas } from "../../canvas/Canvas";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxSpriteColorMapping } from "../../color/SpriteColorMapping";
import { BpxCharSprite } from "../../font/Font";
import { BpxVector2d, v_0_0_ } from "../../misc/Vector2d";
import { BpxPattern } from "../Pattern";
import { spr_ } from "../Sprite";
import { DrawPixels } from "./DrawPixels";
import { DrawSprite } from "./DrawSprite";

export class DrawText {
  readonly #canvas: Canvas;

  readonly #sprite: DrawSprite;
  readonly #pixels: DrawPixels;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;

    this.#sprite = new DrawSprite(this.#canvas, {
      disableRounding: true,
    });
    this.#pixels = new DrawPixels(this.#canvas, {
      disableRounding: true,
    });
  }

  draw(
    text: string,
    fontAsset: FontAsset,
    canvasXy: BpxVector2d,
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
      const xy = canvasXy.add(charSprite.positionInText.mul(scaleXy));
      if (charSprite.type === "image") {
        if (fontAsset.font.imageUrl == null) {
          throw Error(
            `There is no imageUrl defined for a font "${fontAsset.font.id}", which uses image sprites`,
          );
        }
        if (fontAsset.image == null) {
          throw Error(
            `There is no image loaded for a font "${fontAsset.font.id}", which uses image sprites`,
          );
        }
        this.#sprite.draw(
          spr_(fontAsset.font.imageUrl)(
            charSprite.spriteXyWh[0].x,
            charSprite.spriteXyWh[0].y,
            charSprite.spriteXyWh[1].x,
            charSprite.spriteXyWh[1].y,
          ),
          fontAsset.image,
          xy,
          scaleXy,
          typeof colorMapping === "function"
            ? colorMapping(charSprite)
            : colorMapping,
          pattern,
        );
      } else {
        this.#pixels.draw(
          charSprite.pixels,
          xy,
          typeof color === "function" ? color(charSprite) : color,
          scaleXy,
          pattern,
        );
      }
    }
  }
}
