"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DrawEllipse_canvasBytes, _DrawEllipse_canvasSize, _DrawEllipse_pixel, _DrawEllipse_line;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawEllipse = void 0;
const Vector2d_1 = require("../Vector2d");
const DrawLine_1 = require("./DrawLine");
const DrawPixel_1 = require("./DrawPixel");
const FillPattern_1 = require("./FillPattern");
class DrawEllipse {
    constructor(canvasBytes, canvasSize) {
        _DrawEllipse_canvasBytes.set(this, void 0);
        _DrawEllipse_canvasSize.set(this, void 0);
        _DrawEllipse_pixel.set(this, void 0);
        _DrawEllipse_line.set(this, void 0);
        __classPrivateFieldSet(this, _DrawEllipse_canvasBytes, canvasBytes, "f");
        __classPrivateFieldSet(this, _DrawEllipse_canvasSize, canvasSize, "f");
        __classPrivateFieldSet(this, _DrawEllipse_pixel, new DrawPixel_1.DrawPixel(__classPrivateFieldGet(this, _DrawEllipse_canvasBytes, "f"), __classPrivateFieldGet(this, _DrawEllipse_canvasSize, "f")), "f");
        __classPrivateFieldSet(this, _DrawEllipse_line, new DrawLine_1.DrawLine(__classPrivateFieldGet(this, _DrawEllipse_canvasBytes, "f"), __classPrivateFieldGet(this, _DrawEllipse_canvasSize, "f")), "f");
    }
    // TODO: cover ClippingRegion with tests
    // Based on http://members.chello.at/easyfilter/bresenham.html
    draw(xy, wh, color, fill, 
    // TODO: implement fill pattern for the ellipse
    fillPattern = FillPattern_1.FillPattern.primaryOnly, clippingRegion = null) {
        xy = xy.round();
        wh = wh.round();
        // check if wh has 0 width or height
        if (wh.x * wh.y === 0) {
            return;
        }
        //
        // PREPARE
        //
        let [a, b] = wh.abs().asArray();
        let b1 = b & 1;
        const [xy1, xy2] = Vector2d_1.Vector2d.minMax(xy, xy.add(wh));
        let left = xy1.x;
        let right = xy2.x - 1;
        let bottom = xy1.y - 1 + Math.floor((b + 1) / 2);
        let top = bottom - b1 + 1;
        let errIncrementX = 4 * (1 - a) * b * b;
        let errIncrementY = 4 * (b1 + 1) * a * a;
        let currentErr = errIncrementX + errIncrementY + b1 * a * a;
        a = 8 * a * a;
        b1 = 8 * b * b;
        do {
            //
            // DRAW THE CURRENT PIXEL IN EACH QUADRANT
            //
            // TODO: update the implementation below to honor fill pattern
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Vector2d_1.v_)(right, bottom), color, clippingRegion);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Vector2d_1.v_)(left, bottom), color, clippingRegion);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Vector2d_1.v_)(left, top), color, clippingRegion);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Vector2d_1.v_)(right, top), color, clippingRegion);
            if (fill) {
                // TODO: update the implementation below to honor fill pattern
                Vector2d_1.Vector2d.forEachIntXyWithinRectOf((0, Vector2d_1.v_)(left + 1, bottom), (0, Vector2d_1.v_)(right - left - 1, 1), true, (xy) => {
                    __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(xy, color, clippingRegion);
                });
                // TODO: update the implementation below to honor fill pattern
                Vector2d_1.Vector2d.forEachIntXyWithinRectOf((0, Vector2d_1.v_)(left + 1, top), (0, Vector2d_1.v_)(right - left - 1, 1), true, (xy) => {
                    __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(xy, color, clippingRegion);
                });
            }
            //
            // STEP TO THE NEXT PIXEL
            //
            const currentErrBeforeStep = currentErr;
            if (2 * currentErrBeforeStep <= errIncrementY) {
                bottom += 1;
                top -= 1;
                errIncrementY += a;
                currentErr += errIncrementY;
            }
            if (2 * currentErrBeforeStep >= errIncrementX ||
                2 * currentErr > errIncrementY) {
                left += 1;
                right -= 1;
                errIncrementX += b1;
                currentErr += errIncrementX;
            }
        } while (left <= right);
        //
        // DRAW MISSING TOP & BOTTOM PARTS
        //
        // TODO: Cover this with tests
        while (bottom - top < b) {
            // TODO: update the implementation below to honor fill pattern
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Vector2d_1.v_)(left - 1, bottom), color, clippingRegion);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Vector2d_1.v_)(right + 1, bottom), color, clippingRegion);
            bottom += 1;
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Vector2d_1.v_)(left - 1, top), color, clippingRegion);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw((0, Vector2d_1.v_)(right + 1, top), color, clippingRegion);
            top -= 1;
        }
    }
}
exports.DrawEllipse = DrawEllipse;
_DrawEllipse_canvasBytes = new WeakMap(), _DrawEllipse_canvasSize = new WeakMap(), _DrawEllipse_pixel = new WeakMap(), _DrawEllipse_line = new WeakMap();
