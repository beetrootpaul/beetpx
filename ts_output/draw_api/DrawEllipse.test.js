"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Color_1 = require("../Color");
const Xy_1 = require("../Xy");
const DrawEllipse_1 = require("./DrawEllipse");
const TestCanvas_1 = require("./TestCanvas");
// TODO: tests for fill pattern
(0, globals_1.describe)("DrawEllipse", () => {
    const c0 = Color_1.SolidColor.fromRgbCssHex("#010203");
    const c1 = Color_1.SolidColor.fromRgbCssHex("#111213");
    (0, globals_1.describe)("regular", () => {
        (0, globals_1.test)("0-size", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
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
        (0, globals_1.test)("1x1", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
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
        (0, globals_1.test)("2x2", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(4, 4, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
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
        (0, globals_1.test)("4x3", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 5, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 3)), c1, false);
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
        (0, globals_1.test)("12x5", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(14, 7, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(12, 5)), c1, false);
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
        (0, globals_1.test)("negative 12x5", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(14, 7, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(13, 6);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(-12, -5)), c1, false);
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
        (0, globals_1.test)("clipping: over the left edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(14, 7, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(-6, 1);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(12, 5)), c1, false);
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
        (0, globals_1.test)("clipping: over the right edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(14, 7, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(8, 1);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(12, 5)), c1, false);
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
        (0, globals_1.test)("clipping: over the top edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(14, 7, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, -2);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(12, 5)), c1, false);
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
        (0, globals_1.test)("clipping: over the bottom edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(14, 7, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 4);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(12, 5)), c1, false);
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
    (0, globals_1.describe)("filled", () => {
        (0, globals_1.test)("0-size", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
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
        (0, globals_1.test)("1x1", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
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
        (0, globals_1.test)("2x2", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(4, 4, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
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
        (0, globals_1.test)("4x3", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(6, 5, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(4, 3)), c1, true);
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
        (0, globals_1.test)("12x5", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(14, 7, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 1);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(12, 5)), c1, true);
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
        (0, globals_1.test)("negative 12x5", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(14, 7, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(13, 6);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(-12, -5)), c1, true);
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
        (0, globals_1.test)("clipping: over the left edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(14, 7, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(-6, 1);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(12, 5)), c1, true);
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
        (0, globals_1.test)("clipping: over the right edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(14, 7, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(8, 1);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(12, 5)), c1, true);
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
        (0, globals_1.test)("clipping: over the top edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(14, 7, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, -2);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(12, 5)), c1, true);
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
        (0, globals_1.test)("clipping: over the bottom edge", () => {
            // given
            const canvas = new TestCanvas_1.TestCanvas(14, 7, c0);
            const ellipse = new DrawEllipse_1.DrawEllipse(canvas.bytes, canvas.size);
            // when
            const xy1 = (0, Xy_1.xy_)(1, 4);
            ellipse.draw(xy1, xy1.add((0, Xy_1.xy_)(12, 5)), c1, true);
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
