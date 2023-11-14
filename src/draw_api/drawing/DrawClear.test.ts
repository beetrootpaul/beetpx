import { describe, test } from "@jest/globals";
import { BpxRgbColor } from "../../color/RgbColor";
import { v_ } from "../../misc/Vector2d";
import { drawingTestSetup } from "../DrawingTestSetup";
import { BpxPattern } from "../Pattern";

describe("DrawClear", () => {
  const c0 = BpxRgbColor.fromCssHex("#010203");
  const c1 = BpxRgbColor.fromCssHex("#111213");

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

    dts.drawApi.setClippingRegion(v_(1, 1), v_(2, 2));
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

  test("camera offset does not affect the canvas clearing", () => {
    const dts = drawingTestSetup(4, 3, c0);

    dts.drawApi.setCameraOffset(v_(2, 2));
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

    dts.drawApi.setPattern(BpxPattern.of(0b1010_0101_1010_0101));
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
