import { CompositeColor, SolidColor } from "../Color";
import { Vector2d } from "../Vector2d";
import { DrawPixel } from "./DrawPixel";
import { FillPattern } from "./FillPattern";

export class DrawRect {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Vector2d;

  readonly #pixel: DrawPixel;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;

    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize);
  }

  draw(
    xy1: Vector2d,
    xy2: Vector2d,
    color: SolidColor | CompositeColor,
    fill: boolean,
    fillPattern: FillPattern = FillPattern.primaryOnly,
  ): void {
    Vector2d.forEachIntXyWithinRectOf(xy1, xy2, fill, (xy) => {
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
