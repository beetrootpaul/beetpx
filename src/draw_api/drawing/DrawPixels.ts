import { Canvas } from "../../canvas/Canvas";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxVector2d } from "../../misc/Vector2d";
import { BpxPattern } from "../Pattern";

export class DrawPixels {
  readonly #canvas: Canvas;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;
  }

  draw(
    xy: BpxVector2d,
    bits: string[],
    color: BpxRgbColor,
    pattern: BpxPattern,
  ): void {
    xy = xy.round();

    for (let bitsY = 0; bitsY < bits.length; bitsY += 1) {
      for (let bitsX = 0; bitsX < bits[bitsY]!.length; bitsX += 1) {
        if (bits[bitsY]![bitsX] !== "#") {
          continue;
        }

        const x = xy.x + bitsX;
        const y = xy.y + bitsY;
        if (pattern.hasPrimaryColorAt(x, y)) {
          if (this.#canvas.canSetAt(x, y)) {
            this.#canvas.set(color, x, y);
          }
        }
      }
    }
  }
}
