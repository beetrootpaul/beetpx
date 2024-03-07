import { describe, expect, test } from "vitest";
import { BpxRgbColor } from "./RgbColor";

describe("RgbColor", () => {
  describe("construction", () => {
    test("successful construction", () => {
      const color = BpxRgbColor.of(1, 2, 3);

      expect(color.r).toEqual(1);
      expect(color.g).toEqual(2);
      expect(color.b).toEqual(3);
    });

    test("normalization", () => {
      expect(BpxRgbColor.of(-1, 22, 33).asArray()).toEqual([0, 22, 33]);
      expect(BpxRgbColor.of(11, -2, 33).asArray()).toEqual([11, 0, 33]);
      expect(BpxRgbColor.of(11, 22, -3).asArray()).toEqual([11, 22, 0]);

      expect(BpxRgbColor.of(256, 22, 33).asArray()).toEqual([255, 22, 33]);
      expect(BpxRgbColor.of(11, 256, 33).asArray()).toEqual([11, 255, 33]);
      expect(BpxRgbColor.of(11, 22, 256).asArray()).toEqual([11, 22, 255]);

      expect(BpxRgbColor.of(10.6, 22, 33).asArray()).toEqual([11, 22, 33]);
      expect(BpxRgbColor.of(11.4, 22, 33).asArray()).toEqual([11, 22, 33]);
      expect(BpxRgbColor.of(11, 21.6, 33).asArray()).toEqual([11, 22, 33]);
      expect(BpxRgbColor.of(11, 22.4, 33).asArray()).toEqual([11, 22, 33]);
      expect(BpxRgbColor.of(11, 22, 32.6).asArray()).toEqual([11, 22, 33]);
      expect(BpxRgbColor.of(11, 22, 33.4).asArray()).toEqual([11, 22, 33]);
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
