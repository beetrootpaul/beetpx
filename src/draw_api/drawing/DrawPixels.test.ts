import { describe, test } from "@jest/globals";
import { BpxRgbColor } from "../../color/RgbColor";
import { v_ } from "../../misc/Vector2d";
import { drawingTestSetup } from "../DrawingTestSetup";
import { BpxPattern } from "../Pattern";

describe("DrawPixels", () => {
  const c0 = BpxRgbColor.fromCssHex("#010203");
  const c1 = BpxRgbColor.fromCssHex("#111213");

  test("1x1", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.pixels(v_(1, 1), c1, ["#"]);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - # -
        - - -
      `,
    });
  });

  test("a complex and uneven set of bits", () => {
    const dts = drawingTestSetup(18, 10, c0);

    dts.drawApi.pixels(v_(1, 1), c1, [
      "##_##_##",
      "##_##_##",
      "#_#__#_#",
      "___________",
      "___________",
      "################",
      "__________##",
      "#",
    ]);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - - - - - - - - - - - - -
        - # # - # # - # # - - - - - - - - -
        - # # - # # - # # - - - - - - - - -
        - # - # - - # - # - - - - - - - - -
        - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - -
        - # # # # # # # # # # # # # # # # -
        - - - - - - - - - - - # # - - - - -
        - # - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - -
      `,
    });
  });

  test("0-size", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.pixels(v_(1, 1), c1, ["", "", ""]);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - - -
        - - -
      `,
    });

    dts.drawApi.pixels(v_(1, 1), c1, []);

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
    const dts = drawingTestSetup(7, 6, c0);

    dts.drawApi.pixels(v_(2.49, 1.51), c1, ["###", "###"]);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - - -
        - - - - - - -
        - - # # # - -
        - - # # # - -
        - - - - - - -
        - - - - - - -
      `,
    });
  });

  test("clipping: left edge", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.pixels(v_(-2, 1), c1, ["####", "####", "####", "####"]);

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

  test("clipping: right edge", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.pixels(v_(4, 1), c1, ["####", "####", "####", "####"]);

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

  test("clipping: top edge", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.pixels(v_(1, -2), c1, ["####", "####", "####", "####"]);

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

  test("clipping: bottom edge", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.pixels(v_(1, 4), c1, ["####", "####", "####", "####"]);

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

  test("camera offset", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.setCameraOffset(v_(3, -2));
    dts.drawApi.pixels(v_(1, 1), c1, ["####", "####", "####", "####"]);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - -
        - - - - - -
        - - - - - -
        # # - - - -
        # # - - - -
        # # - - - -
      `,
    });
  });

  test("pattern", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.setPattern(BpxPattern.of(0b0011_0011_1100_1100));
    dts.drawApi.pixels(v_(1, 1), c1, ["####", "####", "####", "####"]);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - -
        - # - - # -
        - - # # - -
        - - # # - -
        - # - - # -
        - - - - - -
      `,
    });
  });

  test("camera offset + pattern", () => {
    const dts = drawingTestSetup(6, 6, c0);

    dts.drawApi.setCameraOffset(v_(3, -2));
    dts.drawApi.setPattern(BpxPattern.of(0b0011_0011_1100_1100));
    dts.drawApi.pixels(v_(1, 1), c1, ["####", "####", "####", "####"]);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - - - - -
        - - - - - -
        - - - - - -
        - - - - - -
        # # - - - -
        # # - - - -
      `,
    });
  });
});
