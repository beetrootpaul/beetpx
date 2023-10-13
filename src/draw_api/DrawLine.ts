import { BpxCompositeColor, BpxMappingColor, BpxSolidColor } from "../Color";
import { BpxVector2d, v2d_, v_ } from "../Vector2d";
import { BpxClippingRegion } from "./ClippingRegion";
import { DrawPixel } from "./DrawPixel";
import { BpxFillPattern } from "./FillPattern";

export class DrawLine {
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
  // TODO: replace iterated new instances of Vector2d for XY with regular primitive numbers for X and Y
  // Based on http://members.chello.at/easyfilter/bresenham.html
  draw(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
    fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    // When drawing a line, the order of drawing does matter. This is why we
    //   do not speak about xy1 (left-top) and xy2 (right-bottom) as in other
    //   shapes, but about xyStart and xyEnd.
    const xyStart = v_.round(xy);
    const xyEnd = v_.round(v_.add(xy, wh));
    if (xyEnd[0] - xyStart[0] === 0 || xyEnd[1] - xyStart[1] === 0) {
      return;
    }
    // We cannot just round wh, because we don't want to lose the precision of xy+wh.
    //   But what we can do (and we do here) is to round xyStart and xyEnd calculated
    //   with xy+wh, and the obtain a new wh as xyEnd-xyStart, which makes it rounded.
    wh = v_.sub(xyEnd, xyStart);

    const whSub1 = v_.sub(wh, v_.sign(wh));

    //
    // PREPARE
    //

    let dXy = v_.mul(v_.abs(whSub1), v2d_(1, -1));

    let currentXy = xyStart;
    const targetXy = v_.add(xyStart, whSub1);

    const step = v_.sign(whSub1);
    let err = dXy[0] + dXy[1];

    while (true) {
      //
      // DRAW THE CURRENT PIXEL
      //
      this.#pixel.draw(currentXy, color, clippingRegion, fillPattern);

      if (v_.eq(currentXy, targetXy)) break;

      //
      // STEP TO THE NEXT PIXEL
      //
      const errBeforeStep = err;
      if (2 * errBeforeStep >= dXy[1]) {
        currentXy = v_.add(currentXy, v2d_(step[0], 0));
        err += dXy[1];
      }
      if (2 * errBeforeStep <= dXy[0]) {
        currentXy = v_.add(currentXy, v2d_(0, step[1]));
        err += dXy[0];
      }
    }
  }
}
