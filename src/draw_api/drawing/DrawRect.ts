import { Canvas } from "../../canvas/Canvas";
import { CanvasSnapshot } from "../../canvas/CanvasSnapshot";
import { BpxCanvasSnapshotColorMapping } from "../../color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "../../color/PatternColors";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxVector2d } from "../../misc/Vector2d";
import { BpxDrawingPattern } from "../Pattern";

export class DrawRect {
  readonly #canvas: Canvas;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;
  }

  draw(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
    fill: boolean,
    pattern: BpxDrawingPattern,
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

    const c1: BpxRgbColor | BpxCanvasSnapshotColorMapping | null =
      color.type === "pattern" ? color.primary : color;
    const c2: BpxRgbColor | null =
      color.type === "pattern" ? color.secondary : null;
    const sn =
      c1?.type === "canvas_snapshot_mapping"
        ? this.#canvas.getMostRecentSnapshot()
        : null;

    const fp = pattern;

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
    c1: BpxRgbColor | BpxCanvasSnapshotColorMapping | null,
    c2: BpxRgbColor | null,
    pattern: BpxDrawingPattern,
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
