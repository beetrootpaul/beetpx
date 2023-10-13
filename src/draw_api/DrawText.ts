import { FontAsset } from "../Assets";
import { BpxSolidColor, transparent_ } from "../Color";
import { BpxCharSprite } from "../font/Font";
import { BpxVector2d, v_ } from "../Vector2d";
import { BpxClippingRegion } from "./ClippingRegion";
import { DrawSprite } from "./DrawSprite";
import { BpxFillPattern } from "./FillPattern";

export class DrawText {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: BpxVector2d;

  readonly #sprite: DrawSprite;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: BpxVector2d) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;

    this.#sprite = new DrawSprite(this.#canvasBytes, this.#canvasSize, {
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
    canvasXy = v_.round(canvasXy);

    const colorFn = typeof color === "function" ? color : () => color;

    for (const charSprite of fontAsset.font.spritesFor(text)) {
      this.#sprite.draw(
        fontAsset.image,
        charSprite.sprite,
        v_.add(canvasXy, charSprite.positionInText),
        [1, 1],
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
