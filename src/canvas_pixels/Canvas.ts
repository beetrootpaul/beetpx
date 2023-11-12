import { BpxSolidColor } from "../misc/Color";
import { BpxVector2d } from "../misc/Vector2d";
import { BpxCanvasSnapshotId, CanvasSnapshot } from "./CanvasSnapshot";

export abstract class Canvas {
  readonly canvasSize: BpxVector2d;

  readonly #snapshots: Map<BpxCanvasSnapshotId, CanvasSnapshot> = new Map();

  // start from 1 to avoid a case when someone checks for ID being truthy and gets `false`, because of value `0`
  #nextSnapshotId: BpxCanvasSnapshotId = 1;

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

  takeSnapshot(): BpxCanvasSnapshotId {
    const snapshotId = this.#nextSnapshotId++;
    this.#snapshots.set(snapshotId, this.newSnapshot());
    return snapshotId;
  }

  getSnapshot(snapshotId: BpxCanvasSnapshotId): CanvasSnapshot | null {
    return this.#snapshots.get(snapshotId) ?? null;
  }

  protected abstract newSnapshot(): CanvasSnapshot;

  render(): void {
    this.#snapshots.clear();
    this.#nextSnapshotId = 1;
    this.doRender();
  }

  protected abstract doRender(): void;
}
