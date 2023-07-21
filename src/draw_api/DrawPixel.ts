import { SolidColor } from "../Color";
import { Xy } from "../Xy";

export class DrawPixel {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Xy;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;
  }

  draw(xy: Xy, color: SolidColor): void {
    if (xy.gte(Xy.zero) && xy.lt(this.#canvasSize)) {
      const i = 4 * (xy.y * this.#canvasSize.x + xy.x);
      this.#canvasBytes[i] = color.r;
      this.#canvasBytes[i + 1] = color.g;
      this.#canvasBytes[i + 2] = color.b;
      this.#canvasBytes[i + 3] = 0xff;
    }
  }
}
