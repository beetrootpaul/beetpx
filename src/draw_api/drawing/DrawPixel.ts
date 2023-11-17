import { Canvas } from "../../canvas/Canvas";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxVector2d } from "../../misc/Vector2d";
import { BpxPattern } from "../Pattern";

export class DrawPixel {
  readonly #canvas: Canvas;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;
  }

  draw(xy: BpxVector2d, color: BpxRgbColor, pattern: BpxPattern): void {
    xy = xy.round();

    if (!this.#canvas.canSetAt(xy.x, xy.y)) {
      return;
    }

    if (pattern.hasPrimaryColorAt(xy.x, xy.y)) {
      this.#canvas.set(color, xy.x, xy.y);
    }
  }
}
