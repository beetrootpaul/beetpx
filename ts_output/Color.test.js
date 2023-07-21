"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Color_1 = require("./Color");
(0, globals_1.describe)("SolidColor", () => {
    (0, globals_1.describe)("constructor", () => {
        (0, globals_1.test)("successful construction", () => {
            const color = new Color_1.SolidColor(1, 2, 3);
            (0, globals_1.expect)(color.r).toEqual(1);
            (0, globals_1.expect)(color.g).toEqual(2);
            (0, globals_1.expect)(color.b).toEqual(3);
        });
        (0, globals_1.test)("validation", () => {
            (0, globals_1.expect)(() => new Color_1.SolidColor(0, -1, 0)).toThrow("One of color components is outside 0-255 range");
            (0, globals_1.expect)(() => new Color_1.SolidColor(0, 256, 0)).toThrow("One of color components is outside 0-255 range");
        });
    });
    (0, globals_1.describe)("#fromRgbCssHex", () => {
        (0, globals_1.test)("successful conversions", () => {
            (0, globals_1.expect)(Color_1.SolidColor.fromRgbCssHex("#000000")).toEqual(new Color_1.SolidColor(0, 0, 0));
            (0, globals_1.expect)(Color_1.SolidColor.fromRgbCssHex("#010203")).toEqual(new Color_1.SolidColor(1, 2, 3));
            (0, globals_1.expect)(Color_1.SolidColor.fromRgbCssHex("#f1f2f3")).toEqual(new Color_1.SolidColor(241, 242, 243));
            (0, globals_1.expect)(Color_1.SolidColor.fromRgbCssHex("#ffffff")).toEqual(new Color_1.SolidColor(255, 255, 255));
        });
        (0, globals_1.test)("normalization", () => {
            (0, globals_1.expect)(Color_1.SolidColor.fromRgbCssHex("#ABCDEF").asRgbCssHex()).toEqual("#abcdef");
        });
        (0, globals_1.test)("validation", () => {
            (0, globals_1.expect)(() => Color_1.SolidColor.fromRgbCssHex("#1234567")).toThrow("Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'");
            (0, globals_1.expect)(() => Color_1.SolidColor.fromRgbCssHex("#12345")).toThrow("Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'");
            (0, globals_1.expect)(() => Color_1.SolidColor.fromRgbCssHex("#00000g")).toThrow("Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'");
            (0, globals_1.expect)(() => Color_1.SolidColor.fromRgbCssHex("#00#0000")).toThrow("Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'");
            (0, globals_1.expect)(() => Color_1.SolidColor.fromRgbCssHex("# 000000")).toThrow("Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'");
        });
    });
    (0, globals_1.describe)("#asRgbCssHex", () => {
        (0, globals_1.test)("successful conversions", () => {
            (0, globals_1.expect)(new Color_1.SolidColor(0, 0, 0).asRgbCssHex()).toEqual("#000000");
            (0, globals_1.expect)(new Color_1.SolidColor(1, 2, 3).asRgbCssHex()).toEqual("#010203");
            (0, globals_1.expect)(new Color_1.SolidColor(241, 242, 243).asRgbCssHex()).toEqual("#f1f2f3");
            (0, globals_1.expect)(new Color_1.SolidColor(255, 255, 255).asRgbCssHex()).toEqual("#ffffff");
        });
    });
});
