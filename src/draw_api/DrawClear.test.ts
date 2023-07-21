import { describe, test } from "@jest/globals";
import { SolidColor } from "../Color";
import { DrawClear } from "./DrawClear";
import { TestCanvas } from "./TestCanvas";

describe("DrawClear", () => {
  const c0 = SolidColor.fromRgbCssHex("#010203");
  const c1 = SolidColor.fromRgbCssHex("#111213");

  test("clear the whole canvas with a given color", () => {
    // given
    const canvas = new TestCanvas(4, 3, c0);
    const clear = new DrawClear(canvas.bytes, canvas.size);

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
