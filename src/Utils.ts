// noinspection JSUnusedGlobalSymbols

import { BeetPx } from "./BeetPx";
import { BpxSolidColor } from "./Color";
import { BpxVector2d, v2d_, v_ } from "./Vector2d";

// TODO: consider exposing those utils as BeetPx global API methods
export class BpxUtils {
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

  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  // TODO: test size measurements, especially for text combining regular and wider glyphs, like "➡️"
  static measureText(text: string): BpxVector2d {
    const charSprites = BeetPx.getFont()?.spritesFor(text) ?? [];
    return charSprites.reduce(
      (sizeSoFar, nextSprite) =>
        v_.max(
          sizeSoFar,
          v_.add(nextSprite.positionInText, nextSprite.sprite.size()),
        ),
      v2d_(0, 0),
    );
  }

  static noop(): void {}

  // generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions
  static offset8Directions(): BpxVector2d[] {
    return [
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
    ];
  }

  static randomElementOf<V>(array: V[]): V | undefined {
    if (array.length <= 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
  }

  // TODO: consider moving this to either DrawApi or the game itself
  static printWithOutline(
    text: string,
    canvasXy1: BpxVector2d,
    textColor: BpxSolidColor,
    outlineColor: BpxSolidColor,
    centerXy: [boolean, boolean] = [false, false],
  ): void {
    BpxUtils.offset8Directions().forEach((offset) => {
      BeetPx.print(text, v_.add(canvasXy1, offset), outlineColor, centerXy);
    });
    BeetPx.print(text, canvasXy1, textColor, centerXy);
  }

  static repeatN(n: number, callback: (i: number) => void): void {
    Array.from({ length: n }).forEach((_element, i) => {
      callback(i);
    });
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
}

export const u_ = BpxUtils;
