import { BpxSolidColor } from "../Color";
import { BpxVector2d } from "../Vector2d";
import { BpxClippingRegion } from "./ClippingRegion";

export class DrawClear {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: BpxVector2d;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: BpxVector2d) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize.round();
  }

  // TODO: support ClippingRegion + cover with tests
  draw(
    color: BpxSolidColor,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
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
