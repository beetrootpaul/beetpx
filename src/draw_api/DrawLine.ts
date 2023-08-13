import { SolidColor } from "../Color";
import { v_, Vector2d } from "../Vector2d";
import { ClippingRegion } from "./ClippingRegion";
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

  // TODO: cover ClippingRegion with tests
  // TODO: replace iterated new instances of Vector2d for XY with regular primitive numbers for X and Y
  // Based on http://members.chello.at/easyfilter/bresenham.html
  draw(
    xy: Vector2d,
    wh: Vector2d,
    color: SolidColor,
    // TODO: implement fill pattern for the line (?)
    fillPattern: FillPattern = FillPattern.primaryOnly,
    clippingRegion: ClippingRegion | null = null,
  ): void {
    // check if wh has 0 width or height
    if (wh.x * wh.y === 0) {
      return;
    }

    let [xy1, xy2] = [xy, xy.add(wh)];

    // adjust coordinates from right-bottom excluded to included
    [xy1, xy2] = [
      xy1.sub(xy1.x < xy2.x ? 0 : 1, xy1.y < xy2.y ? 0 : 1),
      xy2.sub(xy2.x < xy1.x ? 0 : 1, xy2.y < xy1.y ? 0 : 1),
    ];

    //
    // PREPARE
    //

    let dXy = v_(Math.abs(xy2.x - xy1.x), -Math.abs(xy2.y - xy1.y));

    let currentXy = xy1;
    const targetXy = xy2;

    const step = xy2.sub(xy1).sign();
    let err = dXy.x + dXy.y;

    while (true) {
      //
      // DRAW THE CURRENT PIXEL
      //
      this.#pixel.draw(currentXy, color, clippingRegion);

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
