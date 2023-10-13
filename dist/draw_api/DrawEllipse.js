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
import { v2d_, v_ } from "../Vector2d";
import { DrawPixel } from "./DrawPixel";
import { BpxFillPattern } from "./FillPattern";
export class DrawEllipse {
    constructor(canvasBytes, canvasSize) {
        _DrawEllipse_canvasBytes.set(this, void 0);
        _DrawEllipse_canvasSize.set(this, void 0);
        _DrawEllipse_pixel.set(this, void 0);
        __classPrivateFieldSet(this, _DrawEllipse_canvasBytes, canvasBytes, "f");
        __classPrivateFieldSet(this, _DrawEllipse_canvasSize, v_.round(canvasSize), "f");
        __classPrivateFieldSet(this, _DrawEllipse_pixel, new DrawPixel(__classPrivateFieldGet(this, _DrawEllipse_canvasBytes, "f"), __classPrivateFieldGet(this, _DrawEllipse_canvasSize, "f"), {
            disableRounding: true,
        }), "f");
    }
    // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
    // TODO: tests for MappingColor
    // TODO: tests for CompositeColor and fillPattern
    // TODO: cover ClippingRegion with tests
    // Based on http://members.chello.at/easyfilter/bresenham.html
    draw(xy, wh, color, fill, fillPattern = BpxFillPattern.primaryOnly, clippingRegion = null) {
        const [xy1, xy2] = v_.minMax(v_.round(xy), v_.round(v_.add(xy, wh)));
        if (xy2[0] - xy1[0] <= 0 || xy2[1] - xy1[1] <= 0) {
            return;
        }
        //
        // PREPARE
        //
        let a = xy2[0] - xy1[0] - 1;
        let b = xy2[1] - xy1[1] - 1;
        let b1 = b & 1;
        let left = xy1[0];
        let right = xy2[0] - 1;
        let bottom = xy1[1] + Math.floor((b + 1) / 2);
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
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v2d_(right, bottom), color, clippingRegion, fillPattern);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v2d_(left, bottom), color, clippingRegion, fillPattern);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v2d_(left, top), color, clippingRegion, fillPattern);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v2d_(right, top), color, clippingRegion, fillPattern);
            if (fill) {
                // TODO: update the implementation below to honor fill pattern
                v_.forEachIntXyWithinRectOf(v2d_(left + 1, bottom), v2d_(right - left - 1, 1), false, true, (xy) => {
                    __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(xy, color, clippingRegion, fillPattern);
                });
                // TODO: update the implementation below to honor fill pattern
                v_.forEachIntXyWithinRectOf(v2d_(left + 1, top), v2d_(right - left - 1, 1), false, true, (xy) => {
                    __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(xy, color, clippingRegion, fillPattern);
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
        while (bottom - top <= b) {
            // TODO: update the implementation below to honor fill pattern
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v2d_(left - 1, bottom), color, clippingRegion, fillPattern);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v2d_(right + 1, bottom), color, clippingRegion, fillPattern);
            bottom += 1;
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v2d_(left - 1, top), color, clippingRegion, fillPattern);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v2d_(right + 1, top), color, clippingRegion, fillPattern);
            top -= 1;
        }
    }
}
_DrawEllipse_canvasBytes = new WeakMap(), _DrawEllipse_canvasSize = new WeakMap(), _DrawEllipse_pixel = new WeakMap();
