import { BpxDrawingPattern } from "../draw_api/DrawingPattern";
import { BpxRgbColor } from "./RgbColor";

/**
 * A set of two colors, used in combination with {@link BpxDrawingPattern},
 * where given pixels are colored with either the `primary` or the `secondary`.
 *
 * @category Colors
 */
export class BpxPatternColors {
  /**
   * @example
   * ```ts
   * BpxPatternColors.of($rgb_red, $rgb_blue);
   * ```
   *
   * @group Static factories
   */
  static of(
    primary: BpxRgbColor | null,
    secondary: BpxRgbColor | null,
  ): BpxPatternColors {
    return new BpxPatternColors(primary, secondary);
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
  readonly type = "pattern";

  private constructor(
    /**
     * The primary color or a transparency (denoted by `null`).
     */
    readonly primary: BpxRgbColor | null,
    /**
     * The secondary color or a transparency (denoted by `null`).
     */
    readonly secondary: BpxRgbColor | null,
  ) {}
}
