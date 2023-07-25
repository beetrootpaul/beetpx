import { SolidColor } from "../Color";
import { Vector2d } from "../Vector2d";

export class DrawClear {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Vector2d;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;
  }

  draw(color: SolidColor): void {
    for (
      let pixel = 0;
      pixel < this.#canvasSize.x * this.#canvasSize.y;
      pixel += 1
    ) {
      const i = pixel * 4;
      this.#canvasBytes[i] = color.r;
      this.#canvasBytes[i + 1] = color.g;
      this.#canvasBytes[i + 2] = color.b;
      this.#canvasBytes[i + 3] = 0xff;
    }
  }
}
