"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Color_1 = require("../Color");
const Xy_1 = require("../Xy");
const DrawPixel_1 = require("./DrawPixel");
const TestCanvas_1 = require("./TestCanvas");
(0, globals_1.describe)("DrawPixel", () => {
    const c0 = Color_1.SolidColor.fromRgbCssHex("#010203");
    const c1 = Color_1.SolidColor.fromRgbCssHex("#111213");
    const c2 = Color_1.SolidColor.fromRgbCssHex("#212223");
    const c3 = Color_1.SolidColor.fromRgbCssHex("#313233");
    const c4 = Color_1.SolidColor.fromRgbCssHex("#414243");
    (0, globals_1.test)("a single pixel", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
        const pixel = new DrawPixel_1.DrawPixel(canvas.bytes, canvas.size);
        // when
        const xy1 = (0, Xy_1.xy_)(1, 1);
        pixel.draw((0, Xy_1.xy_)(1, 1), c1);
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
    (0, globals_1.test)("canvas' corners", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
        const pixel = new DrawPixel_1.DrawPixel(canvas.bytes, canvas.size);
        // when
        pixel.draw((0, Xy_1.xy_)(0, 0), c1);
        pixel.draw((0, Xy_1.xy_)(2, 0), c2);
        pixel.draw((0, Xy_1.xy_)(0, 2), c3);
        pixel.draw((0, Xy_1.xy_)(2, 2), c4);
        // then
        canvas.expectToEqual({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            expectedImageAsAscii: `
        # - :
        - - -
        % - =
      `,
        });
    });
    (0, globals_1.test)("outside canvas", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(3, 3, c0);
        const pixel = new DrawPixel_1.DrawPixel(canvas.bytes, canvas.size);
        // when
        pixel.draw((0, Xy_1.xy_)(-1, 1), c1);
        pixel.draw((0, Xy_1.xy_)(3, 1), c1);
        pixel.draw((0, Xy_1.xy_)(1, -1), c1);
        pixel.draw((0, Xy_1.xy_)(1, 3), c1);
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
});
