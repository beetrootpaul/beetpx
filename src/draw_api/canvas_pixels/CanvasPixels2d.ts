import { BpxSolidColor } from "../../Color";
import { u_ } from "../../Utils";
import { BpxVector2d } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixels2dSnapshot } from "./CanvasPixels2dSnapshot";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";

export class CanvasPixels2d extends CanvasPixels {
  readonly #outImageData: Uint8ClampedArray;
  readonly #length: number;
  readonly #rgbValues: number[];

  constructor(canvasSize: BpxVector2d, outImageData: Uint8ClampedArray) {
    super(canvasSize);

    this.#outImageData = outImageData;

    this.#length = canvasSize.x * canvasSize.y;
    this.#rgbValues = u_.range(this.#length).map(() => 0);
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

  takeSnapshot(): CanvasPixelsSnapshot {
    return new CanvasPixels2dSnapshot([...this.#rgbValues]);
  }

  render(): void {
    for (let index = 0; index < this.#length; index++) {
      const value = this.#rgbValues[index]!;
      const dataIndex = index * 4;
      this.#outImageData[dataIndex] = (value & 0xff0000) >> 16;
      this.#outImageData[dataIndex + 1] = (value & 0x00ff00) >> 8;
      this.#outImageData[dataIndex + 2] = value & 0x0000ff;
    }
  }
}
