import { CompositeColor, MappingColor, SolidColor } from "../Color";
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

    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize, {
      disableRounding: true,
    });
  }

  // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
  // TODO: tests for MappingColor
  // TODO: tests for CompositeColor and fillPattern
  // TODO: cover ClippingRegion with tests
  draw(
    xy: Vector2d,
    wh: Vector2d,
    color: SolidColor | CompositeColor | MappingColor,
    fill: boolean,
    fillPattern: FillPattern = FillPattern.primaryOnly,
    clippingRegion: ClippingRegion | null = null,
  ): void {
    Vector2d.forEachIntXyWithinRectOf(xy, wh, true, fill, (xy) => {
      this.#pixel.draw(xy, color, clippingRegion, fillPattern);
    });
  }
}
