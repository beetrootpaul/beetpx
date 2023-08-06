"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Vector2d_1 = require("../Vector2d");
const ClippingRegion_1 = require("./ClippingRegion");
(0, globals_1.describe)("ClippingRegion", () => {
    (0, globals_1.describe)("#allowsDrawingAt", () => {
        (0, globals_1.test)("a regular region", () => {
            // given
            const clippingRegion = ClippingRegion_1.ClippingRegion.of((0, Vector2d_1.v_)(-100, -200), (0, Vector2d_1.v_)(300, 400));
            // top-left corner
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-100, -200))).toBe(true);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-100, -201))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-101, -200))).toBe(false);
            // top-right corner
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(299, -200))).toBe(true);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(299, -201))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(300, -200))).toBe(false);
            // bottom-left corner
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-100, 399))).toBe(true);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-100, 400))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-101, 399))).toBe(false);
            // bottom-right corner
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(299, 399))).toBe(true);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(299, 400))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(300, 399))).toBe(false);
        });
        (0, globals_1.test)("a negative size region", () => {
            // given
            const clippingRegion = ClippingRegion_1.ClippingRegion.of((0, Vector2d_1.v_)(300, 400), (0, Vector2d_1.v_)(-100, -200));
            // top-left corner
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-100, -200))).toBe(true);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-100, -201))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-101, -200))).toBe(false);
            // top-right corner
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(299, -200))).toBe(true);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(299, -201))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(300, -200))).toBe(false);
            // bottom-left corner
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-100, 399))).toBe(true);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-100, 400))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-101, 399))).toBe(false);
            // bottom-right corner
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(299, 399))).toBe(true);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(299, 400))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(300, 399))).toBe(false);
        });
        (0, globals_1.test)("1x1", () => {
            // given
            const clippingRegion = ClippingRegion_1.ClippingRegion.of((0, Vector2d_1.v_)(0, 0), (0, Vector2d_1.v_)(1, 1));
            // center
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(0, 0))).toBe(true);
            // around
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-1, 0))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-1, -1))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(0, -1))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(1, -1))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(1, 0))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(1, 1))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(0, 1))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-1, 1))).toBe(false);
        });
        (0, globals_1.test)("0x0", () => {
            // given
            const clippingRegion = ClippingRegion_1.ClippingRegion.of((0, Vector2d_1.v_)(0, 0), (0, Vector2d_1.v_)(0, 0));
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-1, -1))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(0, -1))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(1, -1))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-1, 0))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(0, 0))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(1, 0))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(-1, 1))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(0, 1))).toBe(false);
            (0, globals_1.expect)(clippingRegion.allowsDrawingAt((0, Vector2d_1.v_)(1, 1))).toBe(false);
        });
    });
});
