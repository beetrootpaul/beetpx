import { BpxSolidColor } from "../Color";
import { BpxVector2d } from "../Vector2d";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { BpxClippingRegion } from "./ClippingRegion";

export class DrawPixels {
  readonly #canvasPixels: CanvasPixels;

  constructor(canvasPixels: CanvasPixels) {
    this.#canvasPixels = canvasPixels;
  }

  // TODO: add tests
  draw(
    xy: BpxVector2d,
    bits: string[],
    color: BpxSolidColor,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    xy = xy.round();

    for (let bitsY = 0; bitsY < bits.length; bitsY += 1) {
      for (let bitsX = 0; bitsX < bits[bitsY]!.length; bitsX += 1) {
        if (bits[bitsY]![bitsX] !== "#") {
          continue;
        }

        const x = xy.x + bitsX;
        const y = xy.y + bitsY;
        if (this.#canvasPixels.canSetAt(x, y)) {
          if (!clippingRegion || clippingRegion.allowsDrawingAt(x, y)) {
            this.#canvasPixels.set(color, x, y);
          }
        }
      }
    }
  }
}
