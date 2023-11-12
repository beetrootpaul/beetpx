import { describe, test } from "@jest/globals";
import { BpxCompositeColor } from "../color/CompositeColor";
import { BpxRgbColor } from "../color/RgbColor";
import { v_ } from "../misc/Vector2d";
import { DrawRect } from "./DrawRect";
import { BpxFillPattern } from "./FillPattern";
import { TestCanvas } from "./TestCanvas";

describe("DrawRect", () => {
  const ct = null;
  const c0 = BpxRgbColor.fromCssHex("#010203");
  const c1 = BpxRgbColor.fromCssHex("#111213");
  const c2 = BpxRgbColor.fromCssHex("#212223");
  const c3 = BpxRgbColor.fromCssHex("#313233");
  const c4 = BpxRgbColor.fromCssHex("#414243");
  const c5 = BpxRgbColor.fromCssHex("#515253");

  describe("regular", () => {
    test("simple 1x1", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(1, 1), v_(1, 1), c1, false);

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

    test("simple 4x3", () => {
      // given
      const canvas = new TestCanvas(6, 5, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(1, 1), v_(4, 3), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - # # # # -
          - # - - # -
          - # # # # -
          - - - - - -
        `,
      });
    });

    test("drawing on very edges of a canvas", () => {
      // given
      const canvas = new TestCanvas(4, 3, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(0, 0), v_(4, 3), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # #
          # - - #
          # # # #
        `,
      });
    });

    test("0-size", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(1, 1), v_(0, 0), c1, false);

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

    test("negative left-top corner", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(-1, -1), v_(3, 3), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - # -
          # # -
          - - -
        `,
      });
    });

    test("negative size", () => {
      // given
      const canvas = new TestCanvas(6, 5, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(5, 4), v_(-4, -3), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - # # # # -
          - # - - # -
          - # # # # -
          - - - - - -
        `,
      });
    });

    test("clipping: over the left edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(-2, 1), v_(4, 4), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          # # - - - -
          - # - - - -
          - # - - - -
          # # - - - -
          - - - - - -
        `,
      });
    });

    test("clipping: over the right edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(4, 1), v_(4, 4), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - - - # #
          - - - - # -
          - - - - # -
          - - - - # #
          - - - - - -
        `,
      });
    });

    test("clipping: over the top edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(1, -2), v_(4, 4), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - # - - # -
          - # # # # -
          - - - - - -
          - - - - - -
          - - - - - -
          - - - - - -
        `,
      });
    });

    test("clipping: over the bottom edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(1, 4), v_(4, 4), c1, false);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - - - - - -
          - - - - - -
          - - - - - -
          - # # # # -
          - # - - # -
        `,
      });
    });

    test("fill pattern: simple one, with a single color", () => {
      // given
      const canvas = new TestCanvas(4, 4, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(
        v_(0, 0),
        v_(4, 4),
        c1,
        false,
        BpxFillPattern.of(0b0000_0001_0011_0111),
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # #
          # - - -
          # - - -
          # - - -
        `,
      });
    });

    test("fill pattern: simple one, with two colors", () => {
      // given
      const canvas = new TestCanvas(4, 4, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(
        v_(0, 0),
        v_(4, 4),
        new BpxCompositeColor(c1, c2),
        false,
        BpxFillPattern.of(0b0000_0001_0011_0111),
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2 },
        expectedImageAsAscii: `
          # # # #
          # - - :
          # - - :
          # : : :
        `,
      });
    });

    test("fill pattern: various 4x4 patterns", () => {
      // given
      const canvas = new TestCanvas(10, 10, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(
        v_(0, 0),
        v_(10, 10),
        new BpxCompositeColor(c4, c1),
        false,
        BpxFillPattern.primaryOnly,
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          = = = = = = = = = =
          = - - - - - - - - =
          = - - - - - - - - =
          = - - - - - - - - =
          = - - - - - - - - =
          = - - - - - - - - =
          = - - - - - - - - =
          = - - - - - - - - =
          = - - - - - - - - =
          = = = = = = = = = =
        `,
      });

      // and when
      rect.draw(
        v_(2, 2),
        v_(6, 6),
        new BpxCompositeColor(c4, c2),
        false,
        BpxFillPattern.secondaryOnly,
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          = = = = = = = = = =
          = - - - - - - - - =
          = - : : : : : : - =
          = - : - - - - : - =
          = - : - - - - : - =
          = - : - - - - : - =
          = - : - - - - : - =
          = - : : : : : : - =
          = - - - - - - - - =
          = = = = = = = = = =
        `,
      });

      // and when
      rect.draw(
        v_(0, 0),
        v_(10, 10),
        new BpxCompositeColor(c3, ct),
        false,
        BpxFillPattern.of(0b0000_0001_0011_0111),
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          % % % % % % % % % %
          % - - - - - - - - %
          % - : : : : : : - %
          % - : - - - - : - =
          % - : - - - - : - %
          % - : - - - - : - %
          % - : - - - - : - %
          % - : : : : : : - =
          % - - - - - - - - %
          % % % = % % % = % %
        `,
      });

      // and when
      rect.draw(
        v_(0, 0),
        v_(10, 5),
        new BpxCompositeColor(c5, ct),
        false,
        BpxFillPattern.of(0b0011_0011_0011_0011),
      );
      rect.draw(
        v_(0, 5),
        v_(10, 5),
        new BpxCompositeColor(c5, c1),
        false,
        BpxFillPattern.of(0b1100_1100_1100_1100),
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          ^ ^ % % ^ ^ % % ^ ^
          ^ - - - - - - - - ^
          ^ - : : : : : : - ^
          ^ - : - - - - : - ^
          ^ ^ : - ^ ^ - : ^ ^
          # # ^ ^ # # ^ ^ # #
          # - : - - - - : - #
          # - : : : : : : - #
          # - - - - - - - - #
          # # ^ ^ # # ^ ^ # #
        `,
      });
    });

    test("fill pattern: 4x4 pattern is aligned with canvas' top-left corner", () => {
      // given
      const canvas = new TestCanvas(11, 11, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(
        v_(1, 1),
        v_(9, 9),
        new BpxCompositeColor(c1, ct),
        false,
        BpxFillPattern.of(0b0000_0001_0011_0111),
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - -
          - # # - # # # - # # -
          - # - - - - - - - # -
          - - - - - - - - - - -
          - # - - - - - - - # -
          - # - - - - - - - # -
          - # - - - - - - - # -
          - - - - - - - - - - -
          - # - - - - - - - # -
          - # # - # # # - # # -
          - - - - - - - - - - -
        `,
      });
    });
  });

  describe("filled", () => {
    test("simple 1x1", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(1, 1), v_(1, 1), c1, true);

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

    test("simple 4x3", () => {
      // given
      const canvas = new TestCanvas(6, 5, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(1, 1), v_(4, 3), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - # # # # -
          - # # # # -
          - # # # # -
          - - - - - -
        `,
      });
    });

    test("drawing on very edges of a canvas", () => {
      // given
      const canvas = new TestCanvas(4, 3, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(0, 0), v_(4, 3), c1, true);

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

    test("0-size", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(1, 1), v_(0, 0), c1, true);

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

    test("negative left-top corner", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(-1, -1), v_(3, 3), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # -
          # # -
          - - -
        `,
      });
    });

    test("negative size", () => {
      // given
      const canvas = new TestCanvas(6, 5, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(5, 4), v_(-4, -3), c1, true);

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - -
          - # # # # -
          - # # # # -
          - # # # # -
          - - - - - -
        `,
      });
    });

    test("clipping: over the left edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(-2, 1), v_(4, 4), c1, true);

      // then
      canvas.expectToEqual({
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

    test("clipping: over the right edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(4, 1), v_(4, 4), c1, true);

      // then
      canvas.expectToEqual({
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

    test("clipping: over the top edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(1, -2), v_(4, 4), c1, true);

      // then
      canvas.expectToEqual({
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

    test("clipping: over the bottom edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(v_(1, 4), v_(4, 4), c1, true);

      // then
      canvas.expectToEqual({
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

    test("fill pattern: simple one, with a single color", () => {
      // given
      const canvas = new TestCanvas(4, 4, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(
        v_(0, 0),
        v_(4, 4),
        c1,
        true,
        BpxFillPattern.of(0b0000_0001_0011_0111),
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          # # # #
          # # # -
          # # - -
          # - - -
        `,
      });
    });

    test("fill pattern: simple one, with two colors", () => {
      // given
      const canvas = new TestCanvas(4, 4, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(
        v_(0, 0),
        v_(4, 4),
        new BpxCompositeColor(c1, c2),
        true,
        BpxFillPattern.of(0b0000_0001_0011_0111),
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2 },
        expectedImageAsAscii: `
          # # # #
          # # # :
          # # : :
          # : : :
        `,
      });
    });

    test("fill pattern: various 4x4 patterns", () => {
      // given
      const canvas = new TestCanvas(10, 10, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(
        v_(0, 0),
        v_(10, 10),
        new BpxCompositeColor(c4, c1),
        true,
        BpxFillPattern.primaryOnly,
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
          = = = = = = = = = =
        `,
      });

      // and when
      rect.draw(
        v_(2, 2),
        v_(6, 6),
        new BpxCompositeColor(c4, c2),
        true,
        BpxFillPattern.secondaryOnly,
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          = = = = = = = = = =
          = = = = = = = = = =
          = = : : : : : : = =
          = = : : : : : : = =
          = = : : : : : : = =
          = = : : : : : : = =
          = = : : : : : : = =
          = = : : : : : : = =
          = = = = = = = = = =
          = = = = = = = = = =
        `,
      });

      // and when
      rect.draw(
        v_(0, 0),
        v_(10, 10),
        new BpxCompositeColor(c3, ct),
        true,
        BpxFillPattern.of(0b0000_0001_0011_0111),
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          % % % % % % % % % %
          % % % = % % % = % %
          % % : : % % : : % %
          % = : : % : : : % =
          % % % % % % % % % %
          % % % : % % % : % %
          % % : : % % : : % %
          % = : : % : : : % =
          % % % % % % % % % %
          % % % = % % % = % %
        `,
      });

      // and when
      rect.draw(
        v_(0, 0),
        v_(10, 5),
        new BpxCompositeColor(c5, ct),
        true,
        BpxFillPattern.of(0b0011_0011_0011_0011),
      );
      rect.draw(
        v_(0, 5),
        v_(10, 5),
        new BpxCompositeColor(c5, c1),
        true,
        BpxFillPattern.of(0b1100_1100_1100_1100),
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
        expectedImageAsAscii: `
          ^ ^ % % ^ ^ % % ^ ^
          ^ ^ % = ^ ^ % = ^ ^
          ^ ^ : : ^ ^ : : ^ ^
          ^ ^ : : ^ ^ : : ^ ^
          ^ ^ % % ^ ^ % % ^ ^
          # # ^ ^ # # ^ ^ # #
          # # ^ ^ # # ^ ^ # #
          # # ^ ^ # # ^ ^ # #
          # # ^ ^ # # ^ ^ # #
          # # ^ ^ # # ^ ^ # #
        `,
      });
    });

    test("fill pattern: 4x4 pattern is aligned with canvas' top-left corner", () => {
      // given
      const canvas = new TestCanvas(11, 11, c0);
      const rect = new DrawRect(canvas.canvas);

      // when
      rect.draw(
        v_(1, 1),
        v_(9, 9),
        new BpxCompositeColor(c1, ct),
        true,
        BpxFillPattern.of(0b0000_0001_0011_0111),
      );

      // then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
          - - - - - - - - - - -
          - # # - # # # - # # -
          - # - - # # - - # # -
          - - - - # - - - # - -
          - # # # # # # # # # -
          - # # - # # # - # # -
          - # - - # # - - # # -
          - - - - # - - - # - -
          - # # # # # # # # # -
          - # # - # # # - # # -
          - - - - - - - - - - -
        `,
      });
    });
  });
});
