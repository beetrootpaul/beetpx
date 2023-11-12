import { Canvas } from "../canvas_pixels/Canvas";
import { CanvasSnapshot } from "../canvas_pixels/CanvasSnapshot";
import { BpxCanvasSnapshotColorMapping } from "../color/CanvasSnapshotColorMapping";
import { BpxCompositeColor } from "../color/CompositeColor";
import { BpxRgbColor } from "../color/RgbColor";
import { BpxVector2d, v_ } from "../misc/Vector2d";
import { BpxFillPattern } from "./FillPattern";

export class DrawLine {
  readonly #canvas: Canvas;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;
  }

  // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
  // TODO: tests for MappingColor
  // TODO: tests for CompositeColor and fillPattern
  // TODO: cover ClippingRegion with tests

  // Based on http://members.chello.at/easyfilter/bresenham.html
  draw(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxCompositeColor | BpxCanvasSnapshotColorMapping,
    fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly,
  ): void {
    // When drawing a line, the order of drawing does matter. This is why we
    //   do not speak about xy1 (left-top) and xy2 (right-bottom) as in other
    //   shapes, but about xyStart and xyEnd.
    const xyStart = xy.round();
    const xyEnd = xy.add(wh).round();
    if (xyEnd.x - xyStart.x === 0 || xyEnd.y - xyStart.y === 0) {
      return;
    }
    // We cannot just round wh, because we don't want to lose the precision of xy+wh.
    //   But what we can do (and we do here) is to round xyStart and xyEnd calculated
    //   with xy+wh, and the obtain a new wh as xyEnd-xyStart, which makes it rounded.
    wh = xyEnd.sub(xyStart);

    const whSub1 = wh.sub(wh.sign());

    const c1: BpxRgbColor | BpxCanvasSnapshotColorMapping | null =
      color instanceof BpxCompositeColor
        ? color.primary instanceof BpxRgbColor
          ? color.primary
          : null
        : color;
    const c2: BpxRgbColor | null =
      color instanceof BpxCompositeColor
        ? color.secondary instanceof BpxRgbColor
          ? color.secondary
          : null
        : null;
    const sn =
      c1 instanceof BpxCanvasSnapshotColorMapping
        ? this.#canvas.getMostRecentSnapshot()
        : null;

    const fp = fillPattern;

    //
    // PREPARE
    //

    let dXy = whSub1.abs().mul(v_(1, -1));

    let currentXy = xyStart;
    const targetXy = xyStart.add(whSub1);

    const step = whSub1.sign();
    let err = dXy.x + dXy.y;

    while (true) {
      //
      // DRAW THE CURRENT PIXEL
      //
      this.#drawPixel(currentXy.x, currentXy.y, c1, c2, fp, sn);

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

  #drawPixel(
    x: number,
    y: number,
    c1: BpxRgbColor | BpxCanvasSnapshotColorMapping | null,
    c2: BpxRgbColor | null,
    fillPattern: BpxFillPattern,
    snapshot: CanvasSnapshot | null,
  ): void {
    if (!this.#canvas.canSetAt(x, y)) {
      return;
    }

    if (fillPattern.hasPrimaryColorAt(x, y)) {
      if (!c1) {
      } else if (c1 instanceof BpxRgbColor) {
        this.#canvas.set(c1, x, y);
      } else {
        const mapped = c1.getMappedColor(
          snapshot,
          y * this.#canvas.canvasSize.x + x,
        );
        if (mapped instanceof BpxRgbColor) {
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
