import { BpxRgbColor } from "../color/RgbColor";
import { CanvasSnapshot } from "./CanvasSnapshot";

export class CanvasSnapshotForProduction implements CanvasSnapshot {
  readonly #imageDataData: Uint8ClampedArray;
  readonly #canvasWidth: number;

  constructor(imageDataData: Uint8ClampedArray, canvasWidth: number) {
    this.#imageDataData = imageDataData;
    this.#canvasWidth = canvasWidth;
  }

  getColorAt(x: number, y: number): BpxRgbColor {
    const index = y * this.#canvasWidth + x;

    if (index >= this.#imageDataData.length / 4) {
      throw Error(
        `index out of bounds: index = ${index}, max allowed index = ${
          this.#imageDataData.length / 4 - 1
        }`,
      );
    }

    const dataIndex = index * 4;
    return BpxRgbColor.of(
      this.#imageDataData[dataIndex]!,
      this.#imageDataData[dataIndex + 1]!,
      this.#imageDataData[dataIndex + 2]!,
    );
  }
}
