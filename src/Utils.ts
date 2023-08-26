// noinspection JSUnusedGlobalSymbols

import { BeetPx } from "./BeetPx";
import { SolidColor } from "./Color";
import { v_, Vector2d } from "./Vector2d";

// TODO: consider exposing those utils as BeetPx global API methods
export class Utils {
  static noop(): void {}

  // Returns the middle number. Example usage: `clamp(min, value, max)`
  //   in order to find a value which is:
  //   - `value` if it is `>= min` and `<= max`
  //   - `min` if `value` is `< min`
  //   - `max` if `value` is `> max`
  static clamp(a: number, b: number, c: number): number {
    return a + b + c - Math.min(a, b, c) - Math.max(a, b, c);
  }

  static repeatN(n: number, callback: (i: number) => void): void {
    Array.from({ length: n }).forEach((_element, i) => {
      callback(i);
    });
  }

  // TODO: tests for edge cases
  static booleanChangingEveryNthFrame(n: number): boolean {
    return BeetPx.frameNumber % (n * 2) < n;
  }

  // generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions
  static get offset8Directions(): Vector2d[] {
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

  // TODO: test size measurements, especially for text combining regular and wider glyphs, like "➡️"
  static measureText(text: string): Vector2d {
    const charSprites = BeetPx.getFont()?.spritesFor(text) ?? [];
    return charSprites.reduce(
      (sizeSoFar, nextSprite) =>
        Vector2d.max(
          sizeSoFar,
          nextSprite.positionInText.add(nextSprite.sprite.size()),
        ),
      Vector2d.zero,
    );
  }

  // TODO: consider moving this to either DrawApi or the game itself
  static printWithOutline(
    text: string,
    canvasXy1: Vector2d,
    textColor: SolidColor,
    outlineColor: SolidColor,
  ): void {
    Utils.offset8Directions.forEach((offset) => {
      BeetPx.print(text, canvasXy1.add(offset), outlineColor);
    });
    BeetPx.print(text, canvasXy1, textColor);
  }

  // to be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`
  static throwError(message: string): never {
    throw Error(message);
  }
}
