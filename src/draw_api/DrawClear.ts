import { Canvas } from "../canvas_pixels/Canvas";
import { BpxSolidColor } from "../misc/Color";

export class DrawClear {
  readonly #canvas: Canvas;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;
  }

  draw(color: BpxSolidColor): void {
    for (let x = 0; x < this.#canvas.canvasSize.x; ++x) {
      for (let y = 0; y < this.#canvas.canvasSize.y; ++y) {
        this.#canvas.set(color, x, y);
      }
    }
  }
}
