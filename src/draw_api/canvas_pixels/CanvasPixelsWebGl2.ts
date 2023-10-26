import { BpxSolidColor } from "../../Color";
import { BpxVector2d } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";
import { CanvasPixelsWebGl2Snapshot } from "./CanvasPixelsWebGl2Snapshot";

export class CanvasPixelsWebGl2 extends CanvasPixels {
  readonly #length: number;

  constructor(canvasSize: BpxVector2d) {
    super(canvasSize);

    this.#length = canvasSize.x * canvasSize.y;
  }

  set(index: number, color: BpxSolidColor): void {
    if (index >= this.#length) {
      throw Error(
        `CanvasPixelsWebGl2: index out of bounds: index = ${index}, maxAllowedIndex = ${
          this.#length - 1
        }`,
      );
    }
    // TODO: ???
  }

  get(index: number): BpxSolidColor {
    if (index >= this.#length) {
      throw Error(
        `CanvasPixelsWebGl2: index out of bounds: index = ${index}, maxAllowedIndex = ${
          this.#length - 1
        }`,
      );
    }

    // TODO: ???
    return BpxSolidColor.fromRgbCssHex("#012345");
  }

  takeSnapshot(): CanvasPixelsSnapshot {
    // TODO: ???
    return new CanvasPixelsWebGl2Snapshot();
  }

  onWindowResize(): void {
    // TODO: ???
  }

  render(): void {
    // TODO: ???
  }
}
