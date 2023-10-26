import { BpxSolidColor } from "../../Color";
import { u_ } from "../../Utils";
import { BpxVector2d } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixels2dSnapshot } from "./CanvasPixels2dSnapshot";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";

export class CanvasPixelsNoRender extends CanvasPixels {
  readonly #length: number;
  readonly #rgbValues: number[];

  constructor(canvasSize: BpxVector2d) {
    super(canvasSize);

    this.#length = canvasSize.x * canvasSize.y;
    this.#rgbValues = u_.range(this.#length).map(() => 0);
  }

  set(index: number, color: BpxSolidColor): void {
    if (index >= this.#length) {
      throw Error(
        `CanvasPixelsNoRender: index out of bounds: index = ${index}, maxAllowedIndex = ${
          this.#length - 1
        }`,
      );
    }

    this.#rgbValues[index] = (color.r << 16) + (color.g << 8) + color.b;
  }

  takeSnapshot(): CanvasPixelsSnapshot {
    return new CanvasPixels2dSnapshot([...this.#rgbValues]);
  }

  onWindowResize(): void {}

  render(): void {}
}
