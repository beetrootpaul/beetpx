import { BpxCompositeColor, BpxMappingColor, BpxSolidColor } from "../Color";
import { BpxVector2d } from "../Vector2d";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { BpxClippingRegion } from "./ClippingRegion";
import { DrawPixel } from "./DrawPixel";
import { BpxFillPattern } from "./FillPattern";

export class DrawRect {
  readonly #canvasPixels: CanvasPixels;

  readonly #pixel: DrawPixel;

  constructor(canvasPixels: CanvasPixels) {
    this.#canvasPixels = canvasPixels;

    this.#pixel = new DrawPixel(this.#canvasPixels, {
      disableRounding: true,
      disableVisitedCheck: false,
    });
  }

  // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
  // TODO: tests for MappingColor
  // TODO: tests for CompositeColor and fillPattern
  // TODO: cover ClippingRegion with tests
  draw(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
    fill: boolean,
    fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(
      xy.round(),
      xy.add(wh).round(),
    );
    for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
      if (fill || y === xyMinInclusive.y || y === xyMaxExclusive.y - 1) {
        for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
          this.#pixel.draw(x, y, color, fillPattern, clippingRegion);
        }
      } else {
        this.#pixel.draw(
          xyMinInclusive.x,
          y,
          color,
          fillPattern,
          clippingRegion,
        );
        this.#pixel.draw(
          xyMaxExclusive.x - 1,
          y,
          color,
          fillPattern,
          clippingRegion,
        );
      }
    }
  }
}
