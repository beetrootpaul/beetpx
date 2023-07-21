import { describe, test } from "@jest/globals";
import { CompositeColor, SolidColor, transparent } from "../Color";
import { xy_ } from "../Xy";
import { DrawRect } from "./DrawRect";
import { FillPattern } from "./FillPattern";
import { TestCanvas } from "./TestCanvas";

describe("DrawRect", () => {
  const ct = transparent;
  const c0 = SolidColor.fromRgbCssHex("#010203");
  const c1 = SolidColor.fromRgbCssHex("#111213");
  const c2 = SolidColor.fromRgbCssHex("#212223");
  const c3 = SolidColor.fromRgbCssHex("#313233");
  const c4 = SolidColor.fromRgbCssHex("#414243");
  const c5 = SolidColor.fromRgbCssHex("#515253");

  describe("regular", () => {
    test("simple 1x1", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 1);
      rect.draw(xy1, xy1.add(1), c1, false);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 1);
      rect.draw(xy1, xy1.add(xy_(4, 3)), c1, false);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(0, 0);
      rect.draw(xy1, xy1.add(xy_(4, 3)), c1, false);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 1);
      rect.draw(xy1, xy1, c1, false);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(-1, -1);
      rect.draw(xy1, xy1.add(3), c1, false);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(5, 4);
      rect.draw(xy1, xy1.add(xy_(-4, -3)), c1, false);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(-2, 1);
      rect.draw(xy1, xy1.add(xy_(4, 4)), c1, false);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(4, 1);
      rect.draw(xy1, xy1.add(xy_(4, 4)), c1, false);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, -2);
      rect.draw(xy1, xy1.add(xy_(4, 4)), c1, false);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 4);
      rect.draw(xy1, xy1.add(xy_(4, 4)), c1, false);

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

    test("fill pattern: simple one, with a single solid color", () => {
      // given
      const canvas = new TestCanvas(4, 4, c0);
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      rect.draw(
        xy_(0, 0),
        xy_(4, 4),
        c1,
        false,
        FillPattern.of(0b0000_0001_0011_0111),
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

    test("fill pattern: simple one, with two solid colors", () => {
      // given
      const canvas = new TestCanvas(4, 4, c0);
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      rect.draw(
        xy_(0, 0),
        xy_(4, 4),
        new CompositeColor(c1, c2),
        false,
        FillPattern.of(0b0000_0001_0011_0111),
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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      rect.draw(
        xy_(0, 0),
        xy_(10, 10),
        new CompositeColor(c4, c1),
        false,
        FillPattern.primaryOnly,
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
        xy_(2, 2),
        xy_(8, 8),
        new CompositeColor(c4, c2),
        false,
        FillPattern.secondaryOnly,
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
        xy_(0, 0),
        xy_(10, 10),
        new CompositeColor(c3, ct),
        false,
        FillPattern.of(0b0000_0001_0011_0111),
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
        xy_(0, 0),
        xy_(10, 5),
        new CompositeColor(c5, ct),
        false,
        FillPattern.of(0b0011_0011_0011_0011),
      );
      rect.draw(
        xy_(0, 5),
        xy_(10, 10),
        new CompositeColor(c5, c1),
        false,
        FillPattern.of(0b1100_1100_1100_1100),
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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      rect.draw(
        xy_(1, 1),
        xy_(10, 10),
        new CompositeColor(c1, ct),
        false,
        FillPattern.of(0b0000_0001_0011_0111),
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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 1);
      rect.draw(xy1, xy1.add(1), c1, true);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 1);
      rect.draw(xy1, xy1.add(xy_(4, 3)), c1, true);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(0, 0);
      rect.draw(xy1, xy1.add(xy_(4, 3)), c1, true);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 1);
      rect.draw(xy1, xy1, c1, true);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(-1, -1);
      rect.draw(xy1, xy1.add(3), c1, true);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(5, 4);
      rect.draw(xy1, xy1.add(xy_(-4, -3)), c1, true);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(-2, 1);
      rect.draw(xy1, xy1.add(xy_(4, 4)), c1, true);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(4, 1);
      rect.draw(xy1, xy1.add(xy_(4, 4)), c1, true);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, -2);
      rect.draw(xy1, xy1.add(xy_(4, 4)), c1, true);

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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 4);
      rect.draw(xy1, xy1.add(xy_(4, 4)), c1, true);

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

    test("fill pattern: simple one, with a single solid color", () => {
      // given
      const canvas = new TestCanvas(4, 4, c0);
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      rect.draw(
        xy_(0, 0),
        xy_(4, 4),
        c1,
        true,
        FillPattern.of(0b0000_0001_0011_0111),
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

    test("fill pattern: simple one, with two solid colors", () => {
      // given
      const canvas = new TestCanvas(4, 4, c0);
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      rect.draw(
        xy_(0, 0),
        xy_(4, 4),
        new CompositeColor(c1, c2),
        true,
        FillPattern.of(0b0000_0001_0011_0111),
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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      rect.draw(
        xy_(0, 0),
        xy_(10, 10),
        new CompositeColor(c4, c1),
        true,
        FillPattern.primaryOnly,
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
        xy_(2, 2),
        xy_(8, 8),
        new CompositeColor(c4, c2),
        true,
        FillPattern.secondaryOnly,
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
        xy_(0, 0),
        xy_(10, 10),
        new CompositeColor(c3, ct),
        true,
        FillPattern.of(0b0000_0001_0011_0111),
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
        xy_(0, 0),
        xy_(10, 5),
        new CompositeColor(c5, ct),
        true,
        FillPattern.of(0b0011_0011_0011_0011),
      );
      rect.draw(
        xy_(0, 5),
        xy_(10, 10),
        new CompositeColor(c5, c1),
        true,
        FillPattern.of(0b1100_1100_1100_1100),
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
      const rect = new DrawRect(canvas.bytes, canvas.size);

      // when
      rect.draw(
        xy_(1, 1),
        xy_(10, 10),
        new CompositeColor(c1, ct),
        true,
        FillPattern.of(0b0000_0001_0011_0111),
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
