import { SolidColor } from "../Color";
import { v_, Vector2d } from "../Vector2d";
import { DrawPixel } from "./DrawPixel";
import { FillPattern } from "./FillPattern";

export class DrawLine {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Vector2d;

  readonly #pixel: DrawPixel;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Vector2d) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;

    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize);
  }

  // TODO: Consider rect and ellipse and line APIs to operate on *inclusive* xy2.
  //       It is strange to have to set xy2 to be at least 1 higher than xy1 in order to draw a straight line.
  // TODO: replace iterated new instances of Vector2d for XY with regular primitive numbers for X and Y
  // Based on http://members.chello.at/easyfilter/bresenham.html
  draw(
    xy1: Vector2d,
    xy2: Vector2d,
    color: SolidColor,
    // TODO: implement fill pattern for the line (?)
    fillPattern: FillPattern = FillPattern.primaryOnly,
  ): void {
    if (Math.abs(xy2.x - xy1.x) <= 0 || Math.abs(xy2.y - xy1.y) <= 0) {
      return;
    }

    // adjust coordinates from right-bottom excluded to included
    [xy1, xy2] = [
      // TODO: add a variant of Vector2d functions that takes 2 params as numbers, w/o a need to wrap with `v_(…)`
      xy1.sub(v_(xy1.x < xy2.x ? 0 : 1, xy1.y < xy2.y ? 0 : 1)),
      xy2.sub(v_(xy2.x < xy1.x ? 0 : 1, xy2.y < xy1.y ? 0 : 1)),
    ];

    //
    // PREPARE
    //

    let dXy = v_(Math.abs(xy2.x - xy1.x), -Math.abs(xy2.y - xy1.y));

    let currentXy = xy1;
    const targetXy = xy2;

    // TODO: introduce `sign` and do `xy2.sub(xy1).sign().mul(1)` here
    const step = v_(xy1.x < xy2.x ? 1 : -1, xy1.y < xy2.y ? 1 : -1);
    let err = dXy.x + dXy.y;

    while (true) {
      //
      // DRAW THE CURRENT PIXEL
      //
      this.#pixel.draw(currentXy, color);

      if (currentXy.eq(targetXy)) break;

      //
      // STEP TO THE NEXT PIXEL
      //
      const errBeforeStep = err;
      if (2 * errBeforeStep >= dXy.y) {
        currentXy = currentXy.add(v_(step.x, 0));
        err += dXy.y;
      }
      if (2 * errBeforeStep <= dXy.x) {
        currentXy = currentXy.add(v_(0, step.y));
        err += dXy.x;
      }
    }
  }
}
