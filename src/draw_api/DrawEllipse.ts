import { BpxCompositeColor, BpxMappingColor, BpxSolidColor } from "../Color";
import { BpxVector2d, v2d_, v_ } from "../Vector2d";
import { BpxClippingRegion } from "./ClippingRegion";
import { DrawPixel } from "./DrawPixel";
import { BpxFillPattern } from "./FillPattern";

export class DrawEllipse {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: BpxVector2d;

  readonly #pixel: DrawPixel;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: BpxVector2d) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = v_.round(canvasSize);

    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize, {
      disableRounding: true,
    });
  }

  // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
  // TODO: tests for MappingColor
  // TODO: tests for CompositeColor and fillPattern
  // TODO: cover ClippingRegion with tests
  // Based on http://members.chello.at/easyfilter/bresenham.html
  draw(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
    fill: boolean,
    fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    const [xy1, xy2] = v_.minMax(v_.round(xy), v_.round(v_.add(xy, wh)));

    if (xy2[0] - xy1[0] <= 0 || xy2[1] - xy1[1] <= 0) {
      return;
    }

    //
    // PREPARE
    //

    let a = xy2[0] - xy1[0] - 1;
    let b = xy2[1] - xy1[1] - 1;
    let b1 = b & 1;

    let left = xy1[0];
    let right = xy2[0] - 1;
    let bottom = xy1[1] + Math.floor((b + 1) / 2);
    let top = bottom - b1;

    let errIncrementX = 4 * (1 - a) * b * b;
    let errIncrementY = 4 * (b1 + 1) * a * a;
    let currentErr = errIncrementX + errIncrementY + b1 * a * a;

    a = 8 * a * a;
    b1 = 8 * b * b;

    do {
      //
      // DRAW THE CURRENT PIXEL IN EACH QUADRANT
      //

      // TODO: update the implementation below to honor fill pattern
      this.#pixel.draw(v2d_(right, bottom), color, clippingRegion, fillPattern);
      this.#pixel.draw(v2d_(left, bottom), color, clippingRegion, fillPattern);
      this.#pixel.draw(v2d_(left, top), color, clippingRegion, fillPattern);
      this.#pixel.draw(v2d_(right, top), color, clippingRegion, fillPattern);
      if (fill) {
        // TODO: update the implementation below to honor fill pattern
        v_.forEachIntXyWithinRectOf(
          v2d_(left + 1, bottom),
          v2d_(right - left - 1, 1),
          false,
          true,
          (xy) => {
            this.#pixel.draw(xy, color, clippingRegion, fillPattern);
          },
        );
        // TODO: update the implementation below to honor fill pattern
        v_.forEachIntXyWithinRectOf(
          v2d_(left + 1, top),
          v2d_(right - left - 1, 1),
          false,
          true,
          (xy) => {
            this.#pixel.draw(xy, color, clippingRegion, fillPattern);
          },
        );
      }

      //
      // STEP TO THE NEXT PIXEL
      //

      const currentErrBeforeStep = currentErr;
      if (2 * currentErrBeforeStep <= errIncrementY) {
        bottom += 1;
        top -= 1;
        errIncrementY += a;
        currentErr += errIncrementY;
      }
      if (
        2 * currentErrBeforeStep >= errIncrementX ||
        2 * currentErr > errIncrementY
      ) {
        left += 1;
        right -= 1;
        errIncrementX += b1;
        currentErr += errIncrementX;
      }
    } while (left <= right);

    //
    // DRAW MISSING TOP & BOTTOM PARTS
    //

    while (bottom - top <= b) {
      // TODO: update the implementation below to honor fill pattern
      this.#pixel.draw(
        v2d_(left - 1, bottom),
        color,
        clippingRegion,
        fillPattern,
      );
      this.#pixel.draw(
        v2d_(right + 1, bottom),
        color,
        clippingRegion,
        fillPattern,
      );
      bottom += 1;
      this.#pixel.draw(v2d_(left - 1, top), color, clippingRegion, fillPattern);
      this.#pixel.draw(
        v2d_(right + 1, top),
        color,
        clippingRegion,
        fillPattern,
      );
      top -= 1;
    }
  }
}
