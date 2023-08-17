import { CompositeColor, MappingColor, SolidColor } from "../Color";
import { Vector2d, v_ } from "../Vector2d";
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

  // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
  // TODO: tests for MappingColor
  // TODO: tests for CompositeColor and fillPattern
  // TODO: cover ClippingRegion with tests
  // TODO: replace iterated new instances of Vector2d for XY with regular primitive numbers for X and Y
  // Based on http://members.chello.at/easyfilter/bresenham.html
  draw(
    xy: Vector2d,
    wh: Vector2d,
    color: SolidColor | CompositeColor | MappingColor,
    // TODO: implement fill pattern for the line (?)
    fillPattern: FillPattern = FillPattern.primaryOnly,
    clippingRegion: ClippingRegion | null = null,
  ): void {
    xy = xy.round();
    wh = wh.round();

    // check if wh has 0 width or height
    if (wh.x * wh.y === 0) {
      return;
    }

    const whSub1 = wh.sub(wh.sign());

    //
    // PREPARE
    //

    let dXy = whSub1.abs().mul(v_(1, -1));

    let currentXy = xy;
    const targetXy = xy.add(whSub1);

    const step = whSub1.sign();
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
