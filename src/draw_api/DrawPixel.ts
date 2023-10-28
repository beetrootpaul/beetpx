import { BpxSolidColor } from "../Color";
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
    x: number,
    y: number,
    color: BpxSolidColor,
    fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    x = Math.round(x);
    y = Math.round(y);

    if (this.#canvasPixels.wasAlreadySet(x, y)) {
      return;
    }

    if (clippingRegion && !clippingRegion.allowsDrawingAt(x, y)) {
      return;
    }

    if (fillPattern.hasPrimaryColorAt(x, y)) {
      this.#canvasPixels.set(color, x, y);
    }
  }
}
