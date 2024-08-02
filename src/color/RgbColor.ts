/**
 * TODO: docs
 */
export type BpxRgbCssHex = string;

/**
 * TODO: docs
 *
 * @categoryTODO Drawing
 */
export class BpxRgbColor {
  /**
   * TODO: docs
   *
   * @groupTODO Static factories
   */
  static of(r: number, g: number, b: number): BpxRgbColor {
    return new BpxRgbColor(r, g, b);
  }

  /**
   * TODO: docs
   *
   * @groupTODO Static factories
   */
  static fromCssHex(cssHex: BpxRgbCssHex): BpxRgbColor {
    if (!/^#[0-9a-fA-F]{6}$/.test(cssHex)) {
      throw Error(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
    }
    return new BpxRgbColor(
      parseInt(cssHex.slice(1, 3), 16),
      parseInt(cssHex.slice(3, 5), 16),
      parseInt(cssHex.slice(5, 7), 16),
    );
  }

  /**
   * TODO: docs
   */
  readonly type = "rgb";

  /**
   * TODO: docs
   *
   * values between 0 and 255
   */
  readonly r: number;
  /**
   * TODO: docs
   */
  readonly g: number;
  /**
   * TODO: docs
   */
  readonly b: number;

  /**
   * TODO: docs
   */
  readonly cssHex: BpxRgbCssHex;

  private constructor(r: number, g: number, b: number) {
    this.r = Math.min(Math.max(0x00, Math.round(r)), 0xff);
    this.g = Math.min(Math.max(0x00, Math.round(g)), 0xff);
    this.b = Math.min(Math.max(0x00, Math.round(b)), 0xff);

    this.cssHex =
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0");
  }

  /**
   * TODO: docs
   */
  isSameAs(another: BpxRgbColor): boolean {
    return another.r === this.r && another.g === this.g && another.b === this.b;
  }

  /**
   * TODO: docs
   */
  asArray(): [r: number, g: number, b: number] {
    return [this.r, this.g, this.b];
  }
}
