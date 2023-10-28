import {
  BpxColor,
  BpxCompositeColor,
  BpxMappingColor,
  BpxSolidColor,
} from "../Color";
import { u_ } from "../Utils";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { BpxClippingRegion } from "./ClippingRegion";
import { BpxFillPattern } from "./FillPattern";

export class DrawPixel {
  readonly #canvasPixels: CanvasPixels;
  readonly #options: {
    disableRounding?: boolean;
    disableVisitedCheck?: boolean;
  };

  constructor(
    canvasPixels: CanvasPixels,
    options: { disableRounding?: boolean; disableVisitedCheck?: boolean } = {},
  ) {
    this.#canvasPixels = canvasPixels;
    this.#options = options;
  }

  // TODO: consolidate where composite color and fill patterns are handled (look for `instanceof`). Consider renaming fill pattern to e.g. pattern color as well
  // TODO: tests for MappingColor
  // TODO: consider moving fill pattern and composite color support inside here
  // TODO: cover ClippingRegion with tests
  draw(
    x: number,
    y: number,
    color: BpxColor,
    fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    x = this.#options.disableRounding ? x : Math.round(x);
    y = this.#options.disableRounding ? y : Math.round(y);

    if (
      !this.#options.disableVisitedCheck &&
      this.#canvasPixels.wasAlreadySet(x, y)
    ) {
      return;
    }

    if (clippingRegion && !clippingRegion.allowsDrawingAt(x, y)) {
      return;
    }

    if (
      x >= 0 &&
      y >= 0 &&
      x < this.#canvasPixels.canvasSize.x &&
      y < this.#canvasPixels.canvasSize.y
    ) {
      if (fillPattern.hasPrimaryColorAt(x, y)) {
        if (color instanceof BpxSolidColor) {
          this.#canvasPixels.set(color, x, y);
        } else if (color instanceof BpxCompositeColor) {
          if (color.primary instanceof BpxSolidColor) {
            this.#canvasPixels.set(color.primary, x, y);
          }
        } else if (color instanceof BpxMappingColor) {
          const snapshot =
            this.#canvasPixels.getSnapshot(color.snapshotId) ??
            u_.throwError(
              `Tried to access a non-existent canvas snapshot of ID: ${color.snapshotId}`,
            );
          const mapped = color.getMappedColorFromCanvasSnapshot(
            snapshot,
            y * this.#canvasPixels.canvasSize.x + x,
          );
          if (mapped instanceof BpxSolidColor) {
            this.#canvasPixels.set(mapped, x, y);
          }
        }
      } else {
        if (color instanceof BpxCompositeColor) {
          if (color.secondary instanceof BpxSolidColor) {
            this.#canvasPixels.set(color.secondary, x, y);
          }
        }
      }
    }
  }
}
