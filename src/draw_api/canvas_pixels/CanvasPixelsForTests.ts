import { BpxSolidColor } from "../../Color";
import { u_ } from "../../Utils";
import { BpxVector2d } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsForTestsSnapshot } from "./CanvasPixelsForTestsSnapshot";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";

export class CanvasPixelsForTests extends CanvasPixels {
  readonly #length: number;
  readonly #rgbValues: number[];

  #minX: number;
  #minY: number;
  #maxX: number;
  #maxY: number;

  constructor(canvasSize: BpxVector2d) {
    super(canvasSize);

    this.#minX = 0;
    this.#minY = 0;
    this.#maxX = canvasSize.x - 1;
    this.#maxY = canvasSize.y - 1;

    this.#length = canvasSize.x * canvasSize.y;
    this.#rgbValues = u_.range(this.#length).map(() => 0);
  }

  setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): void {
    const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(
      xy.round(),
      xy.add(wh).round(),
    );
    this.#minX = xyMinInclusive.x;
    this.#minY = xyMinInclusive.y;
    this.#maxX = xyMaxExclusive.x - 1;
    this.#maxY = xyMaxExclusive.y - 1;
  }

  removeClippingRegion(): void {
    this.#minX = 0;
    this.#minY = 0;
    this.#maxX = this.canvasSize.x - 1;
    this.#maxY = this.canvasSize.y - 1;
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
    return x >= 0 && y >= 0 && x < this.canvasSize.x && y < this.canvasSize.y;
  }

  set(color: BpxSolidColor, x: number, y: number): void {
    if (x < 0 || y < 0 || x >= this.canvasSize.x || y >= this.canvasSize.y) {
      throw Error(
        `(x,y) index out of bounds: (x,y) = (${x},${y}), bottom bound = (0,0), upper bound = (${
          this.canvasSize.x - 1
        },${this.canvasSize.y - 1})`,
      );
    }

    const index = y * this.canvasSize.x + x;

    if (index >= this.#length) {
      throw Error(
        `index out of bounds: index = ${index}, max allowed index = ${
          this.#length - 1
        }`,
      );
    }

    this.#rgbValues[index] = (color.r << 16) + (color.g << 8) + color.b;
  }

  newSnapshot(): CanvasPixelsSnapshot {
    return new CanvasPixelsForTestsSnapshot(this.#rgbValues.slice());
  }

  doRender(): void {}
}
