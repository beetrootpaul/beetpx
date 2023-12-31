export type BpxRgbCssHex = string;

export class BpxRgbColor {
  readonly type = "rgb";

  // values between 0 and 255
  readonly r: number;
  readonly g: number;
  readonly b: number;

  readonly cssHex: BpxRgbCssHex;

  constructor(r: number, g: number, b: number) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw Error(
        `One of color components is outside 0-255 range: r=${r}, g=${g}, b=${b}.`,
      );
    }
    this.r = r;
    this.g = g;
    this.b = b;

    this.cssHex =
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0");
  }
  static fromCssHex(cssHex: string): BpxRgbColor {
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
}

export function rgb_(r: number, g: number, b: number): BpxRgbColor {
  return new BpxRgbColor(r, g, b);
}

export const black_ = BpxRgbColor.fromCssHex("#000000");
export const white_ = BpxRgbColor.fromCssHex("#ffffff");
export const red_ = BpxRgbColor.fromCssHex("#ff0000");
export const green_ = BpxRgbColor.fromCssHex("#00ff00");
export const blue_ = BpxRgbColor.fromCssHex("#0000ff");
