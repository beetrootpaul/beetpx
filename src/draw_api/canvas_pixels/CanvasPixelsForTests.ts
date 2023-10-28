import { BpxSolidColor } from "../../Color";
import { u_ } from "../../Utils";
import { BpxVector2d } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsForTestsSnapshot } from "./CanvasPixelsForTestsSnapshot";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";

export class CanvasPixelsForTests extends CanvasPixels {
  readonly #length: number;
  readonly #rgbValues: number[];

  constructor(canvasSize: BpxVector2d) {
    super(canvasSize);

    this.#length = canvasSize.x * canvasSize.y;
    this.#rgbValues = u_.range(this.#length).map(() => 0);
  }

  wasAlreadySet(x: number, y: number): boolean {
    return false;
  }

  set(color: BpxSolidColor, x: number, y: number): void {
    const index = y * this.canvasSize.x + x;

    if (index >= this.#length) {
      throw Error(
        `CanvasPixels2d: index out of bounds: index = ${index}, maxAllowedIndex = ${
          this.#length - 1
        }`,
      );
    }

    this.#rgbValues[index] = (color.r << 16) + (color.g << 8) + color.b;
  }

  newSnapshot(): CanvasPixelsSnapshot {
    return new CanvasPixelsForTestsSnapshot([...this.#rgbValues]);
  }

  onWindowResize(): void {}

  resetVisitedMarkers(): void {}

  doRender(): void {}
}
