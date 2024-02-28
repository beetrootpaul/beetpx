import { describe, expect, test } from "@jest/globals";
import { BpxRgbColor } from "./RgbColor";

describe("RgbColor", () => {
  describe("construction", () => {
    test("successful construction", () => {
      const color = BpxRgbColor.of(1, 2, 3);

      expect(color.r).toEqual(1);
      expect(color.g).toEqual(2);
      expect(color.b).toEqual(3);
    });

    test("validation", () => {
      expect(() => BpxRgbColor.of(0, -1, 0)).toThrow(
        "One of color components is outside 0-255 range",
      );
      expect(() => BpxRgbColor.of(0, 256, 0)).toThrow(
        "One of color components is outside 0-255 range",
      );
    });
  });

  describe("#fromRgbCssHex", () => {
    test("successful conversions", () => {
      expect(BpxRgbColor.fromCssHex("#000000")).toEqual(
        BpxRgbColor.of(0, 0, 0),
      );
      expect(BpxRgbColor.fromCssHex("#010203")).toEqual(
        BpxRgbColor.of(1, 2, 3),
      );
      expect(BpxRgbColor.fromCssHex("#f1f2f3")).toEqual(
        BpxRgbColor.of(241, 242, 243),
      );
      expect(BpxRgbColor.fromCssHex("#ffffff")).toEqual(
        BpxRgbColor.of(255, 255, 255),
      );
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
      expect(BpxRgbColor.of(0, 0, 0).cssHex).toEqual("#000000");
      expect(BpxRgbColor.of(1, 2, 3).cssHex).toEqual("#010203");
      expect(BpxRgbColor.of(241, 242, 243).cssHex).toEqual("#f1f2f3");
      expect(BpxRgbColor.of(255, 255, 255).cssHex).toEqual("#ffffff");
    });
  });
});
