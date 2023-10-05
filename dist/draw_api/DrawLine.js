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
var _DrawLine_canvasBytes, _DrawLine_canvasSize, _DrawLine_pixel;
import { v_ } from "../Vector2d";
import { DrawPixel } from "./DrawPixel";
import { BpxFillPattern } from "./FillPattern";
export class DrawLine {
    constructor(canvasBytes, canvasSize) {
        _DrawLine_canvasBytes.set(this, void 0);
        _DrawLine_canvasSize.set(this, void 0);
        _DrawLine_pixel.set(this, void 0);
        __classPrivateFieldSet(this, _DrawLine_canvasBytes, canvasBytes, "f");
        __classPrivateFieldSet(this, _DrawLine_canvasSize, canvasSize.round(), "f");
        __classPrivateFieldSet(this, _DrawLine_pixel, new DrawPixel(__classPrivateFieldGet(this, _DrawLine_canvasBytes, "f"), __classPrivateFieldGet(this, _DrawLine_canvasSize, "f"), {
            disableRounding: true,
        }), "f");
    }
    // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
    // TODO: tests for MappingColor
    // TODO: tests for CompositeColor and fillPattern
    // TODO: cover ClippingRegion with tests
    // TODO: replace iterated new instances of Vector2d for XY with regular primitive numbers for X and Y
    // Based on http://members.chello.at/easyfilter/bresenham.html
    draw(xy, wh, color, fillPattern = BpxFillPattern.primaryOnly, clippingRegion = null) {
        // When drawing a line, the order of drawing does matter. This is why we
        //   do not speak about xy1 (left-top) and xy2 (right-bottom) as in other
        //   shapes, but about xyStart and xyEnd.
        const xyStart = xy.round();
        const xyEnd = xy.add(wh).round();
        if (xyEnd.x - xyStart.x === 0 || xyEnd.y - xyStart.y === 0) {
            return;
        }
        // We cannot just round wh, because we don't want to lose the precision of xy+wh.
        //   But what we can do (and we do here) is to round xyStart and xyEnd calculated
        //   with xy+wh, and the obtain a new wh as xyEnd-xyStart, which makes it rounded.
        wh = xyEnd.sub(xyStart);
        const whSub1 = wh.sub(wh.sign());
        //
        // PREPARE
        //
        let dXy = whSub1.abs().mul(v_(1, -1));
        let currentXy = xyStart;
        const targetXy = xyStart.add(whSub1);
        const step = whSub1.sign();
        let err = dXy.x + dXy.y;
        while (true) {
            //
            // DRAW THE CURRENT PIXEL
            //
            __classPrivateFieldGet(this, _DrawLine_pixel, "f").draw(currentXy, color, clippingRegion, fillPattern);
            if (currentXy.eq(targetXy))
                break;
            //
            // STEP TO THE NEXT PIXEL
            //
            const errBeforeStep = err;
            if (2 * errBeforeStep >= dXy.y) {
                currentXy = currentXy.add(v_(step.x, 0));
                err += dXy.y;
            }
            if (2 * errBeforeStep <= dXy.x) {
                currentXy = currentXy.add(v_(0, step.y));
                err += dXy.x;
            }
        }
    }
}
_DrawLine_canvasBytes = new WeakMap(), _DrawLine_canvasSize = new WeakMap(), _DrawLine_pixel = new WeakMap();
