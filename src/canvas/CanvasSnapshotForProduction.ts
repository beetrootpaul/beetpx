import { BpxRgbColor } from "../color/RgbColor";
import { CanvasSnapshot } from "./CanvasSnapshot";

export class CanvasSnapshotForProduction implements CanvasSnapshot {
  readonly #imageDataData: Uint8ClampedArray;

  constructor(imageDataData: Uint8ClampedArray) {
    this.#imageDataData = imageDataData;
  }

  getColorAtIndex(index: number): BpxRgbColor {
    if (index >= this.#imageDataData.length / 4) {
      throw Error(
        `index out of bounds: index = ${index}, max allowed index = ${
          this.#imageDataData.length / 4 - 1
        }`,
      );
    }

    const dataIndex = index * 4;
    return new BpxRgbColor(
      this.#imageDataData[dataIndex]!,
      this.#imageDataData[dataIndex + 1]!,
      this.#imageDataData[dataIndex + 2]!,
    );
  }
}
