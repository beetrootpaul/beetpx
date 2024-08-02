//
// NOTE: Shape of this file and the way things are defined (props vs methods vs static etc.)
//       is carefully picked in order to achieve a given end result in how the docs generated
//       by TypeDoc looks like.
//

import { BpxRgbColor } from "./color/RgbColor";
import { BpxVector2d } from "./misc/Vector2d";
import { assertUnreachable } from "./utils/assertUnreachable";
import { booleanChangingEveryNthFrame } from "./utils/booleanChangingEveryNthFrame";
import { clamp } from "./utils/clamp";
import { drawTextWithOutline } from "./utils/drawTextWithOutline";
import { identity } from "./utils/identity";
import { lerp } from "./utils/lerp";
import { mod } from "./utils/mod";
import { offset4Directions } from "./utils/offset4Directions";
import { offset8Directions } from "./utils/offset8Directions";
import { randomElementOf } from "./utils/randomElementOf";
import { range } from "./utils/range";
import { repeatEachElement } from "./utils/repeatEachElement";
import { throwError } from "./utils/throwError";
import { trigAtan2 } from "./utils/trigAtan2";
import { trigCos } from "./utils/trigCos";
import { trigSin } from "./utils/trigSin";

/////////////////////////////////////////////////////////////////////////////

/**
 * One of 3 main API entry points. This one provides you with the useful
 * utils.
 *
 * @example
 * ```ts
 * BeetPxUtils.clamp($v_0_0, this.playerXy, BeetPx.canvasSize);
 * ```
 *
 * @category API entry points
 */
export class BeetPxUtils {
  private constructor() {}

  /**
   * This function is meant to be used in a last branch of `if - else if - … - else`
   * chain or in `default` of `switch - case - case - …`. Let's imagine there is
   * a union type of which we check all possible cases. Someday we add one more
   * type to the union, but we forget to extend our `switch` by that one more `case`.
   * Thanks to `assertUnreachable(theValueOfThatUnionType)` the TypeScript checker
   * will inform us about such mistake.
   *
   * @param thingThatShouldBeOfTypeNeverAtThisPoint - a value which we expect to be of type `never`
   */
  static assertUnreachable(
    thingThatShouldBeOfTypeNeverAtThisPoint: never,
  ): void {
    assertUnreachable(thingThatShouldBeOfTypeNeverAtThisPoint);
  }

  /**
   * @param n How often to change the returned value
   * @param opts.onGamePause By default the method doesn't progress during the game pause.
   *                         But with this param set to `"ignore"` we can change that behaviour.
   *
   * @returns Either `true` or `false`, which changes every `n` frames
   */
  static booleanChangingEveryNthFrame(
    n: number,
    opts?: { onGamePause?: "pause" | "ignore" },
  ): boolean {
    return booleanChangingEveryNthFrame(n, opts);
  }

  /**
   * Returns the middle number out of given three numbers. Useful for keeping a given
   * property within specified bounds.
   *
   * @example
   * ```ts
   * clamp(minSpeed, currentSpeed, maxSpeed);
   * ```
   */
  static clamp(a: number, b: number, c: number): number {
    return clamp(a, b, c);
  }

  /**
   * Similar to {@link BeetPxDraw.text}, but with a second color specified, to be used as an outline.
   */
  static drawTextWithOutline(
    text: string,
    canvasXy1: BpxVector2d,
    textColor: BpxRgbColor,
    outlineColor: BpxRgbColor,
    opts?: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
    },
  ): void {
    drawTextWithOutline(text, canvasXy1, textColor, outlineColor, opts);
  }

  /**
   * A simple helper which returns what it takes, without any changes.
   *
   * @example
   * ```ts
   * const doTheFancyTransformation = (x: value) => ...;
   * const fn = makeItFancy ? doTheFancyTransformation : BeetPxUtils.identity;
   * const newX = fn(x);
   * ```
   */
  static identity<Param>(param: Param): Param {
    return identity(param);
  }

  /**
   * Picks a number between `a` and `b` which is in a "distance" between them as specified by `t`.
   * Specifically: `lerp(a,b,0) === a` and `lerp(a,b,1) === b`.
   *
   * With `opts: { clamp: true }`, the resulting value cannot is always within bounds of `a` and `b`, even if `t` is below `0` or above `1`.
   */
  static lerp(
    a: number,
    b: number,
    t: number,
    opts?: { clamp?: boolean },
  ): number {
    return lerp(a, b, t, opts);
  }

  /**
   * A modulo operation – in contrary to native JavaScript's `%`, this one returns results from `[0, n)` range (positive values only).
   *
   * @example
   * ```ts
   * if ($.wasButtonJustPressed("up")) {
   *   selected = BeetPxUtils.mod(selected - 1);
   * }
   * const menuItem = menuItems[selected];
   * ```
   */
  static mod(value: number, modulus: number): number {
    return mod(value, modulus);
  }

  /**
   * A simple helper which does nothing.
   *
   * @example
   * ```ts
   * const doTheFancyThing = () => ...;
   * const fn = makeItFancy ? doTheFancyThing : BeetPxUtils.noop;
   * fn();
   * ```
   */
  static noop(): void {}

  /**
   * Generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 4 directions.
   * Useful e.g. for iterating over adjacent tiles on the game map.
   */
  static offset4Directions(): [
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
  ] {
    return offset4Directions();
  }

  /**
   * Generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions.
   * Useful e.g. for iterating over adjacent tiles on the game map, including diagonals.
   */
  static offset8Directions(): [
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
    BpxVector2d,
  ] {
    return offset8Directions();
  }

  /**
   * Picks a random element from a given array.
   */
  static randomElementOf<TElement>(array: TElement[]): TElement | undefined {
    return randomElementOf<TElement>(array);
  }

  /**
   * Generates an array from `0` to `n-1`. Useful when we want to do a thing N times.
   *
   * @example
   * ```ts
   * BeetPxUtils.range(10).forEach(i => {
   *   BeetPxDraw.rect($v(1, 1 + i * 8), $v(40, 7), $rgb_red);
   * });
   * ```
   */
  static range(n: number): number[] {
    return range(n);
  }

  /**
   * Takes an array an returns a new one, in which each element is repeated given amount of times.
   *
   * @example
   * ```ts
   * BeetPxUtils.repeatEachElement(3, ["a", "b"]);
   * // The above produces `["a", "a", "a", "b", "b", "b"]`.
   * ```
   */
  static repeatEachElement<TElement>(
    times: number,
    array: TElement[],
  ): TElement[] {
    return repeatEachElement(times, array);
  }

  /**
   * To be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`.
   *
   * @example
   * ```ts
   * function getValue(): number | null {
   *   // ...
   * }
   * const value = getValue() ?? throwError("Failed to get the value");
   * ```
   */
  static throwError(message: string): never {
    throwError(message);
  }

  /**
   * @returns Turn angle. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static trigAtan2(x: number, y: number): number {
    return trigAtan2(x, y);
  }

  /**
   * @param turnAngle A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static trigCos(turnAngle: number): number {
    return trigCos(turnAngle);
  }

  /**
   * @param turnAngle A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static trigSin(turnAngle: number): number {
    return trigSin(turnAngle);
  }
}

/////////////////////////////////////////////////////////////////////////////

/**
 * A shorthand for {@link BeetPxUtils}.
 *
 * @category API entry points
 */
export const $u = BeetPxUtils;

/////////////////////////////////////////////////////////////////////////////
