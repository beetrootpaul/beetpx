import { BpxSolidColor } from "../../Color";

export interface CanvasPixelsSnapshot {
  get(index: number): BpxSolidColor;
}
