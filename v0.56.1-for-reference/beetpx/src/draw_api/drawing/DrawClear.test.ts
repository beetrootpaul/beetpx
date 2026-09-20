import { describe, test } from "vitest";
import { $rgb, $v } from "../../shorthands";
import { BpxDrawingPattern } from "../DrawingPattern";
import { drawingTestSetup } from "../DrawingTestSetup";

describe("DrawClear", () => {
  const c0 = $rgb("#010203");
  const c1 = $rgb("#111213");

  test("clear the whole canvas with a given color", () => {
    const dts = drawingTestSetup(4, 3, c0);

    dts.drawApi.clearCanvas(c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        # # # #
        # # # #
        # # # #
      `,
    });
  });

  test("clipping region does not affect the canvas clearing", () => {
    const dts = drawingTestSetup(4, 3, c0);

    dts.drawApi.setClippingRegion($v(1, 1), $v(2, 2));
    dts.drawApi.clearCanvas(c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        # # # #
        # # # #
        # # # #
      `,
    });
  });

  test("camera XY does not affect the canvas clearing", () => {
    const dts = drawingTestSetup(4, 3, c0);

    dts.drawApi.setCameraXy($v(2, 2));
    dts.drawApi.clearCanvas(c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        # # # #
        # # # #
        # # # #
      `,
    });
  });

  test("pattern does not affect the canvas clearing", () => {
    const dts = drawingTestSetup(4, 3, c0);

    dts.drawApi.setDrawingPattern(BpxDrawingPattern.of(0b0101_1010_0101_1010));
    dts.drawApi.clearCanvas(c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        # # # #
        # # # #
        # # # #
      `,
    });
  });
});
