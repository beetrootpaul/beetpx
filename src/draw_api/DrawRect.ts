import { CompositeColor, SolidColor } from "../Color";
import { Vector2d } from "../Vector2d";
import { ClippingRegion } from "./ClippingRegion";
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

  // TODO: cover ClippingRegion with tests
  draw(
    xy: Vector2d,
    wh: Vector2d,
    color: SolidColor | CompositeColor,
    fill: boolean,
    fillPattern: FillPattern = FillPattern.primaryOnly,
    clippingRegion: ClippingRegion | null = null,
  ): void {
    Vector2d.forEachIntXyWithinRectOf(xy, wh, fill, (xy) => {
      if (fillPattern.hasPrimaryColorAt(xy)) {
        if (color instanceof CompositeColor) {
          if (color.primary instanceof SolidColor) {
            this.#pixel.draw(xy, color.primary, clippingRegion);
          }
        } else {
          this.#pixel.draw(xy, color, clippingRegion);
        }
      } else {
        if (color instanceof CompositeColor) {
          if (color.secondary instanceof SolidColor) {
            this.#pixel.draw(xy, color.secondary, clippingRegion);
          }
        }
      }
    });
  }
}
