import { describe, expect, test } from "@jest/globals";
import { SolidColor } from "./Color";

describe("SolidColor", () => {
  describe("constructor", () => {
    test("successful construction", () => {
      const color = new SolidColor(1, 2, 3);

      expect(color.r).toEqual(1);
      expect(color.g).toEqual(2);
      expect(color.b).toEqual(3);
    });

    test("validation", () => {
      expect(() => new SolidColor(0, -1, 0)).toThrow(
        "One of color components is outside 0-255 range",
      );
      expect(() => new SolidColor(0, 256, 0)).toThrow(
        "One of color components is outside 0-255 range",
      );
    });
  });

  describe("#fromRgbCssHex", () => {
    test("successful conversions", () => {
      expect(SolidColor.fromRgbCssHex("#000000")).toEqual(
        new SolidColor(0, 0, 0),
      );
      expect(SolidColor.fromRgbCssHex("#010203")).toEqual(
        new SolidColor(1, 2, 3),
      );
      expect(SolidColor.fromRgbCssHex("#f1f2f3")).toEqual(
        new SolidColor(241, 242, 243),
      );
      expect(SolidColor.fromRgbCssHex("#ffffff")).toEqual(
        new SolidColor(255, 255, 255),
      );
    });

    test("normalization", () => {
      expect(SolidColor.fromRgbCssHex("#ABCDEF").asRgbCssHex()).toEqual(
        "#abcdef",
      );
    });

    test("validation", () => {
      expect(() => SolidColor.fromRgbCssHex("#1234567")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
      expect(() => SolidColor.fromRgbCssHex("#12345")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
      expect(() => SolidColor.fromRgbCssHex("#00000g")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
      expect(() => SolidColor.fromRgbCssHex("#00#0000")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
      expect(() => SolidColor.fromRgbCssHex("# 000000")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
    });
  });

  describe("#asRgbCssHex", () => {
    test("successful conversions", () => {
      expect(new SolidColor(0, 0, 0).asRgbCssHex()).toEqual("#000000");
      expect(new SolidColor(1, 2, 3).asRgbCssHex()).toEqual("#010203");
      expect(new SolidColor(241, 242, 243).asRgbCssHex()).toEqual("#f1f2f3");
      expect(new SolidColor(255, 255, 255).asRgbCssHex()).toEqual("#ffffff");
    });
  });
});
