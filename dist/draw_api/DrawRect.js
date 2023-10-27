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
var _DrawRect_canvasPixels, _DrawRect_pixel;
import { BpxVector2d, v_ } from "../Vector2d";
import { DrawPixel } from "./DrawPixel";
import { BpxFillPattern } from "./FillPattern";
export class DrawRect {
    constructor(canvasPixels) {
        _DrawRect_canvasPixels.set(this, void 0);
        _DrawRect_pixel.set(this, void 0);
        __classPrivateFieldSet(this, _DrawRect_canvasPixels, canvasPixels, "f");
        __classPrivateFieldSet(this, _DrawRect_pixel, new DrawPixel(__classPrivateFieldGet(this, _DrawRect_canvasPixels, "f"), {
            disableRounding: true,
        }), "f");
    }
    // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
    // TODO: tests for MappingColor
    // TODO: tests for CompositeColor and fillPattern
    // TODO: cover ClippingRegion with tests
    draw(xy, wh, color, fill, fillPattern = BpxFillPattern.primaryOnly, clippingRegion = null) {
        const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(xy.round(), xy.add(wh).round());
        for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
            if (fill || y === xyMinInclusive.y || y === xyMaxExclusive.y - 1) {
                for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
                    __classPrivateFieldGet(this, _DrawRect_pixel, "f").draw(v_(x, y), color, fillPattern, clippingRegion);
                }
            }
            else {
                __classPrivateFieldGet(this, _DrawRect_pixel, "f").draw(v_(xyMinInclusive.x, y), color, fillPattern, clippingRegion);
                __classPrivateFieldGet(this, _DrawRect_pixel, "f").draw(v_(xyMaxExclusive.x - 1, y), color, fillPattern, clippingRegion);
            }
        }
    }
}
_DrawRect_canvasPixels = new WeakMap(), _DrawRect_pixel = new WeakMap();
