import { BpxImageAsset } from "../../assets/Assets";
import { Canvas } from "../../canvas/Canvas";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxSpriteColorMapping } from "../../color/SpriteColorMapping";
import { BpxCharSprite, BpxFont } from "../../font/Font";
import { BpxVector2d, v_0_0_ } from "../../misc/Vector2d";
import { spr_ } from "../../sprite/Sprite";
import { BpxDrawingPattern } from "../Pattern";
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
    font: BpxFont,
    fontImage: BpxImageAsset | null,
    canvasXy: BpxVector2d,
    color: BpxRgbColor | ((charSprite: BpxCharSprite) => BpxRgbColor),
    scaleXy: BpxVector2d,
    pattern: BpxDrawingPattern,
  ): void {
    canvasXy = canvasXy.round();
    scaleXy = BpxVector2d.max(scaleXy.floor(), v_0_0_);

    const colorMapping =
      typeof color === "function"
        ? (charSprite: BpxCharSprite) =>
            BpxSpriteColorMapping.of((spriteColor) =>
              spriteColor?.cssHex === font.spriteTextColor?.cssHex
                ? color(charSprite)
                : null,
            )
        : BpxSpriteColorMapping.of((spriteColor) =>
            spriteColor?.cssHex === font.spriteTextColor?.cssHex ? color : null,
          );

    for (const charSprite of font.spritesFor(text)) {
      const xy = canvasXy.add(charSprite.positionInText.mul(scaleXy));
      if (charSprite.type === "image") {
        if (font.imageUrl == null) {
          throw Error(
            `There is no imageUrl defined for a font "${font.id}", which uses image sprites`,
          );
        }
        // TODO: move font image to each char sprite maybe?
        if (fontImage == null) {
          throw Error(
            `There is no image loaded for a font "${font.id}", which uses image sprites`,
          );
        }
        this.#sprite.draw(
          spr_(font.imageUrl)(
            charSprite.spriteXyWh[1].x,
            charSprite.spriteXyWh[1].y,
            charSprite.spriteXyWh[0].x,
            charSprite.spriteXyWh[0].y,
          ),
          fontImage,
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
