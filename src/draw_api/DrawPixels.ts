import { Canvas } from "../canvas_pixels/Canvas";
import { BpxSolidColor } from "../misc/Color";
import { BpxVector2d } from "../misc/Vector2d";

export class DrawPixels {
  readonly #canvas: Canvas;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;
  }

  // TODO: add tests
  draw(xy: BpxVector2d, bits: string[], color: BpxSolidColor): void {
    xy = xy.round();

    for (let bitsY = 0; bitsY < bits.length; bitsY += 1) {
      for (let bitsX = 0; bitsX < bits[bitsY]!.length; bitsX += 1) {
        if (bits[bitsY]![bitsX] !== "#") {
          continue;
        }

        const x = xy.x + bitsX;
        const y = xy.y + bitsY;
        if (this.#canvas.canSetAt(x, y)) {
          this.#canvas.set(color, x, y);
        }
      }
    }
  }
}
