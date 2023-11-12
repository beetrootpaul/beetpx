import { u_ } from "../Utils";
import { Canvas } from "../canvas_pixels/Canvas";
import { CanvasSnapshot } from "../canvas_pixels/CanvasSnapshot";
import { BpxCompositeColor } from "../color/CompositeColor";
import { BpxMappingColor } from "../color/MappingColor";
import { BpxSolidColor } from "../color/SolidColor";
import { BpxVector2d } from "../misc/Vector2d";
import { BpxFillPattern } from "./FillPattern";

export class DrawRect {
  readonly #canvas: Canvas;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;
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
      !this.#canvas.canSetAny(
        xyMinInclusive.x,
        xyMinInclusive.y,
        xyMaxExclusive.x - 1,
        xyMaxExclusive.y - 1,
      )
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
        ? this.#canvas.getSnapshot(c1.snapshotId) ??
          u_.throwError(
            `Tried to access a non-existent canvas snapshot of ID: ${c1.snapshotId}`,
          )
        : null;

    const fp = fillPattern;

    for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
      if (fill || y === xyMinInclusive.y || y === xyMaxExclusive.y - 1) {
        for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
          this.#drawPixel(x, y, c1, c2, fp, sn);
        }
      } else {
        this.#drawPixel(xyMinInclusive.x, y, c1, c2, fp, sn);
        this.#drawPixel(xyMaxExclusive.x - 1, y, c1, c2, fp, sn);
      }
    }
  }

  #drawPixel(
    x: number,
    y: number,
    c1: BpxSolidColor | BpxMappingColor | null,
    c2: BpxSolidColor | null,
    fillPattern: BpxFillPattern,
    snapshot: CanvasSnapshot | null,
  ): void {
    if (!this.#canvas.canSetAt(x, y)) {
      return;
    }

    if (fillPattern.hasPrimaryColorAt(x, y)) {
      if (!c1) {
      } else if (c1 instanceof BpxSolidColor) {
        this.#canvas.set(c1, x, y);
      } else {
        const mapped = c1.getMappedColorFromCanvasSnapshot(
          snapshot ??
            u_.throwError(
              "Snapshot was not passed when trying to obtain a mapped color",
            ),
          y * this.#canvas.canvasSize.x + x,
        );
        if (mapped instanceof BpxSolidColor) {
          this.#canvas.set(mapped, x, y);
        }
      }
    } else {
      if (c2 != null) {
        this.#canvas.set(c2, x, y);
      }
    }
  }
}
