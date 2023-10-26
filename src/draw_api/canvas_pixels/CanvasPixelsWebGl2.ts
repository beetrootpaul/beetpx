import { BpxSolidColor } from "../../Color";
import { BpxVector2d } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";
import { CanvasPixelsWebGl2Snapshot } from "./CanvasPixelsWebGl2Snapshot";

export class CanvasPixelsWebGl2 extends CanvasPixels {
  constructor(canvasSize: BpxVector2d) {
    super(canvasSize);
  }

  set(index: number, color: BpxSolidColor): void {
    // TODO: ???
  }

  get(index: number): BpxSolidColor {
    // TODO: ???
    return BpxSolidColor.fromRgbCssHex("#012345");
  }

  takeSnapshot(): CanvasPixelsSnapshot {
    // TODO: ???
    return new CanvasPixelsWebGl2Snapshot();
  }

  render(): void {
    // TODO: ???
  }
}
