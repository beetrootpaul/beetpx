import { BpxSolidColor } from "../../Color";

export type BpxCanvasPixelsSnapshotId = number;

export interface CanvasPixelsSnapshot {
  get(index: number): BpxSolidColor;
}
