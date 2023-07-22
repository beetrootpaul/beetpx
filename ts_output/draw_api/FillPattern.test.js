"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Vector2d_1 = require("../Vector2d");
const FillPattern_1 = require("./FillPattern");
(0, globals_1.describe)("FillPattern", () => {
    (0, globals_1.test)("#hasPrimaryColorAt", () => {
        // given
        const fillPattern = FillPattern_1.FillPattern.of(23635);
        // then for the 1st row of 4 pixels
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(0, 0))).toBe(true);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(1, 0))).toBe(false);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(2, 0))).toBe(true);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(3, 0))).toBe(false);
        // and for the 2nd row of 4 pixels
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(0, 1))).toBe(false);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(1, 1))).toBe(false);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(2, 1))).toBe(true);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(3, 1))).toBe(true);
        // and for the 3rd row of 4 pixels
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(0, 2))).toBe(true);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(1, 2))).toBe(false);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(2, 2))).toBe(true);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(3, 2))).toBe(false);
        // and for the 4th row of 4 pixels
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(0, 3))).toBe(true);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(1, 3))).toBe(true);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(2, 3))).toBe(false);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(3, 3))).toBe(false);
        // and for positions outside the 4x4 grid
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(4, 0))).toBe(true);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(5, 0))).toBe(false);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(0, 4))).toBe(true);
        (0, globals_1.expect)(fillPattern.hasPrimaryColorAt((0, Vector2d_1.v_)(0, 5))).toBe(false);
    });
});
