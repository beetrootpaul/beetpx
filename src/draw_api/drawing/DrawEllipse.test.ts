import { describe, test } from "@jest/globals";
import { BpxRgbColor } from "../../color/RgbColor";
import { v_ } from "../../misc/Vector2d";
import { drawingTestSetup } from "../DrawingTestSetup";

// TODO: REWORK THESE

describe("DrawEllipse", () => {
  const c0 = BpxRgbColor.fromCssHex("#010203");
  const c1 = BpxRgbColor.fromCssHex("#111213");

  describe("regular", () => {
    test("0-size", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(0, 0), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
      });
    });

    test("1x1", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(1, 1), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - # -
          - - -
        `,
      });
    });

    test("2x2", () => {
      const dts = drawingTestSetup(4, 4, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(2, 2), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - -
          - # # -
          - # # -
          - - - -
        `,
      });
    });

    test("3x3", () => {
      const dts = drawingTestSetup(5, 5, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(3, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - -
          - - # - -
          - # - # -
          - - # - -
          - - - - -
        `,
      });
    });

    test("4x3", () => {
      const dts = drawingTestSetup(6, 5, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(4, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - # # - -
          - # - - # -
          - - # # - -
          - - - - - -
        `,
      });
    });

    test("4x4", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - # # - -
          - # - - # -
          - # - - # -
          - - # # - -
          - - - - - -
        `,
      });
    });

    test("5x5", () => {
      const dts = drawingTestSetup(7, 7, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(5, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - -
          - - # # # - -
          - # - - - # -
          - # - - - # -
          - # - - - # -
          - - # # # - -
          - - - - - - -
        `,
      });
    });

    test("6x6", () => {
      const dts = drawingTestSetup(8, 8, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(6, 6), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - -
          - - - # # - - -
          - - # - - # - -
          - # - - - - # -
          - # - - - - # -
          - - # - - # - -
          - - - # # - - -
          - - - - - - - -
        `,
      });
    });

    test("7x7", () => {
      const dts = drawingTestSetup(9, 9, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(7, 7), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - - - # # # - - -
          - - # - - - # - -
          - # - - - - - # -
          - # - - - - - # -
          - # - - - - - # -
          - - # - - - # - -
          - - - # # # - - -
          - - - - - - - - -
        `,
      });
    });

    test("12x5", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(12, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - # # # # # # - - - -
          - - # # - - - - - - # # - -
          - # - - - - - - - - - - # -
          - - # # - - - - - - # # - -
          - - - - # # # # # # - - - -
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("negative 12x5", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.ellipse(v_(13, 6), v_(-12, -5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - # # # # # # - - - -
          - - # # - - - - - - # # - -
          - # - - - - - - - - - - # -
          - - # # - - - - - - # # - -
          - - - - # # # # # # - - - -
          - - - - - - - - - - - - - -
         `,
      });
    });

    test("tall: 1x13", () => {
      const dts = drawingTestSetup(3, 15, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(1, 13), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - - -
        `,
      });
    });

    test("tall: 2x13", () => {
      const dts = drawingTestSetup(4, 15, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(2, 13), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - - - -
        `,
      });
    });

    test("tall: 3x13", () => {
      const dts = drawingTestSetup(5, 15, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(3, 13), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - -
          - - # - -
          - - # - -
          - # - # -
          - # - # -
          - # - # -
          - # - # -
          - # - # -
          - # - # -
          - # - # -
          - # - # -
          - # - # -
          - - # - -
          - - # - -
          - - - - -
        `,
      });
    });

    test("tall: 4x13", () => {
      const dts = drawingTestSetup(6, 15, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(4, 13), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - # # - -
          - - # # - -
          - - # # - -
          - # - - # -
          - # - - # -
          - # - - # -
          - # - - # -
          - # - - # -
          - # - - # -
          - # - - # -
          - - # # - -
          - - # # - -
          - - # # - -
          - - - - - -
        `,
      });
    });

    test("tall: 5x13", () => {
      const dts = drawingTestSetup(7, 15, c0);

      dts.drawApi.ellipse(v_(1, 1), v_(5, 13), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - -
          - - - # - - -
          - - # - # - -
          - - # - # - -
          - # - - - # -
          - # - - - # -
          - # - - - # -
          - # - - - # -
          - # - - - # -
          - # - - - # -
          - # - - - # -
          - - # - # - -
          - - # - # - -
          - - - # - - -
          - - - - - - -
        `,
      });
    });

    test("clipping: over the left edge", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.ellipse(v_(-6, 1), v_(12, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          # # # - - - - - - - - - - -
          - - - # # - - - - - - - - -
          - - - - - # - - - - - - - -
          - - - # # - - - - - - - - -
          # # # - - - - - - - - - - -
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("clipping: over the right edge", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.ellipse(v_(8, 1), v_(12, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - - - - - - - - # # #
          - - - - - - - - - # # - - -
          - - - - - - - - # - - - - -
          - - - - - - - - - # # - - -
          - - - - - - - - - - - # # #
          - - - - - - - - - - - - - -
       `,
      });
    });

    test("clipping: over the top edge", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.ellipse(v_(1, -2), v_(12, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - # - - - - - - - - - - # -
          - - # # - - - - - - # # - -
          - - - - # # # # # # - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("clipping: over the bottom edge", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.ellipse(v_(1, 4), v_(12, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - # # # # # # - - - -
          - - # # - - - - - - # # - -
          - # - - - - - - - - - - # -
        `,
      });
    });
  });

  describe("filled", () => {
    test("0-size", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(0, 0), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
      });
    });

    test("1x1", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(1, 1), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - # -
          - - -
        `,
      });
    });

    test("2x2", () => {
      const dts = drawingTestSetup(4, 4, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(2, 2), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - -
          - # # -
          - # # -
          - - - -
        `,
      });
    });

    test("3x3", () => {
      const dts = drawingTestSetup(5, 5, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(3, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - -
          - - # - -
          - # # # -
          - - # - -
          - - - - -
        `,
      });
    });

    test("4x3", () => {
      const dts = drawingTestSetup(6, 5, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(4, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - # # - -
          - # # # # -
          - - # # - -
          - - - - - -
        `,
      });
    });

    test("4x4", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - # # - -
          - # # # # -
          - # # # # -
          - - # # - -
          - - - - - -
        `,
      });
    });

    test("5x5", () => {
      const dts = drawingTestSetup(7, 7, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(5, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - -
          - - # # # - -
          - # # # # # -
          - # # # # # -
          - # # # # # -
          - - # # # - -
          - - - - - - -
        `,
      });
    });

    test("6x6", () => {
      const dts = drawingTestSetup(8, 8, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(6, 6), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - -
          - - - # # - - -
          - - # # # # - -
          - # # # # # # -
          - # # # # # # -
          - - # # # # - -
          - - - # # - - -
          - - - - - - - -
        `,
      });
    });

    test("7x7", () => {
      const dts = drawingTestSetup(9, 9, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(7, 7), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - - - # # # - - -
          - - # # # # # - -
          - # # # # # # # -
          - # # # # # # # -
          - # # # # # # # -
          - - # # # # # - -
          - - - # # # - - -
          - - - - - - - - -
        `,
      });
    });

    test("12x5", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(12, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - # # # # # # - - - -
          - - # # # # # # # # # # - -
          - # # # # # # # # # # # # -
          - - # # # # # # # # # # - -
          - - - - # # # # # # - - - -
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("negative 12x5", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.ellipseFilled(v_(13, 6), v_(-12, -5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - # # # # # # - - - -
          - - # # # # # # # # # # - -
          - # # # # # # # # # # # # -
          - - # # # # # # # # # # - -
          - - - - # # # # # # - - - -
          - - - - - - - - - - - - - -
       `,
      });
    });

    test("tall: 1x13", () => {
      const dts = drawingTestSetup(3, 15, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(1, 13), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - - -
        `,
      });
    });

    test("tall: 2x13", () => {
      const dts = drawingTestSetup(4, 15, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(2, 13), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - - - -
        `,
      });
    });

    test("tall: 3x13", () => {
      const dts = drawingTestSetup(5, 15, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(3, 13), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - -
          - - # - -
          - - # - -
          - # # # -
          - # # # -
          - # # # -
          - # # # -
          - # # # -
          - # # # -
          - # # # -
          - # # # -
          - # # # -
          - - # - -
          - - # - -
          - - - - -
        `,
      });
    });

    test("tall: 4x13", () => {
      const dts = drawingTestSetup(6, 15, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(4, 13), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - # # - -
          - - # # - -
          - - # # - -
          - # # # # -
          - # # # # -
          - # # # # -
          - # # # # -
          - # # # # -
          - # # # # -
          - # # # # -
          - - # # - -
          - - # # - -
          - - # # - -
          - - - - - -
        `,
      });
    });

    test("tall: 5x13", () => {
      const dts = drawingTestSetup(7, 15, c0);

      dts.drawApi.ellipseFilled(v_(1, 1), v_(5, 13), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - -
          - - - # - - -
          - - # # # - -
          - - # # # - -
          - # # # # # -
          - # # # # # -
          - # # # # # -
          - # # # # # -
          - # # # # # -
          - # # # # # -
          - # # # # # -
          - - # # # - -
          - - # # # - -
          - - - # - - -
          - - - - - - -
        `,
      });
    });

    test("clipping: over the left edge", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.ellipseFilled(v_(-6, 1), v_(12, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          # # # - - - - - - - - - - -
          # # # # # - - - - - - - - -
          # # # # # # - - - - - - - -
          # # # # # - - - - - - - - -
          # # # - - - - - - - - - - -
          - - - - - - - - - - - - - -
       `,
      });
    });

    test("clipping: over the right edge", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.ellipseFilled(v_(8, 1), v_(12, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - - - - - - - - # # #
          - - - - - - - - - # # # # #
          - - - - - - - - # # # # # #
          - - - - - - - - - # # # # #
          - - - - - - - - - - - # # #
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("clipping: over the top edge", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.ellipseFilled(v_(1, -2), v_(12, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - # # # # # # # # # # # # -
          - - # # # # # # # # # # - -
          - - - - # # # # # # - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("clipping: over the bottom edge", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.ellipseFilled(v_(1, 4), v_(12, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - # # # # # # - - - -
          - - # # # # # # # # # # - -
          - # # # # # # # # # # # # -
        `,
      });
    });
  });
});
