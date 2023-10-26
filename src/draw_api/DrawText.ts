import { FontAsset } from "../Assets";
import { BpxSolidColor, transparent_ } from "../Color";
import { BpxVector2d, v_1_1_ } from "../Vector2d";
import { BpxCharSprite } from "../font/Font";
import { BpxClippingRegion } from "./ClippingRegion";
import { DrawSprite } from "./DrawSprite";
import { BpxFillPattern } from "./FillPattern";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";

export class DrawText {
  readonly #canvasPixels: CanvasPixels;

  readonly #sprite: DrawSprite;

  constructor(canvasPixels: CanvasPixels) {
    this.#canvasPixels = canvasPixels;

    this.#sprite = new DrawSprite(this.#canvasPixels, {
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
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    canvasXy = canvasXy.round();

    const colorFn = typeof color === "function" ? color : () => color;

    for (const charSprite of fontAsset.font.spritesFor(text)) {
      this.#sprite.draw(
        fontAsset.image,
        charSprite.sprite,
        canvasXy.add(charSprite.positionInText),
        v_1_1_,
        new Map([
          [fontAsset.imageTextColor.id, colorFn(charSprite)],
          [fontAsset.imageBgColor.id, transparent_],
        ]),
        BpxFillPattern.primaryOnly,
        clippingRegion,
      );
    }
  }
}
