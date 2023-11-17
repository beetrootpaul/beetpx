export class BpxPattern {
  // TODO: create a helper to generate Pattern from ASCII
  static of(bits: number): BpxPattern {
    return new BpxPattern(bits);
  }

  static primaryOnly = BpxPattern.of(0b0000_0000_0000_0000);
  static secondaryOnly = BpxPattern.of(0b1111_1111_1111_1111);

  readonly #bits: number;

  // TODO: tests if bits do not have for example an accidental extra digit in its binary representation. It happened to me in tests and debugging was a hell
  private constructor(bits: number) {
    this.#bits = bits;
  }

  hasPrimaryColorAt(x: number, y: number): boolean {
    const patternX = x % 4;
    const patternY = y % 4;
    const bitPosition = 4 * 4 - (patternY * 4 + patternX) - 1;
    const isSecondary = Boolean(this.#bits & (1 << bitPosition));
    return !isSecondary;
  }
}
