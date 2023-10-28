import { BpxCompositeColor, BpxMappingColor, BpxSolidColor } from "../Color";
import { u_ } from "../Utils";
import { BpxVector2d } from "../Vector2d";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { CanvasPixelsSnapshot } from "./canvas_pixels/CanvasPixelsSnapshot";
import { BpxClippingRegion } from "./ClippingRegion";
import { BpxFillPattern } from "./FillPattern";

export class DrawRect {
  readonly #canvasPixels: CanvasPixels;

  constructor(canvasPixels: CanvasPixels) {
    this.#canvasPixels = canvasPixels;
  }

  // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
  // TODO: tests for MappingColor
  // TODO: tests for CompositeColor and fillPattern
  // TODO: cover ClippingRegion with tests
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

    // avoid all computations if the rectangle has a size of 0 in either direction
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

    for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
      if (fill || y === xyMinInclusive.y || y === xyMaxExclusive.y - 1) {
        for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
          this.#drawPixel(x, y, c1, c2, fp, cr, sn);
        }
      } else {
        this.#drawPixel(xyMinInclusive.x, y, c1, c2, fp, cr, sn);
        this.#drawPixel(xyMaxExclusive.x - 1, y, c1, c2, fp, cr, sn);
      }
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
