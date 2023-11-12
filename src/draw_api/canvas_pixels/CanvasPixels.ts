import { BpxSolidColor } from "../../Color";
import { BpxVector2d } from "../../Vector2d";
import {
  BpxCanvasPixelsSnapshotId,
  CanvasPixelsSnapshot,
} from "./CanvasPixelsSnapshot";

export abstract class CanvasPixels {
  readonly canvasSize: BpxVector2d;

  readonly #snapshots: Map<BpxCanvasPixelsSnapshotId, CanvasPixelsSnapshot> =
    new Map();

  // start from 1 to avoid a case when someone checks for ID being truthy and gets `false`, because of value `0`
  #nextSnapshotId: BpxCanvasPixelsSnapshotId = 1;

  protected constructor(canvasSize: BpxVector2d) {
    this.canvasSize = canvasSize.round();
  }

  abstract setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): void;
  abstract removeClippingRegion(): void;

  abstract canSetAny(
    xMin: number,
    yMin: number,
    xMax: number,
    yMax: number,
  ): boolean;
  abstract canSetAt(x: number, y: number): boolean;
  abstract set(color: BpxSolidColor, x: number, y: number): void;

  takeSnapshot(): BpxCanvasPixelsSnapshotId {
    const snapshotId = this.#nextSnapshotId++;
    this.#snapshots.set(snapshotId, this.newSnapshot());
    return snapshotId;
  }

  getSnapshot(
    snapshotId: BpxCanvasPixelsSnapshotId,
  ): CanvasPixelsSnapshot | null {
    return this.#snapshots.get(snapshotId) ?? null;
  }

  protected abstract newSnapshot(): CanvasPixelsSnapshot;

  render(): void {
    this.#snapshots.clear();
    this.#nextSnapshotId = 1;
    this.doRender();
  }

  protected abstract doRender(): void;
}
