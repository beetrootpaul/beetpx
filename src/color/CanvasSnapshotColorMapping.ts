import { CanvasSnapshot } from "../canvas/CanvasSnapshot";
import { BpxColorMapper } from "./ColorMapper";
import { BpxRgbColor } from "./RgbColor";

/**
 * TODO: docs
 */
export class BpxCanvasSnapshotColorMapping {
  /**
   * TODO: docs
   */
  static of(mapping: BpxColorMapper): BpxCanvasSnapshotColorMapping {
    return new BpxCanvasSnapshotColorMapping(mapping);
  }

  /**
   * A property helpful for TypeScript type inference, when distinguishing from
   * other types of colors.
   *
   * @example
   * ```ts
   * const c:
   *   | null
   *   | BpxRgbColor
   *   | BpxPatternColors
   *   | BpxSpriteColorMapping
   *   | BpxCanvasSnapshotColorMapping
   *   = getColor();
   * if (c == null) {
   *   // c is transparent here
   * } else if (c.type === "rgb") {
   *   // c is BpxRgbColor here
   * } else if (c.type === "pattern") {
   *   // c is BpxPatternColors here
   * } else if (c.type === "sprite_mapping") {
   *   // c is BpxSpriteColorMapping here
   * } else {
   *   // c is BpxCanvasSnapshotColorMapping here
   * }
   * ```
   */
  readonly type = "canvas_snapshot_mapping";

  readonly #mapping: BpxColorMapper;

  private constructor(mapping: BpxColorMapper) {
    this.#mapping = mapping;
  }

  /**
   * TODO: docs
   */
  getMappedColor(
    snapshot: CanvasSnapshot | null,
    canvasX: number,
    canvasY: number,
  ): BpxRgbColor | null {
    return snapshot ?
        this.#mapping(snapshot.getColorAt(canvasX, canvasY), canvasX, canvasY)
      : null;
  }
}
