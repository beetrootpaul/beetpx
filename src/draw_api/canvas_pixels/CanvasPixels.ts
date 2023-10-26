import { BpxSolidColor } from "../../Color";
import { BpxVector2d } from "../../Vector2d";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";

export abstract class CanvasPixels {
  readonly canvasSize: BpxVector2d;

  protected constructor(canvasSize: BpxVector2d) {
    this.canvasSize = canvasSize.round();
  }

  abstract takeSnapshot(): CanvasPixelsSnapshot;

  abstract set(index: number, color: BpxSolidColor): void;

  abstract get(index: number): BpxSolidColor;

  abstract render(): void;
}
