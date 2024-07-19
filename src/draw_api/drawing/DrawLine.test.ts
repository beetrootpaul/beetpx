import { describe, test } from "vitest";
import { BpxCanvasSnapshotColorMapping } from "../../color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "../../color/PatternColors";
import { $rgb, $v } from "../../shorthands";
import { BpxDrawingPattern } from "../DrawingPattern";
import { drawingTestSetup } from "../DrawingTestSetup";

describe("DrawLine", () => {
  const c0 = $rgb("#010203");
  const c1 = $rgb("#111213");
  const c2 = $rgb("#212223");
  const c3 = $rgb("#313233");
  const c4 = $rgb("#414243");

  test("1x1", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.drawLine($v(1, 1), $v(1, 1), c1);

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

    dts.drawApi.drawLine($v(1, 1), $v(2, 2), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - -
        - # - -
        - - # -
        - - - -
      `,
    });
  });

  test("4x3", () => {
    const dts = drawingTestSetup(6, 5, c0);

    dts.drawApi.drawLine($v(1, 1), $v(4, 3), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - -
        - # - - - -
        - - # # - -
        - - - - # -
        - - - - - -
      `,
    });
  });

  test("13x6", () => {
    const dts = drawingTestSetup(15, 8, c0);

    dts.drawApi.drawLine($v(1, 1), $v(13, 6), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - - - - - -
        - # # - - - - - - - - - - - -
        - - - # # - - - - - - - - - -
        - - - - - # # - - - - - - - -
        - - - - - - - # # # - - - - -
        - - - - - - - - - - # # - - -
        - - - - - - - - - - - - # # -
        - - - - - - - - - - - - - - -
      `,
    });
  });

  test("11x2", () => {
    const dts = drawingTestSetup(13, 4, c0);

    dts.drawApi.drawLine($v(1, 1), $v(11, 2), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - - - -
        - # # # # # - - - - - - -
        - - - - - - # # # # # # -
        - - - - - - - - - - - - -
      `,
    });
  });

  describe("an asymmetrical line, in all possible directions", () => {
    test("9x7", () => {
      const dts = drawingTestSetup(11, 9, c0);

      dts.drawApi.drawLine($v(1, 1), $v(9, 7), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - -
          - # - - - - - - - - -
          - - # - - - - - - - -
          - - - # # - - - - - -
          - - - - - # - - - - -
          - - - - - - # - - - -
          - - - - - - - # # - -
          - - - - - - - - - # -
          - - - - - - - - - - -
        `,
      });
    });

    test("9x-7", () => {
      const dts = drawingTestSetup(11, 9, c0);

      dts.drawApi.drawLine($v(1, 7), $v(9, -7), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - -
          - - - - - - - - - # -
          - - - - - - - # # - -
          - - - - - - # - - - -
          - - - - - # - - - - -
          - - - # # - - - - - -
          - - # - - - - - - - -
          - # - - - - - - - - -
          - - - - - - - - - - -
        `,
      });
    });

    test("-9x7", () => {
      const dts = drawingTestSetup(11, 9, c0);

      dts.drawApi.drawLine($v(9, 1), $v(-9, 7), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - -
          - - - - - - - - - # -
          - - - - - - - - # - -
          - - - - - - # # - - -
          - - - - - # - - - - -
          - - - - # - - - - - -
          - - # # - - - - - - -
          - # - - - - - - - - -
          - - - - - - - - - - -
        `,
      });
    });

    test("-9x-7", () => {
      const dts = drawingTestSetup(11, 9, c0);

      dts.drawApi.drawLine($v(9, 7), $v(-9, -7), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - -
          - # - - - - - - - - -
          - - # # - - - - - - -
          - - - - # - - - - - -
          - - - - - # - - - - -
          - - - - - - # # - - -
          - - - - - - - - # - -
          - - - - - - - - - # -
          - - - - - - - - - - -
        `,
      });
    });

    test("7x9", () => {
      const dts = drawingTestSetup(9, 11, c0);

      dts.drawApi.drawLine($v(1, 1), $v(7, 9), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - # - - - - - - -
          - - # - - - - - -
          - - - # - - - - -
          - - - # - - - - -
          - - - - # - - - -
          - - - - - # - - -
          - - - - - - # - -
          - - - - - - # - -
          - - - - - - - # -
          - - - - - - - - -
        `,
      });
    });

    test("7x-9", () => {
      const dts = drawingTestSetup(9, 11, c0);

      dts.drawApi.drawLine($v(1, 9), $v(7, -9), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - - - - - - - # -
          - - - - - - # - -
          - - - - - - # - -
          - - - - - # - - -
          - - - - # - - - -
          - - - # - - - - -
          - - - # - - - - -
          - - # - - - - - -
          - # - - - - - - -
          - - - - - - - - -
        `,
      });
    });

    test("-7x9", () => {
      const dts = drawingTestSetup(9, 11, c0);

      dts.drawApi.drawLine($v(7, 1), $v(-7, 9), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - - - - - - - # -
          - - - - - - # - -
          - - - - - # - - -
          - - - - - # - - -
          - - - - # - - - -
          - - - # - - - - -
          - - # - - - - - -
          - - # - - - - - -
          - # - - - - - - -
          - - - - - - - - -
        `,
      });
    });

    test("-7x-9", () => {
      const dts = drawingTestSetup(9, 11, c0);

      dts.drawApi.drawLine($v(7, 9), $v(-7, -9), c1);

      dts.canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - # - - - - - - -
          - - # - - - - - -
          - - # - - - - - -
          - - - # - - - - -
          - - - - # - - - -
          - - - - - # - - -
          - - - - - # - - -
          - - - - - - # - -
          - - - - - - - # -
          - - - - - - - - -
        `,
      });
    });
  });

  test("rounding", () => {
    const dts = drawingTestSetup(13, 11, c0);

    // These numbers are chosen in away which should test whether rounding
    //   is performed before on initial values of xy and wh (which is *not*
    //   what we want here) or rather on calculated xy1 and x2.
    dts.drawApi.drawLine($v(1.6, 2.4), $v(9.6, 6.4), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - - - -
        - - - - - - - - - - - - -
        - - # - - - - - - - - - -
        - - - # - - - - - - - - -
        - - - - # # - - - - - - -
        - - - - - - # - - - - - -
        - - - - - - - # - - - - -
        - - - - - - - - # # - - -
        - - - - - - - - - - # - -
        - - - - - - - - - - - - -
        - - - - - - - - - - - - -
      `,
    });
  });

  test("drawing on very edges of a canvas", () => {
    const dts = drawingTestSetup(5, 5, c0);

    dts.drawApi.drawLine($v(1, 0), $v(3, 1), c1);
    dts.drawApi.drawLine($v(1, 4), $v(3, 1), c2);
    dts.drawApi.drawLine($v(0, 1), $v(1, 3), c3);
    dts.drawApi.drawLine($v(4, 1), $v(1, 3), c4);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - # # # -
        % - - - =
        % - - - =
        % - - - =
        - : : : -
      `,
    });
  });

  test("0-size", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.drawLine($v(1, 1), $v(0, 0), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
    });

    dts.drawApi.drawLine($v(1, 1), $v(2, 0), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
    });

    dts.drawApi.drawLine($v(1, 1), $v(0, 2), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
    });
  });

  test("clipping: over the left edge", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.drawLine($v(-2, 1), $v(4, 1), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        # # -
        - - -
      `,
    });
  });

  test("clipping: over the right edge", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.drawLine($v(1, 1), $v(4, 1), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - # #
        - - -
      `,
    });
  });

  test("clipping: over the top edge", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.drawLine($v(1, -2), $v(1, 4), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - # -
        - # -
        - - -
      `,
    });
  });

  test("clipping: over the bottom edge", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.drawLine($v(1, 1), $v(1, 4), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - # -
        - # -
      `,
    });
  });

  test("camera XY", () => {
    const dts = drawingTestSetup(11, 9, c0);

    dts.drawApi.setCameraXy($v(3, -1));
    dts.drawApi.drawLine($v(1, 1), $v(9, 7), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - -
        - - - - - - - - - - -
        - - - - - - - - - - -
        - - - - - - - - - - -
        # # - - - - - - - - -
        - - # - - - - - - - -
        - - - # - - - - - - -
        - - - - # # - - - - -
        - - - - - - # - - - -
      `,
    });
  });

  test("pattern", () => {
    const dts = drawingTestSetup(11, 9, c0);

    dts.drawApi.setDrawingPattern(
      BpxDrawingPattern.from(`
        ##--
        ##--
        --##
        --##
      `),
    );
    dts.drawApi.drawLine($v(1, 1), $v(9, 7), BpxPatternColors.of(c1, c2));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, "@": c2 },
      expectedImageAsAscii: `
        - - - - - - - - - - -
        - # - - - - - - - - -
        - - # - - - - - - - -
        - - - # @ - - - - - -
        - - - - - # - - - - -
        - - - - - - @ - - - -
        - - - - - - - # @ - -
        - - - - - - - - - @ -
        - - - - - - - - - - -
      `,
    });
  });

  test("camera XY + pattern", () => {
    const dts = drawingTestSetup(11, 9, c0);

    dts.drawApi.setCameraXy($v(3, -1));
    dts.drawApi.setDrawingPattern(
      BpxDrawingPattern.from(`
        ##--
        ##--
        --##
        --##
      `),
    );
    dts.drawApi.drawLine($v(1, 1), $v(9, 7), BpxPatternColors.of(c1, c2));

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, "@": c2 },
      expectedImageAsAscii: `
        - - - - - - - - - - -
        - - - - - - - - - - -
        - - - - - - - - - - -
        - - - - - - - - - - -
        # # - - - - - - - - -
        - - @ - - - - - - - -
        - - - # - - - - - - -
        - - - - @ @ - - - - -
        - - - - - - @ - - - -
      `,
    });
  });

  test("canvas snapshot color mapping", () => {
    const dts = drawingTestSetup(11, 9, c0);

    dts.drawApi.drawRectFilled($v(0, 2), $v(11, 2), c1);
    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - -
        - - - - - - - - - - -
        # # # # # # # # # # #
        # # # # # # # # # # #
        - - - - - - - - - - -
        - - - - - - - - - - -
        - - - - - - - - - - -
        - - - - - - - - - - -
        - - - - - - - - - - -
      `,
    });

    dts.drawApi.takeCanvasSnapshot();

    dts.drawApi.drawRectFilled($v(0, 5), $v(11, 2), c1);
    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - -
        - - - - - - - - - - -
        # # # # # # # # # # #
        # # # # # # # # # # #
        - - - - - - - - - - -
        # # # # # # # # # # #
        # # # # # # # # # # #
        - - - - - - - - - - -
        - - - - - - - - - - -
      `,
    });

    dts.drawApi.drawLine(
      $v(1, 1),
      $v(9, 7),
      BpxCanvasSnapshotColorMapping.of(snapshotColor =>
        snapshotColor?.cssHex === c1.cssHex ? c2 : c3,
      ),
    );

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, "/": c2, "%": c3 },
      expectedImageAsAscii: `
        - - - - - - - - - - -
        - % - - - - - - - - -
        # # / # # # # # # # #
        # # # / / # # # # # #
        - - - - - % - - - - -
        # # # # # # % # # # #
        # # # # # # # % % # #
        - - - - - - - - - % -
        - - - - - - - - - - -
      `,
    });
  });
});
