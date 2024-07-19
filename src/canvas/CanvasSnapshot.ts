import { BpxRgbColor } from "../color/RgbColor";

export interface CanvasSnapshot {
  getColorAt(x: number, y: number): BpxRgbColor;
}
