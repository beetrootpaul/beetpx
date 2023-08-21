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
      ellipse.draw(v_(1, 1), v_(0, 0), c1, false);

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
      ellipse.draw(v_(1, 1), v_(1, 1), c1, false);

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
      ellipse.draw(v_(1, 1), v_(2, 2), c1, false);

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

    test("3x3", () => {
      // given
      const canvas = new TestCanvas(5, 5, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(3, 3), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - -
          - - # - -
          - # - # -
          - - # - -
          - - - - -
        `,
      });
    });

    test("4x3", () => {
      // given
      const canvas = new TestCanvas(6, 5, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(4, 3), c1, false);

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

    test("4x4", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(4, 4), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - # # - -
          - # - - # -
          - # - - # -
          - - # # - -
          - - - - - -
        `,
      });
    });

    test("5x5", () => {
      // given
      const canvas = new TestCanvas(7, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(5, 5), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - -
          - - # # # - -
          - # - - - # -
          - # - - - # -
          - # - - - # -
          - - # # # - -
          - - - - - - -
        `,
      });
    });

    test("6x6", () => {
      // given
      const canvas = new TestCanvas(8, 8, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(6, 6), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - -
          - - - # # - - -
          - - # - - # - -
          - # - - - - # -
          - # - - - - # -
          - - # - - # - -
          - - - # # - - -
          - - - - - - - -
        `,
      });
    });

    test("7x7", () => {
      // given
      const canvas = new TestCanvas(9, 9, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(7, 7), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - - - # # # - - -
          - - # - - - # - -
          - # - - - - - # -
          - # - - - - - # -
          - # - - - - - # -
          - - # - - - # - -
          - - - # # # - - -
          - - - - - - - - -
        `,
      });
    });

    test("12x5", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(12, 5), c1, false);

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
      ellipse.draw(v_(13, 6), v_(-12, -5), c1, false);

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

    test("tall: 1x13", () => {
      // given
      const canvas = new TestCanvas(3, 15, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(1, 13), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - - -
        `,
      });
    });

    test("tall: 2x13", () => {
      // given
      const canvas = new TestCanvas(4, 15, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(2, 13), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - - - -
        `,
      });
    });

    test("tall: 3x13", () => {
      // given
      const canvas = new TestCanvas(5, 15, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(3, 13), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - -
          - - # - -
          - - # - -
          - # - # -
          - # - # -
          - # - # -
          - # - # -
          - # - # -
          - # - # -
          - # - # -
          - # - # -
          - # - # -
          - - # - -
          - - # - -
          - - - - -
        `,
      });
    });

    test("tall: 4x13", () => {
      // given
      const canvas = new TestCanvas(6, 15, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(4, 13), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - # # - -
          - - # # - -
          - - # # - -
          - # - - # -
          - # - - # -
          - # - - # -
          - # - - # -
          - # - - # -
          - # - - # -
          - # - - # -
          - - # # - -
          - - # # - -
          - - # # - -
          - - - - - -
        `,
      });
    });

    test("tall: 5x13", () => {
      // given
      const canvas = new TestCanvas(7, 15, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(5, 13), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - -
          - - - # - - -
          - - # - # - -
          - - # - # - -
          - # - - - # -
          - # - - - # -
          - # - - - # -
          - # - - - # -
          - # - - - # -
          - # - - - # -
          - # - - - # -
          - - # - # - -
          - - # - # - -
          - - - # - - -
          - - - - - - -
        `,
      });
    });

    test("clipping: over the left edge", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(-6, 1), v_(12, 5), c1, false);

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
      ellipse.draw(v_(8, 1), v_(12, 5), c1, false);

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
      ellipse.draw(v_(1, -2), v_(12, 5), c1, false);

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
      ellipse.draw(v_(1, 4), v_(12, 5), c1, false);

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
      ellipse.draw(v_(1, 1), v_(0, 0), c1, true);

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
      ellipse.draw(v_(1, 1), v_(1, 1), c1, true);

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
      ellipse.draw(v_(1, 1), v_(2, 2), c1, true);

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

    test("3x3", () => {
      // given
      const canvas = new TestCanvas(5, 5, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(3, 3), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - -
          - - # - -
          - # # # -
          - - # - -
          - - - - -
        `,
      });
    });

    test("4x3", () => {
      // given
      const canvas = new TestCanvas(6, 5, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(4, 3), c1, true);

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

    test("4x4", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(4, 4), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - # # - -
          - # # # # -
          - # # # # -
          - - # # - -
          - - - - - -
        `,
      });
    });

    test("5x5", () => {
      // given
      const canvas = new TestCanvas(7, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(5, 5), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - -
          - - # # # - -
          - # # # # # -
          - # # # # # -
          - # # # # # -
          - - # # # - -
          - - - - - - -
        `,
      });
    });

    test("6x6", () => {
      // given
      const canvas = new TestCanvas(8, 8, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(6, 6), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - -
          - - - # # - - -
          - - # # # # - -
          - # # # # # # -
          - # # # # # # -
          - - # # # # - -
          - - - # # - - -
          - - - - - - - -
        `,
      });
    });

    test("7x7", () => {
      // given
      const canvas = new TestCanvas(9, 9, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(7, 7), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - -
          - - - # # # - - -
          - - # # # # # - -
          - # # # # # # # -
          - # # # # # # # -
          - # # # # # # # -
          - - # # # # # - -
          - - - # # # - - -
          - - - - - - - - -
        `,
      });
    });

    test("12x5", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(12, 5), c1, true);

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
      ellipse.draw(v_(13, 6), v_(-12, -5), c1, true);

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

    test("tall: 1x13", () => {
      // given
      const canvas = new TestCanvas(3, 15, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(1, 13), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - # -
          - - -
        `,
      });
    });

    test("tall: 2x13", () => {
      // given
      const canvas = new TestCanvas(4, 15, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(2, 13), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - # # -
          - - - -
        `,
      });
    });

    test("tall: 3x13", () => {
      // given
      const canvas = new TestCanvas(5, 15, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(3, 13), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - -
          - - # - -
          - - # - -
          - # # # -
          - # # # -
          - # # # -
          - # # # -
          - # # # -
          - # # # -
          - # # # -
          - # # # -
          - # # # -
          - - # - -
          - - # - -
          - - - - -
        `,
      });
    });

    test("tall: 4x13", () => {
      // given
      const canvas = new TestCanvas(6, 15, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(4, 13), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - # # - -
          - - # # - -
          - - # # - -
          - # # # # -
          - # # # # -
          - # # # # -
          - # # # # -
          - # # # # -
          - # # # # -
          - # # # # -
          - - # # - -
          - - # # - -
          - - # # - -
          - - - - - -
        `,
      });
    });

    test("tall: 5x13", () => {
      // given
      const canvas = new TestCanvas(7, 15, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(1, 1), v_(5, 13), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - -
          - - - # - - -
          - - # # # - -
          - - # # # - -
          - # # # # # -
          - # # # # # -
          - # # # # # -
          - # # # # # -
          - # # # # # -
          - # # # # # -
          - # # # # # -
          - - # # # - -
          - - # # # - -
          - - - # - - -
          - - - - - - -
        `,
      });
    });

    test("clipping: over the left edge", () => {
      // given
      const canvas = new TestCanvas(14, 7, c0);
      const ellipse = new DrawEllipse(canvas.bytes, canvas.size);

      // when
      ellipse.draw(v_(-6, 1), v_(12, 5), c1, true);

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
      ellipse.draw(v_(8, 1), v_(12, 5), c1, true);

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
      ellipse.draw(v_(1, -2), v_(12, 5), c1, true);

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
      ellipse.draw(v_(1, 4), v_(12, 5), c1, true);

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
