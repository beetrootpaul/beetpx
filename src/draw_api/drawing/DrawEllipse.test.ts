import { describe, test } from "vitest";
import { BpxCanvasSnapshotColorMapping } from "../../color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "../../color/PatternColors";
import { BpxRgbColor } from "../../color/RgbColor";
import { v_ } from "../../shorthands";
import { BpxDrawingPattern } from "../DrawingPattern";
import { drawingTestSetup } from "../DrawingTestSetup";

describe("DrawEllipse", () => {
  const c0 = BpxRgbColor.fromCssHex("#010203");
  const c1 = BpxRgbColor.fromCssHex("#111213");
  const c2 = BpxRgbColor.fromCssHex("#212223");
  const c3 = BpxRgbColor.fromCssHex("#313233");

  describe("regular", () => {
    test("0-size", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.drawEllipse(v_(1, 1), v_(0, 0), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(1, 1), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(2, 2), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(3, 3), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(4, 3), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(4, 4), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(5, 5), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(6, 6), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(7, 7), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(12, 5), c1);

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

      dts.drawApi.drawEllipse(v_(13, 6), v_(-12, -5), c1);

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

    test("rounding", () => {
      const dts = drawingTestSetup(16, 9, c0);

      // These numbers are chosen in away which should test whether rounding
      //   is performed before on initial values of xy and wh (which is *not*
      //   what we want here) or rather on calculated xy1 and x2.
      dts.drawApi.drawEllipse(v_(1.6, 2.4), v_(12.6, 4.4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - # # # # # # - - - - -
          - - - # # - - - - - - # # - - -
          - - # - - - - - - - - - - # - -
          - - - # # - - - - - - # # - - -
          - - - - - # # # # # # - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
        `,
      });
    });

    test("tall: 1x13", () => {
      const dts = drawingTestSetup(3, 15, c0);

      dts.drawApi.drawEllipse(v_(1, 1), v_(1, 13), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(2, 13), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(3, 13), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(4, 13), c1);

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

      dts.drawApi.drawEllipse(v_(1, 1), v_(5, 13), c1);

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

      dts.drawApi.drawEllipse(v_(-6, 1), v_(12, 5), c1);

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

      dts.drawApi.drawEllipse(v_(8, 1), v_(12, 5), c1);

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

      dts.drawApi.drawEllipse(v_(1, -2), v_(12, 5), c1);

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

      dts.drawApi.drawEllipse(v_(1, 4), v_(12, 5), c1);

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

    test("camera XY", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.setCameraXy(v_(3, -2));
      dts.drawApi.drawEllipse(v_(1, 1), v_(12, 5), BpxPatternColors.of(c1, c2));

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "@": c2 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          - # # # # # # - - - - - - - 
          # - - - - - - # # - - - - - 
          - - - - - - - - - # - - - - 
          # - - - - - - # # - - - - - 
        `,
      });
    });

    test("pattern", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ##--
          ##--
          --##
          --##
        `),
      );
      dts.drawApi.drawEllipse(v_(1, 1), v_(12, 5), BpxPatternColors.of(c1, c2));

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "@": c2 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - # # @ @ # # - - - -
          - - # # - - - - - - # # - -
          - @ - - - - - - - - - - @ -
          - - @ @ - - - - - - @ @ - -
          - - - - # # @ @ # # - - - -
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("camera XY + pattern", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.setCameraXy(v_(3, -2));
      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ##--
          ##--
          --##
          --##
        `),
      );
      dts.drawApi.drawEllipse(v_(1, 1), v_(12, 5), BpxPatternColors.of(c1, c2));

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "@": c2 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          - @ # # @ @ # - - - - - - - 
          # - - - - - - @ # - - - - - 
          - - - - - - - - - # - - - - 
          @ - - - - - - # @ - - - - - 
        `,
      });
    });

    test("canvas snapshot color mapping", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.drawRectFilled(v_(0, 2), v_(14, 3), c1);
      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          # # # # # # # # # # # # # #
          # # # # # # # # # # # # # #
          # # # # # # # # # # # # # #
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
        `,
      });

      dts.drawApi.takeCanvasSnapshot();

      dts.drawApi.drawRectFilled(v_(5, 0), v_(4, 7), c1);
      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - # # # # - - - - -
          - - - - - # # # # - - - - -
          # # # # # # # # # # # # # #
          # # # # # # # # # # # # # #
          # # # # # # # # # # # # # #
          - - - - - # # # # - - - - -
          - - - - - # # # # - - - - -
        `,
      });

      dts.drawApi.drawEllipse(
        v_(1, 1),
        v_(12, 5),
        BpxCanvasSnapshotColorMapping.of((snapshotColor) =>
          snapshotColor?.cssHex === c1.cssHex ? c2 : c3,
        ),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "/": c2, "%": c3 },
        expectedImageAsAscii: `
          - - - - - # # # # - - - - -
          - - - - % % % % % % - - - -
          # # / / # # # # # # / / # #
          # / # # # # # # # # # # / #
          # # / / # # # # # # / / # #
          - - - - % % % % % % - - - -
          - - - - - # # # # - - - - -
        `,
      });
    });
  });

  describe("filled", () => {
    test("0-size", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(0, 0), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(1, 1), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(2, 2), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(3, 3), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(4, 3), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(4, 4), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(5, 5), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(6, 6), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(7, 7), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(12, 5), c1);

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

      dts.drawApi.drawEllipseFilled(v_(13, 6), v_(-12, -5), c1);

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

    test("rounding", () => {
      const dts = drawingTestSetup(16, 9, c0);

      // These numbers are chosen in away which should test whether rounding
      //   is performed before on initial values of xy and wh (which is *not*
      //   what we want here) or rather on calculated xy1 and x2.
      dts.drawApi.drawEllipseFilled(v_(1.6, 2.4), v_(12.6, 4.4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - # # # # # # - - - - -
          - - - # # # # # # # # # # - - -
          - - # # # # # # # # # # # # - -
          - - - # # # # # # # # # # - - -
          - - - - - # # # # # # - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
        `,
      });
    });

    test("tall: 1x13", () => {
      const dts = drawingTestSetup(3, 15, c0);

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(1, 13), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(2, 13), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(3, 13), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(4, 13), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 1), v_(5, 13), c1);

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

      dts.drawApi.drawEllipseFilled(v_(-6, 1), v_(12, 5), c1);

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

      dts.drawApi.drawEllipseFilled(v_(8, 1), v_(12, 5), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, -2), v_(12, 5), c1);

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

      dts.drawApi.drawEllipseFilled(v_(1, 4), v_(12, 5), c1);

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

    test("camera XY", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.setCameraXy(v_(3, -2));
      dts.drawApi.drawEllipseFilled(
        v_(1, 1),
        v_(12, 5),
        BpxPatternColors.of(c1, c2),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "@": c2 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          - # # # # # # - - - - - - - 
          # # # # # # # # # - - - - - 
          # # # # # # # # # # - - - - 
          # # # # # # # # # - - - - - 
        `,
      });
    });

    test("pattern", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ##--
          ##--
          --##
          --##
        `),
      );
      dts.drawApi.drawEllipseFilled(
        v_(1, 1),
        v_(12, 5),
        BpxPatternColors.of(c1, c2),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "@": c2 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - # # @ @ # # - - - -
          - - # # @ @ # # @ @ # # - -
          - @ # # @ @ # # @ @ # # @ -
          - - @ @ # # @ @ # # @ @ - -
          - - - - # # @ @ # # - - - -
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("camera XY + pattern", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.setCameraXy(v_(3, -2));
      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ##--
          ##--
          --##
          --##
        `),
      );
      dts.drawApi.drawEllipseFilled(
        v_(1, 1),
        v_(12, 5),
        BpxPatternColors.of(c1, c2),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "@": c2 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          - @ # # @ @ # - - - - - - - 
          # # @ @ # # @ @ # - - - - - 
          # # @ @ # # @ @ # # - - - - 
          @ @ # # @ @ # # @ - - - - - 
        `,
      });
    });

    test("canvas snapshot color mapping", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.drawRectFilled(v_(0, 2), v_(14, 3), c1);
      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          # # # # # # # # # # # # # #
          # # # # # # # # # # # # # #
          # # # # # # # # # # # # # #
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
        `,
      });

      dts.drawApi.takeCanvasSnapshot();

      dts.drawApi.drawRectFilled(v_(5, 0), v_(4, 7), c1);
      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - # # # # - - - - -
          - - - - - # # # # - - - - -
          # # # # # # # # # # # # # #
          # # # # # # # # # # # # # #
          # # # # # # # # # # # # # #
          - - - - - # # # # - - - - -
          - - - - - # # # # - - - - -
        `,
      });

      dts.drawApi.drawEllipseFilled(
        v_(1, 1),
        v_(12, 5),
        BpxCanvasSnapshotColorMapping.of((snapshotColor) =>
          snapshotColor?.cssHex === c1.cssHex ? c2 : c3,
        ),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "/": c2, "%": c3 },
        expectedImageAsAscii: `
          - - - - - # # # # - - - - -
          - - - - % % % % % % - - - -
          # # / / / / / / / / / / # #
          # / / / / / / / / / / / / #
          # # / / / / / / / / / / # #
          - - - - % % % % % % - - - -
          - - - - - # # # # - - - - -
        `,
      });
    });
  });
});
