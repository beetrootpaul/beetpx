"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Color_1 = require("../Color");
const DrawClear_1 = require("./DrawClear");
const TestCanvas_1 = require("./TestCanvas");
(0, globals_1.describe)("DrawClear", () => {
    const c0 = Color_1.SolidColor.fromRgbCssHex("#010203");
    const c1 = Color_1.SolidColor.fromRgbCssHex("#111213");
    (0, globals_1.test)("clear the whole canvas with a given color", () => {
        // given
        const canvas = new TestCanvas_1.TestCanvas(4, 3, c0);
        const clear = new DrawClear_1.DrawClear(canvas.bytes, canvas.size);
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
