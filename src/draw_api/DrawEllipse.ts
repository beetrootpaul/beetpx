import { BpxCompositeColor, BpxMappingColor, BpxSolidColor } from "../Color";
import { u_ } from "../Utils";
import { BpxVector2d } from "../Vector2d";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { CanvasPixelsSnapshot } from "./canvas_pixels/CanvasPixelsSnapshot";
import { BpxClippingRegion } from "./ClippingRegion";
import { BpxFillPattern } from "./FillPattern";

export class DrawEllipse {
  readonly #canvasPixels: CanvasPixels;

  constructor(canvasPixels: CanvasPixels) {
    this.#canvasPixels = canvasPixels;
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
    const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(
      xy.round(),
      xy.add(wh).round(),
    );

    if (
      xyMaxExclusive.x - xyMinInclusive.x <= 0 ||
      xyMaxExclusive.y - xyMinInclusive.y <= 0
    ) {
      return;
    }

    // avoid all computations if the whole rectangle is outside the canvas
    if (
      xyMaxExclusive.x <= 0 ||
      xyMaxExclusive.y <= 0 ||
      xyMinInclusive.x >= this.#canvasPixels.canvasSize.x ||
      xyMinInclusive.y >= this.#canvasPixels.canvasSize.y
    ) {
      return;
    }

    const c1: BpxSolidColor | BpxMappingColor | null =
      color instanceof BpxCompositeColor
        ? color.primary instanceof BpxSolidColor
          ? color.primary
          : null
        : color;
    const c2: BpxSolidColor | null =
      color instanceof BpxCompositeColor
        ? color.secondary instanceof BpxSolidColor
          ? color.secondary
          : null
        : null;
    const sn =
      c1 instanceof BpxMappingColor
        ? this.#canvasPixels.getSnapshot(c1.snapshotId) ??
          u_.throwError(
            `Tried to access a non-existent canvas snapshot of ID: ${c1.snapshotId}`,
          )
        : null;

    const fp = fillPattern;
    const cr = clippingRegion;

    //
    // PREPARE
    //

    let a = xyMaxExclusive.x - xyMinInclusive.x - 1;
    let b = xyMaxExclusive.y - xyMinInclusive.y - 1;
    let b1 = b & 1;

    let left = xyMinInclusive.x;
    let right = xyMaxExclusive.x - 1;
    let bottom = xyMinInclusive.y + Math.floor((b + 1) / 2);
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

      this.#drawPixel(right, bottom, c1, c2, fp, cr, sn);
      this.#drawPixel(left, bottom, c1, c2, fp, cr, sn);
      this.#drawPixel(left, top, c1, c2, fp, cr, sn);
      this.#drawPixel(right, top, c1, c2, fp, cr, sn);
      if (fill) {
        for (let x = left + 1; x < right; x++) {
          this.#drawPixel(x, top, c1, c2, fp, cr, sn);
          this.#drawPixel(x, bottom, c1, c2, fp, cr, sn);
        }
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

      this.#drawPixel(left - 1, bottom, c1, c2, fp, cr, sn);
      this.#drawPixel(right + 1, bottom, c1, c2, fp, cr, sn);
      bottom += 1;
      this.#drawPixel(left - 1, top, c1, c2, fp, cr, sn);
      this.#drawPixel(right + 1, top, c1, c2, fp, cr, sn);
      top -= 1;
    }
  }

  #drawPixel(
    x: number,
    y: number,
    c1: BpxSolidColor | BpxMappingColor | null,
    c2: BpxSolidColor | null,
    fillPattern: BpxFillPattern,
    clippingRegion: BpxClippingRegion | null,
    snapshot: CanvasPixelsSnapshot | null,
  ): void {
    if (this.#canvasPixels.wasAlreadySet(x, y)) {
      return;
    }

    if (clippingRegion && !clippingRegion.allowsDrawingAt(x, y)) {
      return;
    }

    if (fillPattern.hasPrimaryColorAt(x, y)) {
      if (!c1) {
      } else if (c1 instanceof BpxSolidColor) {
        this.#canvasPixels.set(c1, x, y);
      } else {
        const mapped = c1.getMappedColorFromCanvasSnapshot(
          snapshot ??
            u_.throwError(
              "Snapshot was not passed when trying to obtain a mapped color",
            ),
          y * this.#canvasPixels.canvasSize.x + x,
        );
        if (mapped instanceof BpxSolidColor) {
          this.#canvasPixels.set(mapped, x, y);
        }
      }
    } else {
      if (c2 != null) {
        this.#canvasPixels.set(c2, x, y);
      }
    }
  }
}
