import { BpxSolidColor } from "../color/SolidColor";
import { CanvasSnapshot } from "./CanvasSnapshot";

export class CanvasSnapshotForTests implements CanvasSnapshot {
  readonly #rgbValues: number[];

  constructor(rgbValues: number[]) {
    this.#rgbValues = rgbValues;
  }

  get(index: number): BpxSolidColor {
    if (index >= this.#rgbValues.length) {
      throw Error(
        `index out of bounds: index = ${index}, max allowed index = ${
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
