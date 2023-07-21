import { Xy } from "../Xy";

export class FillPattern {
  // TODO: create a helper to generate FillPattern from ASCII
  static of(bits: number): FillPattern {
    return new FillPattern(bits);
  }

  // noinspection JSUnusedGlobalSymbols
  static primaryOnly = new FillPattern(0b0000_0000_0000_0000);
  // noinspection JSUnusedGlobalSymbols
  static secondaryOnly = new FillPattern(0b1111_1111_1111_1111);

  readonly #bits: number;

  // TODO: tests that bits do not have for example an accidental extra digit in its binary representation. It happened to me in tests and debugging was a hell
  private constructor(bits: number) {
    this.#bits = bits;
  }

  hasPrimaryColorAt(xy: Xy): boolean {
    const patternXy = xy.mod(4);
    const bitPosition = 4 * 4 - (patternXy.y * 4 + patternXy.x) - 1;
    const isSecondary = Boolean(this.#bits & (1 << bitPosition));
    return !isSecondary;
  }
}
