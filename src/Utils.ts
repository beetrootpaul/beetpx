import { BeetPx } from "./BeetPx";
import { BpxRgbColor } from "./color/RgbColor";
import { BpxVector2d, v_, v_0_0_ } from "./misc/Vector2d";

export class BpxUtils {
  /**
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
    throw Error(`Somehow reached the unreachable code ¯\\_(ツ)_/¯`);
  }

  static booleanChangingEveryNthFrame(n: number): boolean {
    return n > 0 ? BeetPx.frameNumber % (n * 2) < n : true;
  }

  // Returns the middle number. Example usage: `clamp(min, value, max)`
  //   in order to find a value which is:
  //   - `value` if it is `>= min` and `<= max`
  //   - `min` if `value` is `< min`
  //   - `max` if `value` is `> max`
  static clamp(a: number, b: number, c: number): number {
    return a < b ? (b < c ? b : a < c ? c : a) : b > c ? b : a > c ? c : a;
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

  /**
   * @returns {[BpxVector2d, BpxVector2d] } - XY and WH of the text,
   *          where XY represents an offset from the initial top-left
   *          corner where printing of the text would start. For example
   *          imagine a font in which there are some chars higher by 1px
   *          than standard height of other characters. In such case
   *          returned XY would be (0,-1).
   */
  static measureText(text: string): [BpxVector2d, BpxVector2d] {
    const charSprites = BeetPx.getFont()?.spritesFor(text) ?? [];

    let minXy = v_0_0_;
    let maxXy = v_0_0_;

    for (const charSprite of charSprites) {
      minXy = BpxVector2d.min(minXy, charSprite.positionInText);
      maxXy = BpxVector2d.max(
        maxXy,
        charSprite.positionInText.add(
          charSprite.type === "image"
            ? charSprite.spriteXyWh[1]
            : charSprite.pixels.wh,
        ),
      );
    }

    return [minXy, maxXy.sub(minXy)];
  }

  /**
   * a modulo operation – in contrary to native `%`, this returns results from [0, n) range (positive values only)
   */
  static mod(value: number, modulus: number): number {
    return ((value % modulus) + modulus) % modulus;
  }

  static noop(): void {}

  // generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions
  static offset4Directions(): BpxVector2d[] {
    return [v_(-1, -1), v_(1, -1), v_(1, 1), v_(-1, 1)];
  }

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

  static drawTextWithOutline(
    text: string,
    canvasXy1: BpxVector2d,
    textColor: BpxRgbColor,
    outlineColor: BpxRgbColor,
    opts: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
    } = {},
  ): void {
    for (const offset of BpxUtils.offset8Directions()) {
      BeetPx.drawText(text, canvasXy1.add(offset), outlineColor, opts);
    }
    BeetPx.drawText(text, canvasXy1, textColor, opts);
  }

  static randomElementOf<TElement>(array: TElement[]): TElement | undefined {
    if (array.length <= 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
  }

  static range(n: number): number[] {
    return Array.from({ length: n }, (_element, index) => index);
  }

  static repeatEachElement<TElement>(
    times: number,
    array: TElement[],
  ): TElement[] {
    times = times > 0 ? Math.round(times) : 0;

    const newArray: TElement[] = new Array(times * array.length);
    for (let i = 0; i < newArray.length; i++) {
      newArray[i] = array[Math.floor(i / times)]!;
    }
    return newArray;
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
    return (Math.atan2(y, x) / Math.PI / 2 + 1) % 1;
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
