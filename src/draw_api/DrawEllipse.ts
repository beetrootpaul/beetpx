import { SolidColor } from "../Color";
import { Vector2d, v_ } from "../Vector2d";
import { DrawPixel } from "./DrawPixel";
import { FillPattern } from "./FillPattern";

export class DrawEllipse {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Vector2d;

  readonly #pixel: DrawPixel;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;

    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize);
  }

  // Based on http://members.chello.at/easyfilter/bresenham.html
  draw(
    xy1: Vector2d,
    xy2: Vector2d,
    color: SolidColor,
    fill: boolean,
    // TODO: implement fill pattern for the ellipse
    fillPattern: FillPattern = FillPattern.primaryOnly,
  ): void {
    if (Math.abs(xy2.x - xy1.x) <= 0 || Math.abs(xy2.y - xy1.y) <= 0) {
      return;
    }

    // swap coordinates to make sure xy1 is the left-bottom corner and xy2 is the right-top one
    [xy1, xy2] = [
      v_(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y)),
      v_(Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y)),
    ];

    //
    // PREPARE
    //

    let a = xy2.x - xy1.x - 1;
    let b = xy2.y - xy1.y - 1;
    let b1 = b & 1;

    let left = xy1.x;
    let right = xy2.x - 1;
    let bottom = xy1.y + Math.floor((b + 1) / 2);
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
      this.#pixel.draw(v_(right, bottom), color);
      this.#pixel.draw(v_(left, bottom), color);
      this.#pixel.draw(v_(left, top), color);
      this.#pixel.draw(v_(right, top), color);
      if (fill) {
        // TODO: update the implementation below to honor fill pattern
        Vector2d.forEachIntXyWithinRectOf(
          v_(left + 1, bottom),
          v_(right - 1, bottom).add(1),
          true,
          (xy) => {
            this.#pixel.draw(xy, color);
          },
        );
        // TODO: update the implementation below to honor fill pattern
        Vector2d.forEachIntXyWithinRectOf(
          v_(left + 1, top),
          v_(right - 1, top).add(1),
          true,
          (xy) => {
            this.#pixel.draw(xy, color);
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

    // TODO: Cover this with tests
    while (bottom - top < b) {
      // TODO: update the implementation below to honor fill pattern
      this.#pixel.draw(v_(left - 1, bottom), color);
      this.#pixel.draw(v_(right + 1, bottom), color);
      bottom += 1;
      this.#pixel.draw(v_(left - 1, top), color);
      this.#pixel.draw(v_(right + 1, top), color);
      top -= 1;
    }
  }
}
