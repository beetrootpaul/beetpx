import { describe, test } from "@jest/globals";
import { BpxSolidColor } from "../Color";
import { DrawClear } from "./DrawClear";
import { TestCanvas } from "./TestCanvas";

describe("DrawClear", () => {
  const c0 = BpxSolidColor.fromRgbCssHex("#010203");
  const c1 = BpxSolidColor.fromRgbCssHex("#111213");

  test("clear the whole canvas with a given color", () => {
    // given
    const canvas = new TestCanvas(4, 3, c0);
    const clear = new DrawClear(canvas.pixels);

    // when
    clear.draw(c1);

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        # # # #
        # # # #
        # # # #
      `,
    });
  });
});
