import { describe, test } from "@jest/globals";
import { BpxRgbColor } from "../color/RgbColor";
import { v_ } from "../misc/Vector2d";
import { DrawLine } from "./DrawLine";
import { TestCanvas } from "./TestCanvas";

describe("DrawLine", () => {
  const ct = null;
  const c0 = BpxRgbColor.fromCssHex("#010203");
  const c1 = BpxRgbColor.fromCssHex("#111213");
  const c2 = BpxRgbColor.fromCssHex("#212223");
  const c3 = BpxRgbColor.fromCssHex("#313233");
  const c4 = BpxRgbColor.fromCssHex("#414243");

  test("1x1", () => {
    // given
    const canvas = new TestCanvas(3, 3, c0);
    const rect = new DrawLine(canvas.canvas);

    // when
    rect.draw(v_(1, 1), v_(1, 1), c1);

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - # -
        - - -
      `,
    });
  });

  test("2x2", () => {
    // given
    const canvas = new TestCanvas(4, 4, c0);
    const rect = new DrawLine(canvas.canvas);

    // when
    rect.draw(v_(1, 1), v_(2, 2), c1);

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(6, 5, c0);
    const rect = new DrawLine(canvas.canvas);

    // when
    rect.draw(v_(1, 1), v_(4, 3), c1);

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(15, 8, c0);
    const rect = new DrawLine(canvas.canvas);

    // when
    rect.draw(v_(1, 1), v_(13, 6), c1);

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(13, 4, c0);
    const rect = new DrawLine(canvas.canvas);

    // when
    rect.draw(v_(1, 1), v_(11, 2), c1);

    // then
    canvas.expectToEqual({
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
      // given
      const canvas = new TestCanvas(11, 9, c0);
      const rect = new DrawLine(canvas.canvas);

      // when
      rect.draw(v_(1, 1), v_(9, 7), c1);

      // then
      canvas.expectToEqual({
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
      // given
      const canvas = new TestCanvas(11, 9, c0);
      const rect = new DrawLine(canvas.canvas);

      // when
      rect.draw(v_(1, 7), v_(9, -7), c1);

      // then
      canvas.expectToEqual({
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
      // given
      const canvas = new TestCanvas(11, 9, c0);
      const rect = new DrawLine(canvas.canvas);

      // when
      rect.draw(v_(9, 1), v_(-9, 7), c1);

      // then
      canvas.expectToEqual({
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
      // given
      const canvas = new TestCanvas(11, 9, c0);
      const rect = new DrawLine(canvas.canvas);

      // when
      rect.draw(v_(9, 7), v_(-9, -7), c1);

      // then
      canvas.expectToEqual({
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
      // given
      const canvas = new TestCanvas(9, 11, c0);
      const rect = new DrawLine(canvas.canvas);

      // when
      rect.draw(v_(1, 1), v_(7, 9), c1);

      // then
      canvas.expectToEqual({
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
      // given
      const canvas = new TestCanvas(9, 11, c0);
      const rect = new DrawLine(canvas.canvas);

      // when
      rect.draw(v_(1, 9), v_(7, -9), c1);

      // then
      canvas.expectToEqual({
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
      // given
      const canvas = new TestCanvas(9, 11, c0);
      const rect = new DrawLine(canvas.canvas);

      // when
      rect.draw(v_(7, 1), v_(-7, 9), c1);

      // then
      canvas.expectToEqual({
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
      // given
      const canvas = new TestCanvas(9, 11, c0);
      const rect = new DrawLine(canvas.canvas);

      // when
      rect.draw(v_(7, 9), v_(-7, -9), c1);

      // then
      canvas.expectToEqual({
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

  test("drawing on very edges of a canvas", () => {
    // given
    const canvas = new TestCanvas(5, 5, c0);
    const rect = new DrawLine(canvas.canvas);

    // when
    rect.draw(v_(1, 0), v_(3, 1), c1);
    rect.draw(v_(1, 4), v_(3, 1), c2);
    rect.draw(v_(0, 1), v_(1, 3), c3);
    rect.draw(v_(4, 1), v_(1, 3), c4);

    // then
    canvas.expectToEqual({
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
    // given
    const canvas = new TestCanvas(3, 3, c0);
    const rect = new DrawLine(canvas.canvas);

    // when
    rect.draw(v_(1, 1), v_(0, 0), c1);

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
    });

    // and when
    rect.draw(v_(1, 1), v_(2, 0), c1);

    // then still
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
    });

    // and when
    rect.draw(v_(1, 1), v_(0, 2), c1);

    // then still
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
    });
  });

  test("clipping: over the left edge", () => {
    // given
    const canvas = new TestCanvas(3, 3, c0);
    const rect = new DrawLine(canvas.canvas);

    // when
    rect.draw(v_(-2, 1), v_(4, 1), c1);

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        # # -
        - - -
      `,
    });
  });

  test("clipping: over the right edge", () => {
    // given
    const canvas = new TestCanvas(3, 3, c0);
    const rect = new DrawLine(canvas.canvas);

    // when
    rect.draw(v_(1, 1), v_(4, 1), c1);

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - # #
        - - -
      `,
    });
  });

  test("clipping: over the top edge", () => {
    // given
    const canvas = new TestCanvas(3, 3, c0);
    const rect = new DrawLine(canvas.canvas);

    // when
    rect.draw(v_(1, -2), v_(1, 4), c1);

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - # -
        - # -
        - - -
      `,
    });
  });

  test("clipping: over the bottom edge", () => {
    // given
    const canvas = new TestCanvas(3, 3, c0);
    const rect = new DrawLine(canvas.canvas);

    // when
    rect.draw(v_(1, 1), v_(1, 4), c1);

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1 },
      expectedImageAsAscii: `
        - - -
        - # -
        - # -
      `,
    });
  });
});
