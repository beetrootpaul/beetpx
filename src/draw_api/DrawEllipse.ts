import { CompositeColor, MappingColor, SolidColor } from "../Color";
import { Vector2d, v_ } from "../Vector2d";
import { ClippingRegion } from "./ClippingRegion";
import { DrawLine } from "./DrawLine";
import { DrawPixel } from "./DrawPixel";
import { FillPattern } from "./FillPattern";

export class DrawEllipse {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Vector2d;

  readonly #pixel: DrawPixel;
  readonly #line: DrawLine;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;

    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize);
    this.#line = new DrawLine(this.#canvasBytes, this.#canvasSize);
  }

  // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
  // TODO: tests for MappingColor
  // TODO: tests for CompositeColor and fillPattern
  // TODO: cover ClippingRegion with tests
  // Based on http://members.chello.at/easyfilter/bresenham.html
  draw(
    xy: Vector2d,
    wh: Vector2d,
    color: SolidColor | CompositeColor | MappingColor,
    fill: boolean,
    // TODO: implement fill pattern for the ellipse
    fillPattern: FillPattern = FillPattern.primaryOnly,
    clippingRegion: ClippingRegion | null = null,
  ): void {
    xy = xy.round();
    wh = wh.round();

    // check if wh has 0 width or height
    if (wh.x * wh.y === 0) {
      return;
    }

    //
    // PREPARE
    //

    let [a, b] = wh.abs().asArray();
    let b1 = b & 1;

    const [xy1, xy2] = Vector2d.minMax(xy, xy.add(wh));
    let left = xy1.x;
    let right = xy2.x - 1;
    let bottom = xy1.y - 1 + Math.floor((b + 1) / 2);
    let top = bottom - b1 + 1;

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
      this.#pixel.draw(v_(right, bottom), color, clippingRegion);
      this.#pixel.draw(v_(left, bottom), color, clippingRegion);
      this.#pixel.draw(v_(left, top), color, clippingRegion);
      this.#pixel.draw(v_(right, top), color, clippingRegion);
      if (fill) {
        // TODO: update the implementation below to honor fill pattern
        Vector2d.forEachIntXyWithinRectOf(
          v_(left + 1, bottom),
          v_(right - left - 1, 1),
          true,
          (xy) => {
            this.#pixel.draw(xy, color, clippingRegion);
          },
        );
        // TODO: update the implementation below to honor fill pattern
        Vector2d.forEachIntXyWithinRectOf(
          v_(left + 1, top),
          v_(right - left - 1, 1),
          true,
          (xy) => {
            this.#pixel.draw(xy, color, clippingRegion);
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
      this.#pixel.draw(v_(left - 1, bottom), color, clippingRegion);
      this.#pixel.draw(v_(right + 1, bottom), color, clippingRegion);
      bottom += 1;
      this.#pixel.draw(v_(left - 1, top), color, clippingRegion);
      this.#pixel.draw(v_(right + 1, top), color, clippingRegion);
      top -= 1;
    }
  }
}
