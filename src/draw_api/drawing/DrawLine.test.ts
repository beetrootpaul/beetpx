import { describe, test } from "@jest/globals";
import { BpxCanvasSnapshotColorMapping } from "../../color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "../../color/PatternColors";
import { BpxRgbColor } from "../../color/RgbColor";
import { v_ } from "../../misc/Vector2d";
import { drawingTestSetup } from "../DrawingTestSetup";
import { BpxPattern } from "../Pattern";

describe("DrawLine", () => {
  const ct = null;
  const c0 = BpxRgbColor.fromCssHex("#010203");
  const c1 = BpxRgbColor.fromCssHex("#111213");
  const c2 = BpxRgbColor.fromCssHex("#212223");
  const c3 = BpxRgbColor.fromCssHex("#313233");
  const c4 = BpxRgbColor.fromCssHex("#414243");

  test("1x1", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.line(v_(1, 1), v_(1, 1), c1);

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

    dts.drawApi.line(v_(1, 1), v_(2, 2), c1);

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

    dts.drawApi.line(v_(1, 1), v_(4, 3), c1);

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

    dts.drawApi.line(v_(1, 1), v_(13, 6), c1);

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

    dts.drawApi.line(v_(1, 1), v_(11, 2), c1);

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

      dts.drawApi.line(v_(1, 1), v_(9, 7), c1);

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

      dts.drawApi.line(v_(1, 7), v_(9, -7), c1);

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

      dts.drawApi.line(v_(9, 1), v_(-9, 7), c1);

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

      dts.drawApi.line(v_(9, 7), v_(-9, -7), c1);

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

      dts.drawApi.line(v_(1, 1), v_(7, 9), c1);

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

      dts.drawApi.line(v_(1, 9), v_(7, -9), c1);

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

      dts.drawApi.line(v_(7, 1), v_(-7, 9), c1);

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

      dts.drawApi.line(v_(7, 9), v_(-7, -9), c1);

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
    dts.drawApi.line(v_(1.6, 2.4), v_(9.6, 6.4), c1);

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

    dts.drawApi.line(v_(1, 0), v_(3, 1), c1);
    dts.drawApi.line(v_(1, 4), v_(3, 1), c2);
    dts.drawApi.line(v_(0, 1), v_(1, 3), c3);
    dts.drawApi.line(v_(4, 1), v_(1, 3), c4);

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

    dts.drawApi.line(v_(1, 1), v_(0, 0), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
    });

    dts.drawApi.line(v_(1, 1), v_(2, 0), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
    });

    dts.drawApi.line(v_(1, 1), v_(0, 2), c1);

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

    dts.drawApi.line(v_(-2, 1), v_(4, 1), c1);

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

    dts.drawApi.line(v_(1, 1), v_(4, 1), c1);

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

    dts.drawApi.line(v_(1, -2), v_(1, 4), c1);

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

    dts.drawApi.line(v_(1, 1), v_(1, 4), c1);

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

    dts.drawApi.setCameraXy(v_(3, -1));
    dts.drawApi.line(v_(1, 1), v_(9, 7), c1);

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

    dts.drawApi.setPattern(BpxPattern.of(0b0011_0011_1100_1100));
    dts.drawApi.line(v_(1, 1), v_(9, 7), BpxPatternColors.of(c1, c2));

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

    dts.drawApi.setCameraXy(v_(3, -1));
    dts.drawApi.setPattern(BpxPattern.of(0b0011_0011_1100_1100));
    dts.drawApi.line(v_(1, 1), v_(9, 7), BpxPatternColors.of(c1, c2));

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

    dts.drawApi.rectFilled(v_(0, 2), v_(11, 2), c1);
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

    dts.drawApi.rectFilled(v_(0, 5), v_(11, 2), c1);
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

    dts.drawApi.line(
      v_(1, 1),
      v_(9, 7),
      BpxCanvasSnapshotColorMapping.of((snapshotColor) =>
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
