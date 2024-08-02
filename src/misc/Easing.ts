/**
 * TODO: docs
 */
export type BpxEasingFn = (t: number) => number;

/**
 * TODO: docs
 */
export class BpxEasing {
  /**
   * TODO: docs
   */
  static linear: BpxEasingFn = (t: number) => t;

  /**
   * TODO: docs
   */
  static inQuadratic: BpxEasingFn = (t: number) => t ** 2;

  /**
   * TODO: docs
   */
  static outQuadratic: BpxEasingFn = (t: number) => 1 - (t - 1) ** 2;

  /**
   * TODO: docs
   */
  static inQuartic: BpxEasingFn = (t: number) => t ** 4;

  /**
   * TODO: docs
   */
  static outQuartic: BpxEasingFn = (t: number) => 1 - (t - 1) ** 4;
}
