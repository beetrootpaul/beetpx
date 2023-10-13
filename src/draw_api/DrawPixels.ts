import { BpxColor } from "../Color";
import { BpxVector2d, v2d_, v_ } from "../Vector2d";
import { BpxClippingRegion } from "./ClippingRegion";
import { DrawPixel } from "./DrawPixel";

export class DrawPixels {
  readonly #pixel: DrawPixel;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: BpxVector2d) {
    this.#pixel = new DrawPixel(canvasBytes, canvasSize);
  }

  // TODO: add tests
  draw(
    xy: BpxVector2d,
    bits: string[],
    color: BpxColor,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    xy = v_.round(xy);

    for (let bitsY = 0; bitsY < bits.length; bitsY += 1) {
      for (let bitsX = 0; bitsX < bits[bitsY]!.length; bitsX += 1) {
        if (bits[bitsY]![bitsX] !== "#") {
          continue;
        }

        const canvasXy = v_.add(xy, v2d_(bitsX, bitsY));
        if (clippingRegion && !clippingRegion.allowsDrawingAt(canvasXy)) {
          return;
        }

        this.#pixel.draw(canvasXy, color);
      }
    }
  }
}
