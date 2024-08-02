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
   * TODO: docs
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
