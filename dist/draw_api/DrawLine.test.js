"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Color_1 = require("../Color");
const Vector2d_1 = require("../Vector2d");
const DrawLine_1 = require("./DrawLine");
const TestCanvas_1 = require("./TestCanvas");
(0, globals_1.describe)("DrawLine", () => {
    const ct = Color_1.transparent_;
    const c0 = Color_1.SolidColor.fromRgbCssHex("#010203");
    const c1 = Color_1.SolidColor.fromRgbCssHex("#111213");
    const c2 = Color_1.SolidColor.fromRgbCssHex("#212223");
    const c3 = Color_1.SolidColor.fromRgbCssHex("#313233");
    const c4 = Color_1.SolidColor.fromRgbCssHex("#414243");
    (0, globals_1.test)("1x1", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
        const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
        // when
        const xy1 = (0, Vector2d_1.v_)(1, 1);
        rect.draw(xy1, xy1.add(1), c1);
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
    (0, globals_1.test)("2x2", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(4, 4, c0);
        const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
        // when
        const xy1 = (0, Vector2d_1.v_)(1, 1);
        rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(2, 2)), c1);
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
    (0, globals_1.test)("4x3", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(6, 5, c0);
        const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
        // when
        const xy1 = (0, Vector2d_1.v_)(1, 1);
        rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(4, 3)), c1);
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
    (0, globals_1.test)("13x6", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(15, 8, c0);
        const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
        // when
        const xy1 = (0, Vector2d_1.v_)(1, 1);
        rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(13, 6)), c1);
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
    (0, globals_1.test)("11x2", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(13, 4, c0);
        const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
        // when
        const xy1 = (0, Vector2d_1.v_)(1, 1);
        rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(11, 2)), c1);
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
    (0, globals_1.describe)("an asymmetrical line, in all possible directions", () => {
        (0, globals_1.test)("9x7", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(11, 9, c0);
            const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Vector2d_1.v_)(1, 1);
            rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(9, 7)), c1);
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
        (0, globals_1.test)("9x-7", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(11, 9, c0);
            const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Vector2d_1.v_)(1, 8);
            rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(9, -7)), c1);
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
        (0, globals_1.test)("-9x7", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(11, 9, c0);
            const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Vector2d_1.v_)(10, 1);
            rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(-9, 7)), c1);
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
        (0, globals_1.test)("-9x-7", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(11, 9, c0);
            const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Vector2d_1.v_)(10, 8);
            rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(-9, -7)), c1);
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
        (0, globals_1.test)("7x9", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(9, 11, c0);
            const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Vector2d_1.v_)(1, 1);
            rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(7, 9)), c1);
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
        (0, globals_1.test)("7x-9", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(9, 11, c0);
            const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Vector2d_1.v_)(1, 10);
            rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(7, -9)), c1);
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
        (0, globals_1.test)("-7x9", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(9, 11, c0);
            const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Vector2d_1.v_)(8, 1);
            rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(-7, 9)), c1);
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
        (0, globals_1.test)("-7x-9", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(9, 11, c0);
            const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Vector2d_1.v_)(8, 10);
            rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(-7, -9)), c1);
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
    (0, globals_1.test)("drawing on very edges of a canvas", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(5, 5, c0);
        const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
        // when
        rect.draw((0, Vector2d_1.v_)(1, 0), (0, Vector2d_1.v_)(4, 1), c1);
        rect.draw((0, Vector2d_1.v_)(1, 4), (0, Vector2d_1.v_)(4, 5), c2);
        rect.draw((0, Vector2d_1.v_)(0, 1), (0, Vector2d_1.v_)(1, 4), c3);
        rect.draw((0, Vector2d_1.v_)(4, 1), (0, Vector2d_1.v_)(5, 4), c4);
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
    (0, globals_1.test)("0-size", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
        const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
        // when
        const xy1 = (0, Vector2d_1.v_)(1, 1);
        rect.draw(xy1, xy1, c1);
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
    (0, globals_1.test)("clipping: over the left edge", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
        const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
        // when
        const xy1 = (0, Vector2d_1.v_)(-2, 1);
        rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(4, 1)), c1);
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
    (0, globals_1.test)("clipping: over the right edge", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
        const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
        // when
        const xy1 = (0, Vector2d_1.v_)(1, 1);
        rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(4, 1)), c1);
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
    (0, globals_1.test)("clipping: over the top edge", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
        const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
        // when
        const xy1 = (0, Vector2d_1.v_)(1, -2);
        rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(1, 4)), c1);
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
    (0, globals_1.test)("clipping: over the bottom edge", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
        const rect = new DrawLine_1.DrawLine(canvas.bytes, canvas.size);
        // when
        const xy1 = (0, Vector2d_1.v_)(1, 1);
        rect.draw(xy1, xy1.add((0, Vector2d_1.v_)(1, 4)), c1);
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
