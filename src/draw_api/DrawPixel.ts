import {
  BpxColor,
  BpxCompositeColor,
  BpxMappingColor,
  BpxSolidColor,
  BpxTransparentColor,
} from "../Color";
import { BpxVector2d, v_ } from "../Vector2d";
import { BpxClippingRegion } from "./ClippingRegion";
import { BpxFillPattern } from "./FillPattern";

export class DrawPixel {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: BpxVector2d;
  readonly #options: { disableRounding?: boolean };

  constructor(
    canvasBytes: Uint8ClampedArray,
    canvasSize: BpxVector2d,
    options: { disableRounding?: boolean } = {},
  ) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;
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
    xy = this.#options.disableRounding ? xy : v_.round(xy);

    if (clippingRegion && !clippingRegion.allowsDrawingAt(xy)) {
      return;
    }

    if (v_.gte(xy, [0, 0]) && v_.lt(xy, this.#canvasSize)) {
      const i = 4 * (xy[1] * this.#canvasSize[0] + xy[0]);

      if (fillPattern.hasPrimaryColorAt(xy)) {
        if (color instanceof BpxCompositeColor) {
          this.#drawSolid(i, color.primary);
        } else if (color instanceof BpxMappingColor) {
          // TODO: this doesn't seem right: to wire mapping with snapshot outside the mapped color, even though it contains both
          const mappedColor = color.getMappedColorForCanvasIndex(
            color.canvasSnapshot.canvasBytes[i]!,
            color.canvasSnapshot.canvasBytes[i + 1]!,
            color.canvasSnapshot.canvasBytes[i + 2]!,
            color.canvasSnapshot.canvasBytes[i + 3]!,
          );
          this.#drawSolid(i, mappedColor);
        } else {
          this.#drawSolid(i, color);
        }
      } else {
        if (color instanceof BpxCompositeColor) {
          this.#drawSolid(i, color.secondary);
        }
      }
    }
  }

  #drawSolid(canvasIndex: number, color: BpxSolidColor | BpxTransparentColor) {
    if (color instanceof BpxSolidColor) {
      this.#canvasBytes[canvasIndex] = color.r;
      this.#canvasBytes[canvasIndex + 1] = color.g;
      this.#canvasBytes[canvasIndex + 2] = color.b;
      this.#canvasBytes[canvasIndex + 3] = 0xff;
    }
  }
}
