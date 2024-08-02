import { BpxRgbColor } from "./RgbColor";

/**
 * TODO: docs
 *
 * @categoryTODO Drawing
 */
export class BpxPatternColors {
  /**
   * TODO: docs
   *
   * @groupTODO Static factories
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
     * TODO: docs
     */
    readonly primary: BpxRgbColor | null,
    /**
     * TODO: docs
     */
    readonly secondary: BpxRgbColor | null,
  ) {}
}
