import { BpxSolidColor } from "../../Color";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";

export class CanvasPixelsWebGl2Snapshot implements CanvasPixelsSnapshot {
  readonly #xyzRgbValues: Float32Array;

  constructor(xyzRgbValues: Float32Array) {
    this.#xyzRgbValues = xyzRgbValues;
  }
  get(index: number): BpxSolidColor {
    // TODO: ???
    return BpxSolidColor.fromRgbCssHex("#123456");
  }
}
