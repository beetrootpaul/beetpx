import { BpxSolidColor } from "../Color";
import { u_ } from "../Utils";
import { BpxVector2d } from "../Vector2d";

export class CanvasPixels {
  readonly canvasSize: BpxVector2d;

  readonly #length: number;

  readonly #rgbValues: number[];

  constructor(canvasSize: BpxVector2d, rgbValues?: number[]) {
    this.canvasSize = canvasSize.round();
    this.#length = this.canvasSize.x * this.canvasSize.y;
    this.#rgbValues = u_
      .range(this.#length)
      .map((index) => rgbValues?.[index] ?? 0);
  }

  set(index: number, color: BpxSolidColor): void {
    this.#rgbValues[index] = (color.r << 16) + (color.g << 8) + color.b;
  }

  get(index: number): BpxSolidColor {
    if (index >= this.#length) {
      throw Error(
        `CanvasPixels: index out of bounds: index = ${index}, maxAllowedIndex = ${
          this.#length - 1
        }`,
      );
    }
    const value = this.#rgbValues[index]!;
    return new BpxSolidColor(
      (value & 0xff0000) >> 16,
      (value & 0x00ff00) >> 8,
      value & 0x0000ff,
    );
  }

  clone(): CanvasPixels {
    return new CanvasPixels(this.canvasSize, this.#rgbValues);
  }

  renderTo(htmlCanvasData: Uint8ClampedArray): void {
    for (let index = 0; index < this.#length; index++) {
      const value = this.#rgbValues[index]!;
      const dataIndex = index * 4;
      htmlCanvasData[dataIndex] = (value & 0xff0000) >> 16;
      htmlCanvasData[dataIndex + 1] = (value & 0x00ff00) >> 8;
      htmlCanvasData[dataIndex + 2] = value & 0x0000ff;
    }
  }
}
