import { BpxSolidColor } from "../Color";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { BpxClippingRegion } from "./ClippingRegion";

export class DrawClear {
  readonly #canvasPixels: CanvasPixels;

  constructor(canvasPixels: CanvasPixels) {
    this.#canvasPixels = canvasPixels;
  }

  // TODO: support ClippingRegion + cover with tests
  draw(
    color: BpxSolidColor,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    for (
      let pixel = 0;
      pixel < this.#canvasPixels.canvasSize.x * this.#canvasPixels.canvasSize.y;
      pixel += 1
    ) {
      this.#canvasPixels.set(pixel, color);
    }
  }
}
