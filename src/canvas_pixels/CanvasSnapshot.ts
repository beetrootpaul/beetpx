import { BpxSolidColor } from "../color/SolidColor";

export type BpxCanvasSnapshotId = number;

export interface CanvasSnapshot {
  get(index: number): BpxSolidColor;
}
