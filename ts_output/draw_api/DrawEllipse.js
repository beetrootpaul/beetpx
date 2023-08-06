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
var _DrawEllipse_canvasBytes, _DrawEllipse_canvasSize, _DrawEllipse_pixel;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawEllipse = void 0;
const Vector2d_1 = require("../Vector2d");
const DrawPixel_1 = require("./DrawPixel");
const FillPattern_1 = require("./FillPattern");
class DrawEllipse {
    constructor(canvasBytes, canvasSize) {
        _DrawEllipse_canvasBytes.set(this, void 0);
        _DrawEllipse_canvasSize.set(this, void 0);
        _DrawEllipse_pixel.set(this, void 0);
        __classPrivateFieldSet(this, _DrawEllipse_canvasBytes, canvasBytes, "f");
        __classPrivateFieldSet(this, _DrawEllipse_canvasSize, canvasSize, "f");
        __classPrivateFieldSet(this, _DrawEllipse_pixel, new DrawPixel_1.DrawPixel(__classPrivateFieldGet(this, _DrawEllipse_canvasBytes, "f"), __classPrivateFieldGet(this, _DrawEllipse_canvasSize, "f")), "f");
    }
    // TODO: cover ClippingRegion with tests
    // Based on http://members.chello.at/easyfilter/bresenham.html
    draw(xy1, xy2, color, fill, 
    // TODO: implement fill pattern for the ellipse
    fillPattern = FillPattern_1.FillPattern.primaryOnly, clippingRegion = null) {
        if (Math.abs(xy2.x - xy1.x) <= 0 || Math.abs(xy2.y - xy1.y) <= 0) {
            return;
        }
        // swap coordinates to make sure xy1 is the left-bottom corner and xy2 is the right-top one
        [xy1, xy2] = [
            (0, Vector2d_1.v_)(Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y)),
            (0, Vector2d_1.v_)(Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y)),
        ];
        //
        // PREPARE
        //
        let a = xy2.x - xy1.x - 1;
        let b = xy2.y - xy1.y - 1;
        let b1 = b & 1;
        let left = xy1.x;
        let right = xy2.x - 1;
        let bottom = xy1.y + Math.floor((b + 1) / 2);
        let top = bottom - b1;
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
                Vector2d_1.Vector2d.forEachIntXyWithinRectOf((0, Vector2d_1.v_)(left + 1, bottom), (0, Vector2d_1.v_)(right - 1, bottom).add(1), true, (xy) => {
                    __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(xy, color, clippingRegion);
                });
                // TODO: update the implementation below to honor fill pattern
                Vector2d_1.Vector2d.forEachIntXyWithinRectOf((0, Vector2d_1.v_)(left + 1, top), (0, Vector2d_1.v_)(right - 1, top).add(1), true, (xy) => {
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
_DrawEllipse_canvasBytes = new WeakMap(), _DrawEllipse_canvasSize = new WeakMap(), _DrawEllipse_pixel = new WeakMap();
