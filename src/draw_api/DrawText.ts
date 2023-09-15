import { FontAsset } from "../Assets";
import { SolidColor, transparent_ } from "../Color";
import { CharSprite } from "../font/Font";
import { Vector2d } from "../Vector2d";
import { ClippingRegion } from "./ClippingRegion";
import { DrawSprite } from "./DrawSprite";

export class DrawText {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Vector2d;

  readonly #sprite: DrawSprite;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d) {
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
    canvasXy: Vector2d,
    fontAsset: FontAsset,
    color: SolidColor | ((charSprite: CharSprite) => SolidColor),
    clippingRegion: ClippingRegion | null = null,
  ): void {
    canvasXy = canvasXy.round();

    const colorFn = typeof color === "function" ? color : () => color;

    for (const charSprite of fontAsset.font.spritesFor(text)) {
      this.#sprite.draw(
        fontAsset.image,
        charSprite.sprite,
        canvasXy.add(charSprite.positionInText),
        new Map([
          [fontAsset.imageTextColor.id, colorFn(charSprite)],
          [fontAsset.imageBgColor.id, transparent_],
        ]),
        clippingRegion,
      );
    }
  }
}
