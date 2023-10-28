import { BpxSolidColor } from "../Color";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";

export class DrawClear {
  readonly #canvasPixels: CanvasPixels;

  constructor(canvasPixels: CanvasPixels) {
    this.#canvasPixels = canvasPixels;
  }

  draw(color: BpxSolidColor): void {
    for (let x = 0; x < this.#canvasPixels.canvasSize.x; ++x) {
      for (let y = 0; y < this.#canvasPixels.canvasSize.y; ++y) {
        this.#canvasPixels.set(color, x, y);
      }
    }
  }
}
