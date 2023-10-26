import { BpxSolidColor } from "../../Color";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";

export class CanvasPixels2dSnapshot implements CanvasPixelsSnapshot {
  readonly #rgbValues: number[];

  constructor(rgbValues: number[]) {
    this.#rgbValues = rgbValues;
  }

  get(index: number): BpxSolidColor {
    const value = this.#rgbValues[index]!;
    return new BpxSolidColor(
      (value & 0xff0000) >> 16,
      (value & 0x00ff00) >> 8,
      value & 0x0000ff,
    );
  }
}
