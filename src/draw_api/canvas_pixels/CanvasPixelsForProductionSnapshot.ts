import { BpxSolidColor } from "../../Color";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";

export class CanvasPixelsForProductionSnapshot implements CanvasPixelsSnapshot {
  readonly #imageDataData: Uint8ClampedArray;

  constructor(imageDataData: Uint8ClampedArray) {
    this.#imageDataData = imageDataData;
  }

  get(index: number): BpxSolidColor {
    if (index >= this.#imageDataData.length / 4) {
      throw Error(
        `CanvasPixels2d: index out of bounds: index = ${index}, maxAllowedIndex = ${
          this.#imageDataData.length / 4 - 1
        }`,
      );
    }

    const dataIndex = index * 4;
    return new BpxSolidColor(
      this.#imageDataData[dataIndex]!,
      this.#imageDataData[dataIndex + 1]!,
      this.#imageDataData[dataIndex + 2]!,
    );
  }
}
