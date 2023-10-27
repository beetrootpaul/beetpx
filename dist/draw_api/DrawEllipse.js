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
var _DrawEllipse_canvasPixels, _DrawEllipse_pixel;
import { BpxVector2d, v_ } from "../Vector2d";
import { DrawPixel } from "./DrawPixel";
import { BpxFillPattern } from "./FillPattern";
export class DrawEllipse {
    constructor(canvasPixels) {
        _DrawEllipse_canvasPixels.set(this, void 0);
        _DrawEllipse_pixel.set(this, void 0);
        __classPrivateFieldSet(this, _DrawEllipse_canvasPixels, canvasPixels, "f");
        __classPrivateFieldSet(this, _DrawEllipse_pixel, new DrawPixel(__classPrivateFieldGet(this, _DrawEllipse_canvasPixels, "f"), {
            disableRounding: true,
            disableVisitedCheck: false,
        }), "f");
    }
    // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
    // TODO: tests for MappingColor
    // TODO: tests for CompositeColor and fillPattern
    // TODO: cover ClippingRegion with tests
    // Based on http://members.chello.at/easyfilter/bresenham.html
    draw(xy, wh, color, fill, fillPattern = BpxFillPattern.primaryOnly, clippingRegion = null) {
        const [xy1, xy2] = BpxVector2d.minMax(xy.round(), xy.add(wh).round());
        if (xy2.x - xy1.x <= 0 || xy2.y - xy1.y <= 0) {
            return;
        }
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
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v_(right, bottom), color, fillPattern, clippingRegion);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v_(left, bottom), color, fillPattern, clippingRegion);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v_(left, top), color, fillPattern, clippingRegion);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v_(right, top), color, fillPattern, clippingRegion);
            if (fill) {
                for (let x = left + 1; x < right; x++) {
                    __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v_(x, top), color, fillPattern, clippingRegion);
                    __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v_(x, bottom), color, fillPattern, clippingRegion);
                }
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
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v_(left - 1, bottom), color, fillPattern, clippingRegion);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v_(right + 1, bottom), color, fillPattern, clippingRegion);
            bottom += 1;
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v_(left - 1, top), color, fillPattern, clippingRegion);
            __classPrivateFieldGet(this, _DrawEllipse_pixel, "f").draw(v_(right + 1, top), color, fillPattern, clippingRegion);
            top -= 1;
        }
    }
}
_DrawEllipse_canvasPixels = new WeakMap(), _DrawEllipse_pixel = new WeakMap();
