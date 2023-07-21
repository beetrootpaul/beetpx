import { SolidColor } from "./Color";
import { PocTsBGFramework } from "./PocTsBGFramework";
import { Xy, xy_ } from "./Xy";

export class Utils {
  // Returns the middle number. Example usage: `clamp(min, value, max)`
  //   in order to find a value which is:
  //   - `value` if it is `>= min` and `<= max`
  //   - `min` if `value` is `< min`
  //   - `max` if `value` is `> max`
  static clamp(a: number, b: number, c: number): number {
    return a + b + c - Math.min(a, b, c) - Math.max(a, b, c);
  }

  // TODO: tests for edge cases
  static booleanChangingEveryNthFrame(n: number): boolean {
    return PocTsBGFramework.frameNumber % (n * 2) < n;
  }

  // generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions
  static get offset8Directions(): Xy[] {
    return [
      xy_(-1, -1),
      xy_(0, -1),
      xy_(1, -1),
      xy_(1, 0),
      xy_(1, 1),
      xy_(0, 1),
      xy_(-1, 1),
      xy_(-1, 0),
    ];
  }

  // TODO: test size measurements, especially for text combining regular and wider glyphs, like "➡️"
  static measureTextSize(text: string): Xy {
    const charSprites =
      PocTsBGFramework.drawApi.getFont()?.spritesFor(text) ?? [];
    return charSprites.reduce(
      (sizeSoFar, nextSprite) =>
        Xy.max(
          sizeSoFar,
          nextSprite.positionInText.add(nextSprite.sprite.size()),
        ),
      Xy.zero,
    );
  }

  static printWithOutline(
    text: string,
    canvasXy1: Xy,
    textColor: SolidColor,
    outlineColor: SolidColor,
  ): void {
    Utils.offset8Directions.forEach((offset) => {
      PocTsBGFramework.drawApi.print(text, canvasXy1.add(offset), outlineColor);
    });
    PocTsBGFramework.drawApi.print(text, canvasXy1, textColor);
  }

  // to be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`
  static throwError(message: string): never {
    throw Error(message);
  }
}
