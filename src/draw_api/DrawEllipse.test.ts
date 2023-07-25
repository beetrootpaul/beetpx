import { describe, test } from "@jest/globals";
import { SolidColor } from "../Color";
import { v_ } from "../Vector2d";
import { DrawEllipse } from "./DrawEllipse";
import { TestCanvas } from "./TestCanvas";

// TODO: tests for fill pattern

describe("DrawEllipse", () => {
  const c0 = SolidColor.fromRgbCssHex("#010203");
  const c1 = SolidColor.fromRgbCssHex("#111213");

  describe("regular", () => {
    test("0-size", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, 1);
      ellipse.draw(xy1, xy1, c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
      });
    });

    test("1x1", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, 1);
      ellipse.draw(xy1, xy1.add(1), c1, false);

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
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, 1);
      ellipse.draw(xy1, xy1.add(2), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - -
          - # # -
          - # # -
          - - - -
        `,
      });
    });

    test("4x3", () => {
      // given
      const canvas = new TestCanvas(6, 5, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, 1);
      ellipse.draw(xy1, xy1.add(v_(4, 3)), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - # # - -
          - # - - # -
          - - # # - -
          - - - - - -
        `,
      });
    });

    test("12x5", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, 1);
      ellipse.draw(xy1, xy1.add(v_(12, 5)), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - # # # # # # - - - -
          - - # # - - - - - - # # - -
          - # - - - - - - - - - - # -
          - - # # - - - - - - # # - -
          - - - - # # # # # # - - - -
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("negative 12x5", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(13, 6);
      ellipse.draw(xy1, xy1.add(v_(-12, -5)), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - # # # # # # - - - -
          - - # # - - - - - - # # - -
          - # - - - - - - - - - - # -
          - - # # - - - - - - # # - -
          - - - - # # # # # # - - - -
          - - - - - - - - - - - - - -
         `,
      });
    });

    test("clipping: over the left edge", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(-6, 1);
      ellipse.draw(xy1, xy1.add(v_(12, 5)), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          # # # - - - - - - - - - - -
          - - - # # - - - - - - - - -
          - - - - - # - - - - - - - -
          - - - # # - - - - - - - - -
          # # # - - - - - - - - - - -
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("clipping: over the right edge", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(8, 1);
      ellipse.draw(xy1, xy1.add(v_(12, 5)), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - - - - - - - - # # #
          - - - - - - - - - # # - - -
          - - - - - - - - # - - - - -
          - - - - - - - - - # # - - -
          - - - - - - - - - - - # # #
          - - - - - - - - - - - - - -
       `,
      });
    });

    test("clipping: over the top edge", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, -2);
      ellipse.draw(xy1, xy1.add(v_(12, 5)), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - # - - - - - - - - - - # -
          - - # # - - - - - - # # - -
          - - - - # # # # # # - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("clipping: over the bottom edge", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, 4);
      ellipse.draw(xy1, xy1.add(v_(12, 5)), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - # # # # # # - - - -
          - - # # - - - - - - # # - -
          - # - - - - - - - - - - # -
        `,
      });
    });
  });

  describe("filled", () => {
    test("0-size", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, 1);
      ellipse.draw(xy1, xy1, c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - - -
          - - -
        `,
      });
    });

    test("1x1", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, 1);
      ellipse.draw(xy1, xy1.add(1), c1, true);

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
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, 1);
      ellipse.draw(xy1, xy1.add(2), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - -
          - # # -
          - # # -
          - - - -
        `,
      });
    });

    test("4x3", () => {
      // given
      const canvas = new TestCanvas(6, 5, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, 1);
      ellipse.draw(xy1, xy1.add(v_(4, 3)), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - # # - -
          - # # # # -
          - - # # - -
          - - - - - -
        `,
      });
    });

    test("12x5", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, 1);
      ellipse.draw(xy1, xy1.add(v_(12, 5)), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - # # # # # # - - - -
          - - # # # # # # # # # # - -
          - # # # # # # # # # # # # -
          - - # # # # # # # # # # - -
          - - - - # # # # # # - - - -
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("negative 12x5", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(13, 6);
      ellipse.draw(xy1, xy1.add(v_(-12, -5)), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - # # # # # # - - - -
          - - # # # # # # # # # # - -
          - # # # # # # # # # # # # -
          - - # # # # # # # # # # - -
          - - - - # # # # # # - - - -
          - - - - - - - - - - - - - -
       `,
      });
    });

    test("clipping: over the left edge", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(-6, 1);
      ellipse.draw(xy1, xy1.add(v_(12, 5)), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          # # # - - - - - - - - - - -
          # # # # # - - - - - - - - -
          # # # # # # - - - - - - - -
          # # # # # - - - - - - - - -
          # # # - - - - - - - - - - -
          - - - - - - - - - - - - - -
       `,
      });
    });

    test("clipping: over the right edge", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(8, 1);
      ellipse.draw(xy1, xy1.add(v_(12, 5)), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - - - - - - - - # # #
          - - - - - - - - - # # # # #
          - - - - - - - - # # # # # #
          - - - - - - - - - # # # # #
          - - - - - - - - - - - # # #
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("clipping: over the top edge", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, -2);
      ellipse.draw(xy1, xy1.add(v_(12, 5)), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - # # # # # # # # # # # # -
          - - # # # # # # # # # # - -
          - - - - # # # # # # - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
        `,
      });
    });

    test("clipping: over the bottom edge", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      const xy1 = v_(1, 4);
      ellipse.draw(xy1, xy1.add(v_(12, 5)), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - - - - - - - - - - -
          - - - - # # # # # # - - - -
          - - # # # # # # # # # # - -
          - # # # # # # # # # # # # -
        `,
      });
    });
  });
});
