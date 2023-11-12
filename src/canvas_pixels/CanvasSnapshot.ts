import { BpxSolidColor } from "../misc/Color";

export type BpxCanvasSnapshotId = number;

export interface CanvasSnapshot {
  get(index: number): BpxSolidColor;
}
