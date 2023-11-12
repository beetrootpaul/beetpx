import { Canvas } from "../canvas_pixels/Canvas";
import { BpxRgbColor } from "../color/RgbColor";
import { BpxVector2d } from "../misc/Vector2d";
import { BpxFillPattern } from "./FillPattern";

export class DrawPixel {
  readonly #canvas: Canvas;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;
  }

  // TODO: tests for MappingColor
  // TODO: consider moving fill pattern and composite color support inside here
  // TODO: cover ClippingRegion with tests
  draw(
    xy: BpxVector2d,
    color: BpxRgbColor,
    fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly,
  ): void {
    xy = xy.round();

    if (!this.#canvas.canSetAt(xy.x, xy.y)) {
      return;
    }

    if (fillPattern.hasPrimaryColorAt(xy.x, xy.y)) {
      this.#canvas.set(color, xy.x, xy.y);
    }
  }
}
