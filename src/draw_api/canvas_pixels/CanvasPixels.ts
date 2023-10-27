import { BpxSolidColor } from "../../Color";
import { BpxVector2d } from "../../Vector2d";
import {
  BpxCanvasPixelsSnapshotId,
  CanvasPixelsSnapshot,
} from "./CanvasPixelsSnapshot";

export abstract class CanvasPixels {
  readonly canvasSize: BpxVector2d;

  protected constructor(canvasSize: BpxVector2d) {
    this.canvasSize = canvasSize.round();
  }

  abstract set(index: number, color: BpxSolidColor): void;

  abstract takeSnapshot(): BpxCanvasPixelsSnapshotId;

  abstract getSnapshot(
    snapshotId: BpxCanvasPixelsSnapshotId,
  ): CanvasPixelsSnapshot | null;

  abstract onWindowResize(): void;

  abstract render(): void;
}
