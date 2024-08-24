import { trigCos } from "../utils/trigCos";

/**
 * @category Miscellaneous
 */
export type BpxEasingFn = (t: number) => number;

/**
 * A collection of easing functions. Based on
 * ["Animation Curves cheat sheet/library" PICO-8 cart by ValerADHD](https://www.lexaloffle.com/bbs/?tid=40577).
 *
 * @category Miscellaneous
 */
export class BpxEasing {
  private constructor() {}

  /**
   * @group Static values
   */
  static linear: BpxEasingFn = (t: number) => t;

  /////////////////////////////////////////////////////////////////////////////

  /**
   * @group Static values
   */
  static inQuadratic: BpxEasingFn = (t: number) => t * t;

  /**
   * @group Static values
   */
  static outQuadratic: BpxEasingFn = (t: number) => 1 - (t - 1) * (t - 1);

  /**
   * @group Static values
   */
  static inOutQuadratic: BpxEasingFn = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - 2 * (t - 1) * (t - 1);

  /**
   * @group Static values
   */
  static outInQuadratic: BpxEasingFn = (t: number) =>
    t < 0.5 ? 0.5 - 2 * (t - 0.5) * (t - 0.5) : 0.5 + 2 * (t - 0.5) * (t - 0.5);

  /////////////////////////////////////////////////////////////////////////////

  /**
   * @group Static values
   */
  static inQuartic: BpxEasingFn = (t: number) => t * t * t * t;

  /**
   * @group Static values
   */
  static outQuartic: BpxEasingFn = (t: number) =>
    1 - (t - 1) * (t - 1) * (t - 1) * (t - 1);

  /**
   * @group Static values
   */
  static inOutQuartic: BpxEasingFn = (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (t - 1) * (t - 1) * (t - 1) * (t - 1);

  /**
   * @group Static values
   */
  static outInQuartic: BpxEasingFn = (t: number) =>
    t < 0.5
      ? 0.5 - 8 * (t - 0.5) * (t - 0.5) * (t - 0.5) * (t - 0.5)
      : 0.5 + 8 * (t - 0.5) * (t - 0.5) * (t - 0.5) * (t - 0.5);

  /////////////////////////////////////////////////////////////////////////////

  /**
   * @group Static values
   */
  static inOvershoot: BpxEasingFn = (t: number) =>
    2.7 * t * t * t - 1.7 * t * t;

  /**
   * @group Static values
   */
  static outOvershoot: BpxEasingFn = (t: number) =>
    1 + 2.7 * (t - 1) * (t - 1) * (t - 1) + 1.7 * (t - 1) * (t - 1);

  /**
   * @group Static values
   */
  static inOutOvershoot: BpxEasingFn = (t: number) =>
    t < 0.5
      ? (2.7 * 8 * t * t * t - 1.7 * 4 * t * t) / 2
      : 1 +
        (2.7 * 8 * (t - 1) * (t - 1) * (t - 1) + 1.7 * 4 * (t - 1) * (t - 1)) /
          2;

  /**
   * @group Static values
   */
  static outInOvershoot: BpxEasingFn = (t: number) =>
    t < 0.5
      ? (2.7 * 8 * (t - 0.5) * (t - 0.5) * (t - 0.5) +
          1.7 * 4 * (t - 0.5) * (t - 0.5)) /
          2 +
        0.5
      : (2.7 * 8 * (t - 0.5) * (t - 0.5) * (t - 0.5) -
          1.7 * 4 * (t - 0.5) * (t - 0.5)) /
          2 +
        0.5;

  /////////////////////////////////////////////////////////////////////////////

  /**
   * @group Static values
   */
  static inElastic: BpxEasingFn = (t: number) =>
    t === 0 ? 0 : 2 ** (10 * t - 10) * trigCos(2 * t - 2);

  /**
   * @group Static values
   */
  static outElastic: BpxEasingFn = (t: number) =>
    t === 1 ? 1 : 1 - 2 ** (-10 * t) * trigCos(2 * t);

  /**
   * @group Static values
   */
  static inOutElastic: BpxEasingFn = (t: number) =>
    t < 0.5
      ? (2 ** (10 * 2 * t - 10) * trigCos(2 * 2 * t - 2)) / 2
      : 1 - (2 ** (-10 * 2 * (t - 0.5)) * trigCos(2 * 2 * (t - 0.5))) / 2;

  /**
   * @group Static values
   */
  static outInElastic: BpxEasingFn = (t: number) =>
    t < 0.5
      ? 0.5 - (2 ** (-10 * 2 * t) * trigCos(2 * 2 * t)) / 2
      : (2 ** (10 * 2 * (t - 0.5) - 10) * trigCos(2 * 2 * (t - 0.5) - 2)) / 2 +
        0.5;

  /////////////////////////////////////////////////////////////////////////////

  /**
   * @group Static values
   */
  static inBounce: BpxEasingFn = (t: number) => {
    t = 1 - t;
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return 1 - n1 * t * t;
    } else if (t < 2 / d1) {
      t = t - 1.5 / d1;
      return 1 - n1 * t * t - 0.75;
    } else if (t < 2.5 / d1) {
      t = t - 2.25 / d1;
      return 1 - n1 * t * t - 0.9375;
    } else {
      t = t - 2.625 / d1;
      return 1 - n1 * t * t - 0.984375;
    }
  };

  /**
   * @group Static values
   */
  static outBounce: BpxEasingFn = (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      t = t - 1.5 / d1;
      return n1 * t * t + 0.75;
    } else if (t < 2.5 / d1) {
      t = t - 2.25 / d1;
      return n1 * t * t + 0.9375;
    } else {
      t = t - 2.625 / d1;
      return n1 * t * t + 0.984375;
    }
  };
}
