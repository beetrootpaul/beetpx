import { describe, expect, test } from "@jest/globals";
import { BpxRgbColor, rgb_ } from "./RgbColor";

describe("RgbColor", () => {
  describe("constructor", () => {
    test("successful construction", () => {
      const color = rgb_(1, 2, 3);

      expect(color.r).toEqual(1);
      expect(color.g).toEqual(2);
      expect(color.b).toEqual(3);
    });

    test("validation", () => {
      expect(() => rgb_(0, -1, 0)).toThrow(
        "One of color components is outside 0-255 range",
      );
      expect(() => rgb_(0, 256, 0)).toThrow(
        "One of color components is outside 0-255 range",
      );
    });
  });

  describe("#fromRgbCssHex", () => {
    test("successful conversions", () => {
      expect(BpxRgbColor.fromCssHex("#000000")).toEqual(rgb_(0, 0, 0));
      expect(BpxRgbColor.fromCssHex("#010203")).toEqual(rgb_(1, 2, 3));
      expect(BpxRgbColor.fromCssHex("#f1f2f3")).toEqual(rgb_(241, 242, 243));
      expect(BpxRgbColor.fromCssHex("#ffffff")).toEqual(rgb_(255, 255, 255));
    });

    test("normalization", () => {
      expect(BpxRgbColor.fromCssHex("#ABCDEF").cssHex).toEqual("#abcdef");
    });

    test("validation", () => {
      expect(() => BpxRgbColor.fromCssHex("#1234567")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
      expect(() => BpxRgbColor.fromCssHex("#12345")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
      expect(() => BpxRgbColor.fromCssHex("#00000g")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
      expect(() => BpxRgbColor.fromCssHex("#00#0000")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
      expect(() => BpxRgbColor.fromCssHex("# 000000")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
    });
  });

  describe("#cssHex", () => {
    test("successful conversions", () => {
      expect(rgb_(0, 0, 0).cssHex).toEqual("#000000");
      expect(rgb_(1, 2, 3).cssHex).toEqual("#010203");
      expect(rgb_(241, 242, 243).cssHex).toEqual("#f1f2f3");
      expect(rgb_(255, 255, 255).cssHex).toEqual("#ffffff");
    });
  });
});
