import { Canvas } from "../../canvas/Canvas";
import { CanvasSnapshot } from "../../canvas/CanvasSnapshot";
import { BpxCanvasSnapshotColorMapping } from "../../color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "../../color/PatternColors";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxVector2d } from "../../misc/Vector2d";
import { BpxDrawingPattern } from "../DrawingPattern";

export type RectFillMode = "none" | "inside" | "outside";

export class DrawRect {
  readonly #canvas: Canvas;

  constructor(canvas: Canvas) {
    this.#canvas = canvas;
  }

  draw(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
    fill: RectFillMode,
    pattern: BpxDrawingPattern,
  ): void {
    const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(
      xy.round(),
      xy.add(wh).round(),
    );

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
      c1?.type === "canvas_snapshot_mapping" ?
        this.#canvas.getMostRecentSnapshot()
      : null;

    const fp = pattern;

    // a rectangle itself (no fill)
    for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
      this.#drawPixel(x, xyMinInclusive.y, c1, c2, fp, sn);
      this.#drawPixel(x, xyMaxExclusive.y - 1, c1, c2, fp, sn);
    }
    for (let y = xyMinInclusive.y + 1; y < xyMaxExclusive.y - 1; y += 1) {
      this.#drawPixel(xyMinInclusive.x, y, c1, c2, fp, sn);
      this.#drawPixel(xyMaxExclusive.x - 1, y, c1, c2, fp, sn);
    }

    if (fill === "inside") {
      // inside fill
      for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
        for (let y = xyMinInclusive.y + 1; y < xyMaxExclusive.y - 1; y += 1) {
          this.#drawPixel(x, y, c1, c2, fp, sn);
        }
      }
    } else if (fill === "outside") {
      // outside fill
      for (let x = 0; x < xyMinInclusive.x; x += 1) {
        // left-top area
        for (let y = 0; y < xyMinInclusive.y; y += 1) {
          this.#drawPixel(x, y, c1, c2, fp, sn);
        }
        // left area
        for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
          this.#drawPixel(x, y, c1, c2, fp, sn);
        }
        // left-bottom area
        for (let y = xyMaxExclusive.y; y < this.#canvas.canvasSize.y; y += 1) {
          this.#drawPixel(x, y, c1, c2, fp, sn);
        }
      }
      // top area
      for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
        for (let y = 0; y < xyMinInclusive.y; y += 1) {
          this.#drawPixel(x, y, c1, c2, fp, sn);
        }
      }
      // bottom area
      for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
        for (let y = xyMaxExclusive.y; y < this.#canvas.canvasSize.y; y += 1) {
          this.#drawPixel(x, y, c1, c2, fp, sn);
        }
      }
      for (let x = xyMaxExclusive.x; x < this.#canvas.canvasSize.x; x += 1) {
        // right-top area
        for (let y = 0; y < xyMinInclusive.y; y += 1) {
          this.#drawPixel(x, y, c1, c2, fp, sn);
        }
        // right area
        for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
          this.#drawPixel(x, y, c1, c2, fp, sn);
        }
        // right-bottom area
        for (let y = xyMaxExclusive.y; y < this.#canvas.canvasSize.y; y += 1) {
          this.#drawPixel(x, y, c1, c2, fp, sn);
        }
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
