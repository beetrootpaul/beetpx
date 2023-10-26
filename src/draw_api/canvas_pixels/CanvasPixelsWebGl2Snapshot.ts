import { BpxSolidColor } from "../../Color";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";

export class CanvasPixelsWebGl2Snapshot implements CanvasPixelsSnapshot {
  get(index: number): BpxSolidColor {
    // TODO: ???
    return BpxSolidColor.fromRgbCssHex("#123456");
  }
}
