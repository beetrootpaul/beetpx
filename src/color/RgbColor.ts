export type BpxRgbCssHex = string;

export class BpxRgbColor {
  static of(r: number, g: number, b: number): BpxRgbColor {
    return new BpxRgbColor(r, g, b);
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

  readonly type = "rgb";

  // values between 0 and 255
  readonly r: number;
  readonly g: number;
  readonly b: number;

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

  asArray(): [r: number, g: number, b: number] {
    return [this.r, this.g, this.b];
  }
}

// TODO: overload for a CSS hex
export function rgb_(r: number, g: number, b: number): BpxRgbColor {
  return BpxRgbColor.of(r, g, b);
}

export const rgb_black_ = BpxRgbColor.fromCssHex("#000000");
export const rgb_white_ = BpxRgbColor.fromCssHex("#ffffff");
export const rgb_red_ = BpxRgbColor.fromCssHex("#ff0000");
export const rgb_green_ = BpxRgbColor.fromCssHex("#00ff00");
export const rgb_blue_ = BpxRgbColor.fromCssHex("#0000ff");
export const rgb_cyan_ = BpxRgbColor.fromCssHex("#00ffff");
export const rgb_magenta_ = BpxRgbColor.fromCssHex("#ff00ff");
export const rgb_yellow_ = BpxRgbColor.fromCssHex("#ffff00");
