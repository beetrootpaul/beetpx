/**
 * @category Miscellaneous
 */
export type BpxEasingFn = (t: number) => number;

/**
 * A collection of easing functions.
 *
 * @category Miscellaneous
 */
export class BpxEasing {
  /**
   * @group Static values
   */
  static linear: BpxEasingFn = (t: number) => t;
  /**
   * @group Static values
   */
  static inQuadratic: BpxEasingFn = (t: number) => t ** 2;
  /**
   * @group Static values
   */
  static outQuadratic: BpxEasingFn = (t: number) => 1 - (t - 1) ** 2;
  /**
   * @group Static values
   */
  static inQuartic: BpxEasingFn = (t: number) => t ** 4;
  /**
   * @group Static values
   */
  static outQuartic: BpxEasingFn = (t: number) => 1 - (t - 1) ** 4;
}
