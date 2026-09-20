import { BpxCanvasSnapshot } from "../canvas/CanvasSnapshot";
import { BpxColorMapper } from "./ColorMapper";
import { BpxRgbColor, BpxRgbCssHex } from "./RgbColor";

/**
 * @see {@link BeetPxDraw.takeCanvasSnapshot}
 *
 * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/canvas-snapshot
 *
 * @category Drawing
 */
export class BpxCanvasSnapshotColorMapping {
  /**
   * Creates a simplified color mapping, based on a map of canvas snapshot colors to the new ones.
   *
   * @example
   * ```ts
   * BpxCanvasSnapshotColorMapping.from([
   *   [$rgb_red, $rgb_green],
   *   [$rgb_blue, $rgb_green],
   *   [$rgb_yellow, $rgb_red],
   * ]);
   * ```
   *
   * @group Static factories
   */
  static from(
    colorMappingEntries: Array<[BpxRgbColor, BpxRgbColor]>,
  ): BpxCanvasSnapshotColorMapping {
    const map = new Map<BpxRgbCssHex, BpxRgbColor>(
      colorMappingEntries.map(([from, to]) => [from.cssHex, to]),
    );
    return new BpxCanvasSnapshotColorMapping((canvasSnapshotColor, _x, _y) => {
      if (!canvasSnapshotColor) return canvasSnapshotColor;
      const mapped = map.get(canvasSnapshotColor.cssHex);
      return typeof mapped === "undefined" ? canvasSnapshotColor : mapped;
    });
  }

  /**
   * Creates a color mapping which uses a function to map a canvas snapshot color
   * into a new one.
   *
   * @example
   * ```ts
   * BpxCanvasSnapshotColorMapping.of((color: BpxRgbColor | null, spriteX: number, spriteY: number) =>
   *   color
   *     ? $rgb(255 - color.r, 255 - color.g, 255 - color.b)
   *     : null
   * );
   * ```
   *
   * @group Static factories
   */
  static of(mapper: BpxColorMapper): BpxCanvasSnapshotColorMapping {
    return new BpxCanvasSnapshotColorMapping(mapper);
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
    return snapshot
      ? this.#mapping(snapshot.getColorAt(canvasX, canvasY), canvasX, canvasY)
      : null;
  }
}
