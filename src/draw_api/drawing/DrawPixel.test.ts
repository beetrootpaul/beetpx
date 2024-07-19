import { describe, test } from "vitest";
import { $rgb, $v } from "../../shorthands";
import { BpxDrawingPattern } from "../DrawingPattern";
import { drawingTestSetup } from "../DrawingTestSetup";

describe("DrawPixel", () => {
  const c0 = $rgb("#010203");
  const c1 = $rgb("#111213");
  const c2 = $rgb("#212223");
  const c3 = $rgb("#313233");
  const c4 = $rgb("#414243");

  test("a single pixel", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.drawPixel($v(1, 1), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - # -
        - - -
      `,
    });
  });

  test("canvas' corners", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.drawPixel($v(0, 0), c1);
    dts.drawApi.drawPixel($v(2, 0), c2);
    dts.drawApi.drawPixel($v(0, 2), c3);
    dts.drawApi.drawPixel($v(2, 2), c4);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        # - :
        - - -
        % - =
      `,
    });
  });

  test("outside canvas", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.drawPixel($v(-1, 1), c1);
    dts.drawApi.drawPixel($v(3, 1), c1);
    dts.drawApi.drawPixel($v(1, -1), c1);
    dts.drawApi.drawPixel($v(1, 3), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - - -
        - - -
      `,
    });
  });

  test("rounding", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.drawPixel($v(1.49, 0.51), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - # -
        - - -
      `,
    });
  });

  test("camera XY", () => {
    const dts = drawingTestSetup(5, 5, c0);

    dts.drawApi.setCameraXy($v(2, -1));
    dts.drawApi.drawPixel($v(2, 2), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - -
        - - - - -
        - - - - -
        # - - - -
        - - - - -
      `,
    });
  });

  test("pattern", () => {
    const dts = drawingTestSetup(8, 8, c0);

    dts.drawApi.setDrawingPattern(
      BpxDrawingPattern.from(`
        ##--
        ##--
        --##
        --##
      `),
    );
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        dts.drawApi.drawPixel($v(x, y), c1);
      }
    }

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        # # - - # # - -
        # # - - # # - -
        - - # # - - # #
        - - # # - - # #
        # # - - # # - -
        # # - - # # - -
        - - # # - - # #
        - - # # - - # #
      `,
    });
  });

  test("camera XY + pattern", () => {
    const dts = drawingTestSetup(8, 8, c0);

    dts.drawApi.setDrawingPattern(
      BpxDrawingPattern.from(`
        ##--
        ##--
        --##
        --##
      `),
    );
    dts.drawApi.setCameraXy($v(2, -1));
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        dts.drawApi.drawPixel($v(x, y), c1);
      }
    }

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - -
        # # - - # # - -
        - - # # - - - -
        - - # # - - - -
        # # - - # # - -
        # # - - # # - -
        - - # # - - - -
        - - # # - - - -
      `,
    });
  });
});
