import {
  Color,
  CompositeColor,
  MappingColor,
  SolidColor,
  TransparentColor,
} from "../Color";
import { Vector2d } from "../Vector2d";
import { ClippingRegion } from "./ClippingRegion";
import { FillPattern } from "./FillPattern";

export class DrawPixel {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Vector2d;
  readonly #options: { disableRounding?: boolean };

  constructor(
    canvasBytes: Uint8ClampedArray,
    canvasSize: Vector2d,
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
    xy: Vector2d,
    color: Color,
    clippingRegion: ClippingRegion | null = null,
    fillPattern: FillPattern = FillPattern.primaryOnly,
  ): void {
    xy = this.#options.disableRounding ? xy : xy.round();

    if (clippingRegion && !clippingRegion.allowsDrawingAt(xy)) {
      return;
    }

    if (xy.gte(Vector2d.zero) && xy.lt(this.#canvasSize)) {
      const i = 4 * (xy.y * this.#canvasSize.x + xy.x);

      if (fillPattern.hasPrimaryColorAt(xy)) {
        if (color instanceof CompositeColor) {
          this.#drawSolid(i, color.primary);
        } else if (color instanceof MappingColor) {
          this.#drawSolid(
            i,
            color.getMappedColorFor(
              this.#canvasBytes[i]!,
              this.#canvasBytes[i + 1]!,
              this.#canvasBytes[i + 2]!,
              this.#canvasBytes[i + 3]!,
            ),
          );
        } else {
          this.#drawSolid(i, color);
        }
      } else {
        if (color instanceof CompositeColor) {
          this.#drawSolid(i, color.secondary);
        }
      }
    }
  }

  #drawSolid(canvasIndex: number, color: SolidColor | TransparentColor) {
    if (color instanceof TransparentColor) {
      return;
    }
    this.#canvasBytes[canvasIndex] = color.r;
    this.#canvasBytes[canvasIndex + 1] = color.g;
    this.#canvasBytes[canvasIndex + 2] = color.b;
    this.#canvasBytes[canvasIndex + 3] = 0xff;
  }
}
