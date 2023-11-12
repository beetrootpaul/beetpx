import { describe, expect, test } from "@jest/globals";
import { BpxSolidColor } from "./SolidColor";

describe("SolidColor", () => {
  describe("constructor", () => {
    test("successful construction", () => {
      const color = new BpxSolidColor(1, 2, 3);

      expect(color.r).toEqual(1);
      expect(color.g).toEqual(2);
      expect(color.b).toEqual(3);
    });

    test("validation", () => {
      expect(() => new BpxSolidColor(0, -1, 0)).toThrow(
        "One of color components is outside 0-255 range",
      );
      expect(() => new BpxSolidColor(0, 256, 0)).toThrow(
        "One of color components is outside 0-255 range",
      );
    });
  });

  describe("#fromRgbCssHex", () => {
    test("successful conversions", () => {
      expect(BpxSolidColor.fromRgbCssHex("#000000")).toEqual(
        new BpxSolidColor(0, 0, 0),
      );
      expect(BpxSolidColor.fromRgbCssHex("#010203")).toEqual(
        new BpxSolidColor(1, 2, 3),
      );
      expect(BpxSolidColor.fromRgbCssHex("#f1f2f3")).toEqual(
        new BpxSolidColor(241, 242, 243),
      );
      expect(BpxSolidColor.fromRgbCssHex("#ffffff")).toEqual(
        new BpxSolidColor(255, 255, 255),
      );
    });

    test("normalization", () => {
      expect(BpxSolidColor.fromRgbCssHex("#ABCDEF").asRgbCssHex()).toEqual(
        "#abcdef",
      );
    });

    test("validation", () => {
      expect(() => BpxSolidColor.fromRgbCssHex("#1234567")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
      expect(() => BpxSolidColor.fromRgbCssHex("#12345")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
      expect(() => BpxSolidColor.fromRgbCssHex("#00000g")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
      expect(() => BpxSolidColor.fromRgbCssHex("#00#0000")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
      expect(() => BpxSolidColor.fromRgbCssHex("# 000000")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
    });
  });

  describe("#asRgbCssHex", () => {
    test("successful conversions", () => {
      expect(new BpxSolidColor(0, 0, 0).asRgbCssHex()).toEqual("#000000");
      expect(new BpxSolidColor(1, 2, 3).asRgbCssHex()).toEqual("#010203");
      expect(new BpxSolidColor(241, 242, 243).asRgbCssHex()).toEqual("#f1f2f3");
      expect(new BpxSolidColor(255, 255, 255).asRgbCssHex()).toEqual("#ffffff");
    });
  });
});
