import { BpxRgbColor } from "../color/RgbColor";

export interface CanvasSnapshot {
  getColorAtIndex(index: number): BpxRgbColor;
}
