import { SolidColor } from "../Color";
import { Vector2d } from "../Vector2d";

export class DrawPixel {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Vector2d;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;
  }

  draw(xy: Vector2d, color: SolidColor): void {
    if (xy.gte(Vector2d.zero) && xy.lt(this.#canvasSize)) {
      const i = 4 * (xy.y * this.#canvasSize.x + xy.x);
      this.#canvasBytes[i] = color.r;
      this.#canvasBytes[i + 1] = color.g;
      this.#canvasBytes[i + 2] = color.b;
      this.#canvasBytes[i + 3] = 0xff;
    }
  }
}
