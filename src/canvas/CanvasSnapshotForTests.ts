import { BpxRgbColor } from "../color/RgbColor";
import { BpxCanvasSnapshot } from "./CanvasSnapshot";

export class CanvasSnapshotForTests implements BpxCanvasSnapshot {
  readonly #rgbValues: number[];
  readonly #canvasWidth: number;

  constructor(rgbValues: number[], canvasWidth: number) {
    this.#rgbValues = rgbValues;
    this.#canvasWidth = canvasWidth;
  }

  getColorAt(x: number, y: number): BpxRgbColor {
    const index = y * this.#canvasWidth + x;

    if (index >= this.#rgbValues.length) {
      throw Error(
        `index out of bounds: index = ${index}, max allowed index = ${
          this.#rgbValues.length - 1
        }`,
      );
    }

    const value = this.#rgbValues[index]!;
    return BpxRgbColor.of(
      (value & 0xff0000) >> 16,
      (value & 0x00ff00) >> 8,
      value & 0x0000ff,
    );
  }
}
