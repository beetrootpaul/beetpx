// noinspection JSUnusedGlobalSymbols

import { BeetPx } from "./BeetPx";
import { BpxSolidColor } from "./misc/Color";
import { BpxVector2d, v_, v_0_0_ } from "./misc/Vector2d";

// TODO: re-check what are the names, how the entire Utils API looks like

export class BpxUtils {
  /**
   * NOTE: This function makes sense in a TypeScript codebase only.
   *
   * This function is meant to be used in a last branch of `if - else if - … - else`
   *   chain or in `default` of `switch - case - case - …`. Let's imagine there is
   *   a union type of which we check all possible cases. Someday we add one more
   *   type to the union, but we forget to extend our `switch` by that one more `case`.
   *   Thanks to `assertUnreachable(theValueOfThatUnionType)` the TypeScript checker
   *   will inform us about such mistake.
   *
   * @param thingThatShouldBeOfTypeNeverAtThisPoint - a value which we expect to be of type never
   */
  static assertUnreachable(
    thingThatShouldBeOfTypeNeverAtThisPoint: never,
  ): void {
    throw Error(
      "Somehow reached the unreachable code. Was TypeScript checker run on it?",
    );
  }

  // TODO: tests for edge cases
  static booleanChangingEveryNthFrame(n: number): boolean {
    return BeetPx.frameNumber % (n * 2) < n;
  }

  // Returns the middle number. Example usage: `clamp(min, value, max)`
  //   in order to find a value which is:
  //   - `value` if it is `>= min` and `<= max`
  //   - `min` if `value` is `< min`
  //   - `max` if `value` is `> max`
  static clamp(a: number, b: number, c: number): number {
    return a + b + c - Math.min(a, b, c) - Math.max(a, b, c);
  }

  static identity<Param>(param: Param): Param {
    return param;
  }

  static isDefined<Value>(value: Value | null | undefined): value is Value {
    return value != null;
  }

  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  // TODO: test size measurements, especially for text combining regular and wider glyphs, like "➡️"
  static measureText(text: string): BpxVector2d {
    const charSprites = BeetPx.getFont()?.spritesFor(text) ?? [];

    let size = v_0_0_;
    for (const charSprite of charSprites) {
      size = BpxVector2d.max(
        size,
        charSprite.positionInText.add(charSprite.sprite.size()),
      );
    }
    return size;
  }

  static noop(): void {}

  // generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions
  static offset8Directions(): BpxVector2d[] {
    return [
      v_(-1, -1),
      v_(0, -1),
      v_(1, -1),
      v_(1, 0),
      v_(1, 1),
      v_(0, 1),
      v_(-1, 1),
      v_(-1, 0),
    ];
  }

  static printWithOutline(
    text: string,
    canvasXy1: BpxVector2d,
    textColor: BpxSolidColor,
    outlineColor: BpxSolidColor,
    centerXy: [boolean, boolean] = [false, false],
  ): void {
    for (const offset of BpxUtils.offset8Directions()) {
      BeetPx.print(text, canvasXy1.add(offset), outlineColor, centerXy);
    }
    BeetPx.print(text, canvasXy1, textColor, centerXy);
  }

  static randomElementOf<V>(array: V[]): V | undefined {
    if (array.length <= 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
  }

  static range(n: number): number[] {
    return Array.from({ length: n }, (_element, index) => index);
  }

  /**
   * To be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`.
   */
  static throwError(message: string): never {
    throw Error(message);
  }

  /**
   * @return turn angle. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static trigAtan2(x: number, y: number): number {
    return Math.atan2(y, x) / Math.PI / 2;
  }

  /**
   * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static trigCos(turnAngle: number): number {
    return Math.cos(turnAngle * Math.PI * 2);
  }

  /**
   * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
   */
  static trigSin(turnAngle: number): number {
    return Math.sin(turnAngle * Math.PI * 2);
  }

  static wait(millis: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), millis);
    });
  }
}

export const u_ = BpxUtils;
