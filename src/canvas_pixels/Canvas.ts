import { BpxSolidColor } from "../color/SolidColor";
import { BpxVector2d } from "../misc/Vector2d";
import { CanvasSnapshot } from "./CanvasSnapshot";

export abstract class Canvas {
  readonly canvasSize: BpxVector2d;

  #snapshot: CanvasSnapshot | null = null;

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

  takeSnapshot(): void {
    this.#snapshot = this.newSnapshot();
  }

  getMostRecentSnapshot(): CanvasSnapshot | null {
    return this.#snapshot;
  }

  protected abstract newSnapshot(): CanvasSnapshot;

  render(): void {
    this.#snapshot = null;
    this.doRender();
  }

  protected abstract doRender(): void;
}
