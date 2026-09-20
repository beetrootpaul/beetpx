import { describe, test } from "vitest";
import { BpxCanvasSnapshotColorMapping } from "../../color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "../../color/PatternColors";
import { $rgb, $v } from "../../shorthands";
import { BpxDrawingPattern } from "../DrawingPattern";
import { drawingTestSetup } from "../DrawingTestSetup";

describe("DrawRect", () => {
  const ct = null;
  const c0 = $rgb("#010203");
  const c1 = $rgb("#111213");
  const c2 = $rgb("#212223");
  const c3 = $rgb("#313233");
  const c4 = $rgb("#414243");
  const c5 = $rgb("#515253");

  describe("regular", () => {
    test("simple 1x1", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.drawRect($v(1, 1), $v(1, 1), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - # -
          - - -
        `,
      });
    });

    test("simple 4x3", () => {
      const dts = drawingTestSetup(6, 5, c0);

      dts.drawApi.drawRect($v(1, 1), $v(4, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - # # # # -
          - # - - # -
          - # # # # -
          - - - - - -
        `,
      });
    });

    test("drawing on very edges of a canvas", () => {
      const dts = drawingTestSetup(4, 3, c0);

      dts.drawApi.drawRect($v(0, 0), $v(4, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # #
          # - - #
          # # # #
        `,
      });
    });

    test("0-size", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.drawRect($v(1, 1), $v(0, 0), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
      });
    });

    test("negative left-top corner", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.drawRect($v(-1, -1), $v(3, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - # -
          # # -
          - - -
        `,
      });
    });

    test("negative size", () => {
      const dts = drawingTestSetup(6, 5, c0);

      dts.drawApi.drawRect($v(5, 4), $v(-4, -3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - # # # # -
          - # - - # -
          - # # # # -
          - - - - - -
        `,
      });
    });

    test("rounding", () => {
      const dts = drawingTestSetup(16, 9, c0);

      // These numbers are chosen in away which should test whether rounding
      //   is performed before on initial values of xy and wh (which is *not*
      //   what we want here) or rather on calculated xy1 and x2.
      dts.drawApi.drawRect($v(1.6, 2.4), $v(12.6, 4.4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - # # # # # # # # # # # # - -
          - - # - - - - - - - - - - # - -
          - - # - - - - - - - - - - # - -
          - - # - - - - - - - - - - # - -
          - - # # # # # # # # # # # # - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
        `,
      });
    });

    test("clipping: over the left edge", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.drawRect($v(-2, 1), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          # # - - - -
          - # - - - -
          - # - - - -
          # # - - - -
          - - - - - -
        `,
      });
    });

    test("clipping: over the right edge", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.drawRect($v(4, 1), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - - - # #
          - - - - # -
          - - - - # -
          - - - - # #
          - - - - - -
        `,
      });
    });

    test("clipping: over the top edge", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.drawRect($v(1, -2), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - # - - # -
          - # # # # -
          - - - - - -
          - - - - - -
          - - - - - -
          - - - - - -
        `,
      });
    });

    test("clipping: over the bottom edge", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.drawRect($v(1, 4), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - - - - -
          - - - - - -
          - - - - - -
          - # # # # -
          - # - - # -
        `,
      });
    });

    test("pattern: simple one, with a single color", () => {
      const dts = drawingTestSetup(4, 4, c0);

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ####
          ###-
          ##--
          #---
        `),
      );
      dts.drawApi.drawRect($v(0, 0), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # #
          # - - -
          # - - -
          # - - -
        `,
      });
    });

    test("pattern: simple one, with two colors", () => {
      const dts = drawingTestSetup(4, 4, c0);

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ####
          #---
          ##--
          #---
        `),
      );
      dts.drawApi.drawRect($v(0, 0), $v(4, 4), BpxPatternColors.of(c1, c2));

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2 },
        expectedImageAsAscii: `
          # # # #
          # - - :
          # - - :
          # : : :
        `,
      });
    });

    test("pattern: various 4x4 patterns", () => {
      const dts = drawingTestSetup(10, 10, c0);

      dts.drawApi.setDrawingPattern(BpxDrawingPattern.primaryOnly);
      dts.drawApi.drawRect($v(0, 0), $v(10, 10), BpxPatternColors.of(c4, c1));

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          = = = = = = = = = =
          = - - - - - - - - =
          = - - - - - - - - =
          = - - - - - - - - =
          = - - - - - - - - =
          = - - - - - - - - =
          = - - - - - - - - =
          = - - - - - - - - =
          = - - - - - - - - =
          = = = = = = = = = =
        `,
      });

      dts.drawApi.setDrawingPattern(BpxDrawingPattern.secondaryOnly);
      dts.drawApi.drawRect($v(2, 2), $v(6, 6), BpxPatternColors.of(c4, c2));

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          = = = = = = = = = =
          = - - - - - - - - =
          = - : : : : : : - =
          = - : - - - - : - =
          = - : - - - - : - =
          = - : - - - - : - =
          = - : - - - - : - =
          = - : : : : : : - =
          = - - - - - - - - =
          = = = = = = = = = =
        `,
      });

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ####
          ###-
          ##--
          #---
        `),
      );
      dts.drawApi.drawRect($v(0, 0), $v(10, 10), BpxPatternColors.of(c3, ct));

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          % % % % % % % % % %
          % - - - - - - - - %
          % - : : : : : : - %
          % - : - - - - : - =
          % - : - - - - : - %
          % - : - - - - : - %
          % - : - - - - : - %
          % - : : : : : : - =
          % - - - - - - - - %
          % % % = % % % = % %
        `,
      });

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ##--
          ##--
          ##--
          ##--
        `),
      );
      dts.drawApi.drawRect($v(0, 0), $v(10, 5), BpxPatternColors.of(c5, ct));
      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          --##
          --##
          --##
          --##
        `),
      );
      dts.drawApi.drawRect($v(0, 5), $v(10, 5), BpxPatternColors.of(c5, c1));

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          ^ ^ % % ^ ^ % % ^ ^
          ^ - - - - - - - - ^
          ^ - : : : : : : - ^
          ^ - : - - - - : - ^
          ^ ^ : - ^ ^ - : ^ ^
          # # ^ ^ # # ^ ^ # #
          # - : - - - - : - #
          # - : : : : : : - #
          # - - - - - - - - #
          # # ^ ^ # # ^ ^ # #
        `,
      });
    });

    test("pattern: 4x4 pattern is aligned with canvas' top-left corner", () => {
      const dts = drawingTestSetup(11, 11, c0);

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ####
          ###-
          ##--
          #---
        `),
      );
      dts.drawApi.drawRect($v(1, 1), $v(9, 9), BpxPatternColors.of(c1, ct));

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - -
          - # # - # # # - # # -
          - # - - - - - - - # -
          - - - - - - - - - - -
          - # - - - - - - - # -
          - # - - - - - - - # -
          - # - - - - - - - # -
          - - - - - - - - - - -
          - # - - - - - - - # -
          - # # - # # # - # # -
          - - - - - - - - - - -
        `,
      });
    });

    test("camera XY", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.setCameraXy($v(3, -2));
      dts.drawApi.drawRect($v(1, 1), $v(12, 5), BpxPatternColors.of(c1, c2));

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "@": c2 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          # # # # # # # # # # - - - - 
          - - - - - - - - - # - - - - 
          - - - - - - - - - # - - - - 
          - - - - - - - - - # - - - - 
        `,
      });
    });

    test("camera XY + pattern", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.setCameraXy($v(3, -2));
      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ##--
          ##--
          --##
          --##
        `),
      );
      dts.drawApi.drawRect($v(1, 1), $v(12, 5), BpxPatternColors.of(c1, c2));

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "@": c2 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          @ @ # # @ @ # # @ @ - - - - 
          - - - - - - - - - # - - - - 
          - - - - - - - - - # - - - - 
          - - - - - - - - - @ - - - - 
        `,
      });
    });

    test("canvas snapshot color mapping", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.drawRectFilled($v(0, 2), $v(14, 3), c1);
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

      dts.drawApi.drawRectFilled($v(5, 0), $v(4, 7), c1);
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

      dts.drawApi.drawRect(
        $v(1, 1),
        $v(12, 5),
        BpxCanvasSnapshotColorMapping.of(snapshotColor =>
          snapshotColor?.cssHex === c1.cssHex ? c2 : c3,
        ),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "/": c2, "%": c3 },
        expectedImageAsAscii: `
          - - - - - # # # # - - - - -
          - % % % % % % % % % % % % -
          # / # # # # # # # # # # / #
          # / # # # # # # # # # # / #
          # / # # # # # # # # # # / #
          - % % % % % % % % % % % % -
          - - - - - # # # # - - - - -
        `,
      });
    });
  });

  describe("filled", () => {
    test("simple 1x1", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.drawRectFilled($v(1, 1), $v(1, 1), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - # -
          - - -
        `,
      });
    });

    test("simple 4x3", () => {
      const dts = drawingTestSetup(6, 5, c0);

      dts.drawApi.drawRectFilled($v(1, 1), $v(4, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - # # # # -
          - # # # # -
          - # # # # -
          - - - - - -
        `,
      });
    });

    test("drawing on very edges of a canvas", () => {
      const dts = drawingTestSetup(4, 3, c0);

      dts.drawApi.drawRectFilled($v(0, 0), $v(4, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # #
          # # # #
          # # # #
        `,
      });
    });

    test("0-size", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.drawRectFilled($v(1, 1), $v(0, 0), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
      });
    });

    test("negative left-top corner", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.drawRectFilled($v(-1, -1), $v(3, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # -
          # # -
          - - -
        `,
      });
    });

    test("negative size", () => {
      const dts = drawingTestSetup(6, 5, c0);

      dts.drawApi.drawRectFilled($v(5, 4), $v(-4, -3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - # # # # -
          - # # # # -
          - # # # # -
          - - - - - -
        `,
      });
    });

    test("rounding", () => {
      const dts = drawingTestSetup(16, 9, c0);

      // These numbers are chosen in away which should test whether rounding
      //   is performed before on initial values of xy and wh (which is *not*
      //   what we want here) or rather on calculated xy1 and x2.
      dts.drawApi.drawRectFilled($v(1.6, 2.4), $v(12.6, 4.4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - # # # # # # # # # # # # - -
          - - # # # # # # # # # # # # - -
          - - # # # # # # # # # # # # - -
          - - # # # # # # # # # # # # - -
          - - # # # # # # # # # # # # - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
        `,
      });
    });

    test("clipping: over the left edge", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.drawRectFilled($v(-2, 1), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          # # - - - -
          # # - - - -
          # # - - - -
          # # - - - -
          - - - - - -
        `,
      });
    });

    test("clipping: over the right edge", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.drawRectFilled($v(4, 1), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - - - # #
          - - - - # #
          - - - - # #
          - - - - # #
          - - - - - -
        `,
      });
    });

    test("clipping: over the top edge", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.drawRectFilled($v(1, -2), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - # # # # -
          - # # # # -
          - - - - - -
          - - - - - -
          - - - - - -
          - - - - - -
        `,
      });
    });

    test("clipping: over the bottom edge", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.drawRectFilled($v(1, 4), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - - - - -
          - - - - - -
          - - - - - -
          - # # # # -
          - # # # # -
        `,
      });
    });

    test("pattern: simple one, with a single color", () => {
      const dts = drawingTestSetup(4, 4, c0);

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ####
          ###-
          ##--
          #---
        `),
      );
      dts.drawApi.drawRectFilled($v(0, 0), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # #
          # # # -
          # # - -
          # - - -
        `,
      });
    });

    test("pattern: simple one, with two colors", () => {
      const dts = drawingTestSetup(4, 4, c0);

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ####
          ###-
          ##--
          #---
        `),
      );
      dts.drawApi.drawRectFilled(
        $v(0, 0),
        $v(4, 4),
        BpxPatternColors.of(c1, c2),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2 },
        expectedImageAsAscii: `
          # # # #
          # # # :
          # # : :
          # : : :
        `,
      });
    });

    test("pattern: various 4x4 patterns", () => {
      const dts = drawingTestSetup(10, 10, c0);

      dts.drawApi.setDrawingPattern(BpxDrawingPattern.primaryOnly);
      dts.drawApi.drawRectFilled(
        $v(0, 0),
        $v(10, 10),
        BpxPatternColors.of(c4, c1),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
        `,
      });

      dts.drawApi.setDrawingPattern(BpxDrawingPattern.secondaryOnly);
      dts.drawApi.drawRectFilled(
        $v(2, 2),
        $v(6, 6),
        BpxPatternColors.of(c4, c2),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          = = = = = = = = = =
          = = = = = = = = = =
          = = : : : : : : = =
          = = : : : : : : = =
          = = : : : : : : = =
          = = : : : : : : = =
          = = : : : : : : = =
          = = : : : : : : = =
          = = = = = = = = = =
          = = = = = = = = = =
        `,
      });

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ####
          ###-
          ##--
          #---
        `),
      );
      dts.drawApi.drawRectFilled(
        $v(0, 0),
        $v(10, 10),
        BpxPatternColors.of(c3, ct),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          % % % % % % % % % %
          % % % = % % % = % %
          % % : : % % : : % %
          % = : : % : : : % =
          % % % % % % % % % %
          % % % : % % % : % %
          % % : : % % : : % %
          % = : : % : : : % =
          % % % % % % % % % %
          % % % = % % % = % %
        `,
      });

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ##--
          ##--
          ##--
          ##--
        `),
      );
      dts.drawApi.drawRectFilled(
        $v(0, 0),
        $v(10, 5),
        BpxPatternColors.of(c5, ct),
      );
      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          --##
          --##
          --##
          --##
        `),
      );
      dts.drawApi.drawRectFilled(
        $v(0, 5),
        $v(10, 5),
        BpxPatternColors.of(c5, c1),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          ^ ^ % % ^ ^ % % ^ ^
          ^ ^ % = ^ ^ % = ^ ^
          ^ ^ : : ^ ^ : : ^ ^
          ^ ^ : : ^ ^ : : ^ ^
          ^ ^ % % ^ ^ % % ^ ^
          # # ^ ^ # # ^ ^ # #
          # # ^ ^ # # ^ ^ # #
          # # ^ ^ # # ^ ^ # #
          # # ^ ^ # # ^ ^ # #
          # # ^ ^ # # ^ ^ # #
        `,
      });
    });

    test("pattern: 4x4 pattern is aligned with canvas' top-left corner", () => {
      const dts = drawingTestSetup(11, 11, c0);

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ####
          ###-
          ##--
          #---
        `),
      );
      dts.drawApi.drawRectFilled(
        $v(1, 1),
        $v(9, 9),
        BpxPatternColors.of(c1, ct),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - -
          - # # - # # # - # # -
          - # - - # # - - # # -
          - - - - # - - - # - -
          - # # # # # # # # # -
          - # # - # # # - # # -
          - # - - # # - - # # -
          - - - - # - - - # - -
          - # # # # # # # # # -
          - # # - # # # - # # -
          - - - - - - - - - - -
        `,
      });
    });

    test("camera XY", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.setCameraXy($v(3, -2));
      dts.drawApi.drawRectFilled(
        $v(1, 1),
        $v(12, 5),
        BpxPatternColors.of(c1, c2),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "@": c2 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          # # # # # # # # # # - - - - 
          # # # # # # # # # # - - - - 
          # # # # # # # # # # - - - - 
          # # # # # # # # # # - - - - 
        `,
      });
    });

    test("camera XY + pattern", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.setCameraXy($v(3, -2));
      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ##--
          ##--
          --##
          --##
        `),
      );
      dts.drawApi.drawRectFilled(
        $v(1, 1),
        $v(12, 5),
        BpxPatternColors.of(c1, c2),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "@": c2 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          - - - - - - - - - - - - - - 
          @ @ # # @ @ # # @ @ - - - - 
          # # @ @ # # @ @ # # - - - - 
          # # @ @ # # @ @ # # - - - - 
          @ @ # # @ @ # # @ @ - - - - 
        `,
      });
    });

    test("canvas snapshot color mapping", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.drawRectFilled($v(0, 2), $v(14, 3), c1);
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

      dts.drawApi.drawRectFilled($v(5, 0), $v(4, 7), c1);
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

      dts.drawApi.drawRectFilled(
        $v(1, 1),
        $v(12, 5),
        BpxCanvasSnapshotColorMapping.of(snapshotColor =>
          snapshotColor?.cssHex === c1.cssHex ? c2 : c3,
        ),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "/": c2, "%": c3 },
        expectedImageAsAscii: `
          - - - - - # # # # - - - - -
          - % % % % % % % % % % % % -
          # / / / / / / / / / / / / #
          # / / / / / / / / / / / / #
          # / / / / / / / / / / / / #
          - % % % % % % % % % % % % -
          - - - - - # # # # - - - - -
        `,
      });
    });
  });

  describe("outside filled", () => {
    test("simple 1x1", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.drawRectOutsideFilled($v(1, 1), $v(1, 1), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # #
          # # #
          # # #
        `,
      });
    });

    test("simple 4x3", () => {
      const dts = drawingTestSetup(6, 5, c0);

      dts.drawApi.drawRectOutsideFilled($v(1, 1), $v(4, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # # # #
          # # # # # #
          # # - - # #
          # # # # # #
          # # # # # #
        `,
      });
    });

    test("drawing on very edges of a canvas", () => {
      const dts = drawingTestSetup(4, 3, c0);

      dts.drawApi.drawRectOutsideFilled($v(0, 0), $v(4, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # #
          # - - #
          # # # #
        `,
      });
    });

    test("drawing outside edges of a canvas", () => {
      const dts = drawingTestSetup(4, 3, c0);

      dts.drawApi.drawRectOutsideFilled($v(-1, -1), $v(6, 5), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - -
          - - - -
          - - - -
        `,
      });
    });

    test("0-size", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.drawRectOutsideFilled($v(1, 1), $v(0, 0), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # #
          # # #
          # # #
        `,
      });
    });

    test("negative left-top corner", () => {
      const dts = drawingTestSetup(3, 3, c0);

      dts.drawApi.drawRectOutsideFilled($v(-1, -1), $v(3, 3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - # #
          # # #
          # # #
        `,
      });
    });

    test("negative size", () => {
      const dts = drawingTestSetup(6, 5, c0);

      dts.drawApi.drawRectOutsideFilled($v(5, 4), $v(-4, -3), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # # # #
          # # # # # #
          # # - - # #
          # # # # # #
          # # # # # #
        `,
      });
    });

    test("rounding", () => {
      const dts = drawingTestSetup(16, 9, c0);

      // These numbers are chosen in away which should test whether rounding
      //   is performed before on initial values of xy and wh (which is *not*
      //   what we want here) or rather on calculated xy1 and x2.
      dts.drawApi.drawRectOutsideFilled($v(1.6, 2.4), $v(12.6, 4.4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # # # # # # # # # # # # # #
          # # # # # # # # # # # # # # # #
          # # # # # # # # # # # # # # # #
          # # # - - - - - - - - - - # # #
          # # # - - - - - - - - - - # # #
          # # # - - - - - - - - - - # # #
          # # # # # # # # # # # # # # # #
          # # # # # # # # # # # # # # # #
          # # # # # # # # # # # # # # # #
        `,
      });
    });

    test("clipping: over the left edge", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.drawRectOutsideFilled($v(-2, 1), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # # # #
          # # # # # #
          - # # # # #
          - # # # # #
          # # # # # #
          # # # # # #
        `,
      });
    });

    test("clipping: over the right edge", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.drawRectOutsideFilled($v(4, 1), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # # # #
          # # # # # #
          # # # # # -
          # # # # # -
          # # # # # #
          # # # # # #
        `,
      });
    });

    test("clipping: over the top edge", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.drawRectOutsideFilled($v(1, -2), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # - - # #
          # # # # # #
          # # # # # #
          # # # # # #
          # # # # # #
          # # # # # #
        `,
      });
    });

    test("clipping: over the bottom edge", () => {
      const dts = drawingTestSetup(6, 6, c0);

      dts.drawApi.drawRectOutsideFilled($v(1, 4), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # # # #
          # # # # # #
          # # # # # #
          # # # # # #
          # # # # # #
          # # - - # #
        `,
      });
    });

    test("pattern: simple one, with a single color", () => {
      const dts = drawingTestSetup(8, 8, c0);

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ####
          ###-
          ##--
          #---
        `),
      );
      dts.drawApi.drawRectOutsideFilled($v(2, 2), $v(4, 4), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # # # # # #
          # # # - # # # -
          # # - - # # - -
          # - - - - - - -
          # # # - - # # #
          # # # - # # # -
          # # - - # # - -
          # - - - # - - -
        `,
      });
    });

    test("pattern: simple one, with two colors", () => {
      const dts = drawingTestSetup(8, 8, c0);

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ####
          ###-
          ##--
          #---
        `),
      );
      dts.drawApi.drawRectOutsideFilled(
        $v(2, 2),
        $v(4, 4),
        BpxPatternColors.of(c1, c2),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2 },
        expectedImageAsAscii: `
          # # # # # # # #
          # # # : # # # :
          # # : : # # : :
          # : : - - : : :
          # # # - - # # #
          # # # : # # # :
          # # : : # # : :
          # : : : # : : :
        `,
      });
    });

    test("pattern: 4x4 pattern is aligned with canvas' top-left corner", () => {
      const dts = drawingTestSetup(11, 11, c0);

      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ####
          ###-
          ##--
          #---
        `),
      );
      dts.drawApi.drawRectOutsideFilled(
        $v(1, 1),
        $v(9, 9),
        BpxPatternColors.of(c1, ct),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # # # # # # # # #
          # # # - # # # - # # #
          # # - - - - - - - # -
          # - - - - - - - - - -
          # # - - - - - - - # #
          # # - - - - - - - # #
          # # - - - - - - - # -
          # - - - - - - - - - -
          # # - - - - - - - # #
          # # # - # # # - # # #
          # # - - # # - - # # -
        `,
      });
    });

    test("camera XY", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.setCameraXy($v(3, -2));
      dts.drawApi.drawRectOutsideFilled(
        $v(1, 1),
        $v(12, 5),
        BpxPatternColors.of(c1, c2),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "@": c2 },
        expectedImageAsAscii: `
          # # # # # # # # # # # # # # 
          # # # # # # # # # # # # # # 
          # # # # # # # # # # # # # # 
          # # # # # # # # # # # # # # 
          - - - - - - - - - # # # # # 
          - - - - - - - - - # # # # # 
          - - - - - - - - - # # # # # 
        `,
      });
    });

    test("camera XY + pattern", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.setCameraXy($v(3, -2));
      dts.drawApi.setDrawingPattern(
        BpxDrawingPattern.from(`
          ##--
          ##--
          --##
          --##
        `),
      );
      dts.drawApi.drawRectOutsideFilled(
        $v(1, 1),
        $v(12, 5),
        BpxPatternColors.of(c1, c2),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "@": c2 },
        expectedImageAsAscii: `
          # # @ @ # # @ @ # # @ @ # # 
          # # @ @ # # @ @ # # @ @ # # 
          @ @ # # @ @ # # @ @ # # @ @ 
          @ @ # # @ @ # # @ @ # # @ @ 
          - - - - - - - - - # @ @ # # 
          - - - - - - - - - # @ @ # # 
          - - - - - - - - - @ # # @ @ 
        `,
      });
    });

    test("canvas snapshot color mapping", () => {
      const dts = drawingTestSetup(14, 7, c0);

      dts.drawApi.drawRectOutsideFilled($v(-1, 1), $v(16, 5), c1);
      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # # # # # # # # # # # #
          # # # # # # # # # # # # # #
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          # # # # # # # # # # # # # #
          # # # # # # # # # # # # # #
        `,
      });

      dts.drawApi.takeCanvasSnapshot();

      dts.drawApi.drawRectOutsideFilled($v(3, -1), $v(8, 9), c1);
      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # # # # # # # # # # # #
          # # # # # # # # # # # # # #
          # # # # - - - - - - # # # #
          # # # # - - - - - - # # # #
          # # # # - - - - - - # # # #
          # # # # # # # # # # # # # #
          # # # # # # # # # # # # # #
        `,
      });

      dts.drawApi.drawRectOutsideFilled(
        $v(4, 2),
        $v(6, 3),
        BpxCanvasSnapshotColorMapping.of(snapshotColor =>
          snapshotColor?.cssHex === c1.cssHex ? c2 : c3,
        ),
      );

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, "/": c2, "%": c3 },
        expectedImageAsAscii: `
          / / / / / / / / / / / / / /
          / / / / / / / / / / / / / /
          % % % % % % % % % % % % % %
          % % % % % - - - - % % % % %
          % % % % % % % % % % % % % %
          / / / / / / / / / / / / / /
          / / / / / / / / / / / / / /
        `,
      });
    });
  });
});
