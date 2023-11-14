import { describe, test } from "@jest/globals";
import { BpxRgbColor } from "../../color/RgbColor";
import { v_ } from "../../misc/Vector2d";
import { drawingTestSetup } from "../DrawingTestSetup";

// TODO: REWORK THESE

describe("DrawPixel", () => {
  const c0 = BpxRgbColor.fromCssHex("#010203");
  const c1 = BpxRgbColor.fromCssHex("#111213");
  const c2 = BpxRgbColor.fromCssHex("#212223");
  const c3 = BpxRgbColor.fromCssHex("#313233");
  const c4 = BpxRgbColor.fromCssHex("#414243");

  test("a single pixel", () => {
    const dts = drawingTestSetup(3, 3, c0);

    dts.drawApi.pixel(v_(1, 1), c1);

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

    dts.drawApi.pixel(v_(0, 0), c1);
    dts.drawApi.pixel(v_(2, 0), c2);
    dts.drawApi.pixel(v_(0, 2), c3);
    dts.drawApi.pixel(v_(2, 2), c4);

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

    dts.drawApi.pixel(v_(-1, 1), c1);
    dts.drawApi.pixel(v_(3, 1), c1);
    dts.drawApi.pixel(v_(1, -1), c1);
    dts.drawApi.pixel(v_(1, 3), c1);

    dts.canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - - -
        - - -
      `,
    });
  });
});
