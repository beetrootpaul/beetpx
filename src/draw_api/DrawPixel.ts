import { BpxSolidColor } from "../Color";
import { BpxVector2d } from "../Vector2d";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { BpxClippingRegion } from "./ClippingRegion";
import { BpxFillPattern } from "./FillPattern";

export class DrawPixel {
  readonly #canvasPixels: CanvasPixels;

  constructor(canvasPixels: CanvasPixels) {
    this.#canvasPixels = canvasPixels;
  }

  // TODO: consolidate where composite color and fill patterns are handled (look for `instanceof`). Consider renaming fill pattern to e.g. pattern color as well
  // TODO: tests for MappingColor
  // TODO: consider moving fill pattern and composite color support inside here
  // TODO: cover ClippingRegion with tests
  draw(
    xy: BpxVector2d,
    color: BpxSolidColor,
    fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    xy = xy.round();

    if (!this.#canvasPixels.canSetAt(xy.x, xy.y)) {
      return;
    }

    if (clippingRegion && !clippingRegion.allowsDrawingAt(xy.x, xy.y)) {
      return;
    }

    if (fillPattern.hasPrimaryColorAt(xy.x, xy.y)) {
      this.#canvasPixels.set(color, xy.x, xy.y);
    }
  }
}
