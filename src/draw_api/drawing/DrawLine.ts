import { Canvas } from "../../canvas/Canvas";
import { CanvasSnapshot } from "../../canvas/CanvasSnapshot";
import { BpxCanvasSnapshotColorMapping } from "../../color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "../../color/PatternColors";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxVector2d, v_ } from "../../misc/Vector2d";
import { BpxPattern } from "../Pattern";

export class DrawLine {
  readonly #canvas: Canvas;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;
  }

  // Based on http://members.chello.at/easyfilter/bresenham.html
  draw(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
    pattern: BpxPattern,
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
      color.type === "pattern" ? color.primary : color;
    const c2: BpxRgbColor | null =
      color.type === "pattern" ? color.secondary : null;
    const sn =
      c1?.type === "canvas_snapshot_mapping"
        ? this.#canvas.getMostRecentSnapshot()
        : null;

    const fp = pattern;

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
    pattern: BpxPattern,
    snapshot: CanvasSnapshot | null,
  ): void {
    if (!this.#canvas.canSetAt(x, y)) {
      return;
    }

    if (pattern.hasPrimaryColorAt(x, y)) {
      if (!c1) {
      } else if (c1.type === "rgb") {
        this.#canvas.set(c1, x, y);
      } else {
        const mapped = c1.getMappedColor(
          snapshot,
          y * this.#canvas.canvasSize.x + x,
        );
        if (mapped) {
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
