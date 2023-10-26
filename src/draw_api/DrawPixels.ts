import { BpxColor } from "../Color";
import { BpxVector2d } from "../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { BpxClippingRegion } from "./ClippingRegion";
import { DrawPixel } from "./DrawPixel";

export class DrawPixels {
  readonly #pixel: DrawPixel;

  constructor(canvasPixels: CanvasPixels) {
    this.#pixel = new DrawPixel(canvasPixels);
  }

  // TODO: add tests
  draw(
    xy: BpxVector2d,
    bits: string[],
    color: BpxColor,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    xy = xy.round();

    for (let bitsY = 0; bitsY < bits.length; bitsY += 1) {
      for (let bitsX = 0; bitsX < bits[bitsY]!.length; bitsX += 1) {
        if (bits[bitsY]![bitsX] !== "#") {
          continue;
        }

        const canvasXy = xy.add(bitsX, bitsY);
        if (clippingRegion && !clippingRegion.allowsDrawingAt(canvasXy)) {
          return;
        }

        this.#pixel.draw(canvasXy, color);
      }
    }
  }
}
