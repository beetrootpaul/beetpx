import { BpxVector2d } from "../Vector2d";

// TODO: rename fill to draw? Since we are using it for sprites as well…
// TODO: … and use it, like, for every drawing API we have in this framework.
export class BpxFillPattern {
  // TODO: create a helper to generate FillPattern from ASCII
  static of(bits: number): BpxFillPattern {
    return new BpxFillPattern(bits);
  }

  static primaryOnly = new BpxFillPattern(0b0000_0000_0000_0000);
  static secondaryOnly = new BpxFillPattern(0b1111_1111_1111_1111);

  readonly #bits: number;

  // TODO: tests that bits do not have for example an accidental extra digit in its binary representation. It happened to me in tests and debugging was a hell
  private constructor(bits: number) {
    this.#bits = bits;
  }

  // TODO: consider a faster implementation based on bitmasks for a continuous chunks of pixels
  hasPrimaryColorAt(xy: BpxVector2d): boolean {
    const patternXy = xy.mod(4);
    const bitPosition = 4 * 4 - (patternXy.y * 4 + patternXy.x) - 1;
    const isSecondary = Boolean(this.#bits & (1 << bitPosition));
    return !isSecondary;
  }
}
