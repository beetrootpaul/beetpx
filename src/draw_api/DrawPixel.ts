import {
  BpxColor,
  BpxCompositeColor,
  BpxMappingColor,
  BpxSolidColor,
  BpxTransparentColor,
} from "../Color";
import { BpxVector2d, v_0_0_ } from "../Vector2d";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { BpxClippingRegion } from "./ClippingRegion";
import { BpxFillPattern } from "./FillPattern";

export class DrawPixel {
  readonly #canvasPixels: CanvasPixels;
  readonly #options: { disableRounding?: boolean };

  constructor(
    canvasPixels: CanvasPixels,
    options: { disableRounding?: boolean } = {},
  ) {
    this.#canvasPixels = canvasPixels;
    this.#options = options;
  }

  // TODO: consolidate where composite color and fill patterns are handled (look for `instanceof`). Consider renaming fill pattern to e.g. pattern color as well
  // TODO: tests for MappingColor
  // TODO: consider moving fill pattern and composite color support inside here
  // TODO: cover ClippingRegion with tests
  draw(
    xy: BpxVector2d,
    color: BpxColor,
    clippingRegion: BpxClippingRegion | null = null,
    fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly,
  ): void {
    xy = this.#options.disableRounding ? xy : xy.round();

    if (clippingRegion && !clippingRegion.allowsDrawingAt(xy)) {
      return;
    }

    if (xy.gte(v_0_0_) && xy.lt(this.#canvasPixels.canvasSize)) {
      const index = xy.y * this.#canvasPixels.canvasSize.x + xy.x;

      if (fillPattern.hasPrimaryColorAt(xy)) {
        if (color instanceof BpxCompositeColor) {
          this.#drawSolid(index, color.primary);
        } else if (color instanceof BpxMappingColor) {
          this.#drawSolid(index, color.getMappedColorFromCanvasSnapshot(index));
        } else {
          this.#drawSolid(index, color);
        }
      } else {
        if (color instanceof BpxCompositeColor) {
          this.#drawSolid(index, color.secondary);
        }
      }
    }
  }

  #drawSolid(canvasIndex: number, color: BpxSolidColor | BpxTransparentColor) {
    if (color instanceof BpxSolidColor) {
      this.#canvasPixels.set(canvasIndex, color);
    }
  }
}
