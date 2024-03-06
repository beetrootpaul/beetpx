import { BpxRgbColor } from "../color/RgbColor";
import { BpxVector2d } from "../misc/Vector2d";
import { CanvasSnapshot } from "./CanvasSnapshot";

export abstract class Canvas {
  readonly canvasSize: BpxVector2d;

  #minX: number;
  #minY: number;
  #maxX: number;
  #maxY: number;

  #snapshot: CanvasSnapshot | null = null;

  protected constructor(canvasSize: BpxVector2d) {
    this.canvasSize = canvasSize.round();

    this.#minX = 0;
    this.#minY = 0;
    this.#maxX = this.canvasSize.x - 1;
    this.#maxY = this.canvasSize.y - 1;
  }

  /**
   * @returns - previous clipping region in form of an array: [xy, wh]
   */
  setClippingRegion(
    xy: BpxVector2d,
    wh: BpxVector2d,
  ): [xy: BpxVector2d, wh: BpxVector2d] {
    const prev: [BpxVector2d, BpxVector2d] = [
      BpxVector2d.of(this.#minX, this.#minY),
      BpxVector2d.of(
        (this.#maxX - this.#minX + 1, this.#maxY - this.#minY + 1),
      ),
    ];

    const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(
      xy.round(),
      xy.add(wh).round(),
    );
    this.#minX = xyMinInclusive.x;
    this.#minY = xyMinInclusive.y;
    this.#maxX = xyMaxExclusive.x - 1;
    this.#maxY = xyMaxExclusive.y - 1;

    return prev;
  }

  /**
   * @returns - previous clipping region in form of an array: [xy, wh]
   */
  removeClippingRegion(): [xy: BpxVector2d, wh: BpxVector2d] {
    return this.setClippingRegion(BpxVector2d.of(0, 0), this.canvasSize);
  }

  canSetAny(xMin: number, yMin: number, xMax: number, yMax: number): boolean {
    return (
      xMax >= this.#minX &&
      yMax >= this.#minY &&
      xMin <= this.#maxX &&
      yMin <= this.#maxY
    );
  }

  canSetAt(x: number, y: number): boolean {
    return (
      x >= this.#minX && y >= this.#minY && x <= this.#maxX && y <= this.#maxY
    );
  }

  abstract set(color: BpxRgbColor, x: number, y: number): void;

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
