import { BpxCanvasSnapshot } from "../canvas/CanvasSnapshot";
import { BpxColorMapper } from "./ColorMapper";
import { BpxRgbColor } from "./RgbColor";

/**
 * @see {@link BeetPxDraw.takeCanvasSnapshot}
 *
 * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/canvas-snapshot
 *
 * @category Drawing
 */
export class BpxCanvasSnapshotColorMapping {
  /**
   * @group Static factories
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
   * } else if (c.type === "canvas_snapshot_mapping") {
   *   // c is BpxCanvasSnapshotColorMapping here
   * } else {
   *   $u.assertUnreachable(c);
   * }
   * ```
   */
  readonly type = "canvas_snapshot_mapping";

  readonly #mapping: BpxColorMapper;

  private constructor(mapping: BpxColorMapper) {
    this.#mapping = mapping;
  }

  /**
   * The main method of this class, used to get a mapped color for a given color on the canvas snapshot.
   */
  getMappedColor(
    snapshot: BpxCanvasSnapshot | null,
    canvasX: number,
    canvasY: number,
  ): BpxRgbColor | null {
    return snapshot ?
        this.#mapping(snapshot.getColorAt(canvasX, canvasY), canvasX, canvasY)
      : null;
  }
}
