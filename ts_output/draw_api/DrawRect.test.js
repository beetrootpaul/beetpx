"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Color_1 = require("../Color");
const Xy_1 = require("../Xy");
const DrawRect_1 = require("./DrawRect");
const FillPattern_1 = require("./FillPattern");
const TestCanvas_1 = require("./TestCanvas");
(0, globals_1.describe)("DrawRect", () => {
    const ct = Color_1.transparent;
    const c0 = Color_1.SolidColor.fromRgbCssHex("#010203");
    const c1 = Color_1.SolidColor.fromRgbCssHex("#111213");
    const c2 = Color_1.SolidColor.fromRgbCssHex("#212223");
    const c3 = Color_1.SolidColor.fromRgbCssHex("#313233");
    const c4 = Color_1.SolidColor.fromRgbCssHex("#414243");
    const c5 = Color_1.SolidColor.fromRgbCssHex("#515253");
    (0, globals_1.describe)("regular", () => {
        (0, globals_1.test)("simple 1x1", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
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
        (0, globals_1.test)("simple 4x3", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 5, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 3)), c1, false);
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
        (0, globals_1.test)("drawing on very edges of a canvas", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(4, 3, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(0, 0);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 3)), c1, false);
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
        (0, globals_1.test)("0-size", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
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
        (0, globals_1.test)("negative left-top corner", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(-1, -1);
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
        (0, globals_1.test)("negative size", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 5, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(5, 4);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(-4, -3)), c1, false);
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
        (0, globals_1.test)("clipping: over the left edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 6, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(-2, 1);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 4)), c1, false);
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
        (0, globals_1.test)("clipping: over the right edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 6, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(4, 1);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 4)), c1, false);
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
        (0, globals_1.test)("clipping: over the top edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 6, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, -2);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 4)), c1, false);
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
        (0, globals_1.test)("clipping: over the bottom edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 6, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 4);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 4)), c1, false);
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
        (0, globals_1.test)("fill pattern: simple one, with a single solid color", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(4, 4, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            rect.draw((0, Xy_1.xy_)(0, 0), (0, Xy_1.xy_)(4, 4), c1, false, FillPattern_1.FillPattern.of(311));
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
        (0, globals_1.test)("fill pattern: simple one, with two solid colors", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(4, 4, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            rect.draw((0, Xy_1.xy_)(0, 0), (0, Xy_1.xy_)(4, 4), new Color_1.CompositeColor(c1, c2), false, FillPattern_1.FillPattern.of(311));
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
        (0, globals_1.test)("fill pattern: various 4x4 patterns", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(10, 10, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            rect.draw((0, Xy_1.xy_)(0, 0), (0, Xy_1.xy_)(10, 10), new Color_1.CompositeColor(c4, c1), false, FillPattern_1.FillPattern.primaryOnly);
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
            rect.draw((0, Xy_1.xy_)(2, 2), (0, Xy_1.xy_)(8, 8), new Color_1.CompositeColor(c4, c2), false, FillPattern_1.FillPattern.secondaryOnly);
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
            rect.draw((0, Xy_1.xy_)(0, 0), (0, Xy_1.xy_)(10, 10), new Color_1.CompositeColor(c3, ct), false, FillPattern_1.FillPattern.of(311));
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
            rect.draw((0, Xy_1.xy_)(0, 0), (0, Xy_1.xy_)(10, 5), new Color_1.CompositeColor(c5, ct), false, FillPattern_1.FillPattern.of(13107));
            rect.draw((0, Xy_1.xy_)(0, 5), (0, Xy_1.xy_)(10, 10), new Color_1.CompositeColor(c5, c1), false, FillPattern_1.FillPattern.of(52428));
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
        (0, globals_1.test)("fill pattern: 4x4 pattern is aligned with canvas' top-left corner", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(11, 11, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            rect.draw((0, Xy_1.xy_)(1, 1), (0, Xy_1.xy_)(10, 10), new Color_1.CompositeColor(c1, ct), false, FillPattern_1.FillPattern.of(311));
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
    (0, globals_1.describe)("filled", () => {
        (0, globals_1.test)("simple 1x1", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
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
        (0, globals_1.test)("simple 4x3", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 5, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 3)), c1, true);
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
        (0, globals_1.test)("drawing on very edges of a canvas", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(4, 3, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(0, 0);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 3)), c1, true);
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
        (0, globals_1.test)("0-size", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
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
        (0, globals_1.test)("negative left-top corner", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(-1, -1);
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
        (0, globals_1.test)("negative size", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 5, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(5, 4);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(-4, -3)), c1, true);
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
        (0, globals_1.test)("clipping: over the left edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 6, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(-2, 1);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 4)), c1, true);
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
        (0, globals_1.test)("clipping: over the right edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 6, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(4, 1);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 4)), c1, true);
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
        (0, globals_1.test)("clipping: over the top edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 6, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, -2);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 4)), c1, true);
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
        (0, globals_1.test)("clipping: over the bottom edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 6, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 4);
            rect.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 4)), c1, true);
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
        (0, globals_1.test)("fill pattern: simple one, with a single solid color", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(4, 4, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            rect.draw((0, Xy_1.xy_)(0, 0), (0, Xy_1.xy_)(4, 4), c1, true, FillPattern_1.FillPattern.of(311));
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
        (0, globals_1.test)("fill pattern: simple one, with two solid colors", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(4, 4, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            rect.draw((0, Xy_1.xy_)(0, 0), (0, Xy_1.xy_)(4, 4), new Color_1.CompositeColor(c1, c2), true, FillPattern_1.FillPattern.of(311));
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
        (0, globals_1.test)("fill pattern: various 4x4 patterns", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(10, 10, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            rect.draw((0, Xy_1.xy_)(0, 0), (0, Xy_1.xy_)(10, 10), new Color_1.CompositeColor(c4, c1), true, FillPattern_1.FillPattern.primaryOnly);
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
            rect.draw((0, Xy_1.xy_)(2, 2), (0, Xy_1.xy_)(8, 8), new Color_1.CompositeColor(c4, c2), true, FillPattern_1.FillPattern.secondaryOnly);
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
            rect.draw((0, Xy_1.xy_)(0, 0), (0, Xy_1.xy_)(10, 10), new Color_1.CompositeColor(c3, ct), true, FillPattern_1.FillPattern.of(311));
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
            rect.draw((0, Xy_1.xy_)(0, 0), (0, Xy_1.xy_)(10, 5), new Color_1.CompositeColor(c5, ct), true, FillPattern_1.FillPattern.of(13107));
            rect.draw((0, Xy_1.xy_)(0, 5), (0, Xy_1.xy_)(10, 10), new Color_1.CompositeColor(c5, c1), true, FillPattern_1.FillPattern.of(52428));
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
        (0, globals_1.test)("fill pattern: 4x4 pattern is aligned with canvas' top-left corner", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(11, 11, c0);
            const rect = new DrawRect_1.DrawRect(canvas.bytes, canvas.size);
            // when
            rect.draw((0, Xy_1.xy_)(1, 1), (0, Xy_1.xy_)(10, 10), new Color_1.CompositeColor(c1, ct), true, FillPattern_1.FillPattern.of(311));
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
