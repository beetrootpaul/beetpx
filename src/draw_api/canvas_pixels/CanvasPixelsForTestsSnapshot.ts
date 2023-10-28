import { BpxSolidColor } from "../../Color";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";

export class CanvasPixelsForTestsSnapshot implements CanvasPixelsSnapshot {
  readonly #rgbValues: number[];

  constructor(rgbValues: number[]) {
    this.#rgbValues = rgbValues;
  }

  get(index: number): BpxSolidColor {
    if (index >= this.#rgbValues.length) {
      throw Error(
        `CanvasPixels2d: index out of bounds: index = ${index}, maxAllowedIndex = ${
          this.#rgbValues.length - 1
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
}
