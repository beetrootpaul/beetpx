import { BpxSolidColor } from "../Color";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { BpxClippingRegion } from "./ClippingRegion";

export class DrawClear {
  readonly #canvasPixels: CanvasPixels;

  constructor(canvasPixels: CanvasPixels) {
    this.#canvasPixels = canvasPixels;
  }

  // TODO: cover clippingRegion with tests
  draw(
    color: BpxSolidColor,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    for (let x = 0; x < this.#canvasPixels.canvasSize.x; ++x) {
      for (let y = 0; y < this.#canvasPixels.canvasSize.y; ++y) {
        if (!this.#canvasPixels.wasAlreadySet(x, y)) {
          if (!clippingRegion || clippingRegion.allowsDrawingAt(x, y)) {
            this.#canvasPixels.set(color, x, y);
          }
        }
      }
    }
  }
}
