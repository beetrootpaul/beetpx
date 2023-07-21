import { CompositeColor, SolidColor } from "../Color";
import { Xy } from "../Xy";
import { DrawPixel } from "./DrawPixel";
import { FillPattern } from "./FillPattern";

export class DrawRect {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Xy;

  readonly #pixel: DrawPixel;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;

    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize);
  }

  draw(
    xy1: Xy,
    xy2: Xy,
    color: SolidColor | CompositeColor,
    fill: boolean,
    fillPattern: FillPattern = FillPattern.primaryOnly,
  ): void {
    Xy.forEachIntXyWithinRectOf(xy1, xy2, fill, (xy) => {
      if (fillPattern.hasPrimaryColorAt(xy)) {
        if (color instanceof CompositeColor) {
          if (color.primary instanceof SolidColor) {
            this.#pixel.draw(xy, color.primary);
          }
        } else {
          this.#pixel.draw(xy, color);
        }
      } else {
        if (color instanceof CompositeColor) {
          if (color.secondary instanceof SolidColor) {
            this.#pixel.draw(xy, color.secondary);
          }
        }
      }
    });
  }
}
