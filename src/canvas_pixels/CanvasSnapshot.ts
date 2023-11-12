import { BpxSolidColor } from "../color/SolidColor";

export interface CanvasSnapshot {
  getColorAtIndex(index: number): BpxSolidColor;
}
