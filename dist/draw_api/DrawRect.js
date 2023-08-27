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
var _DrawRect_canvasBytes, _DrawRect_canvasSize, _DrawRect_pixel;
import { CompositeColor } from "../Color";
import { Vector2d } from "../Vector2d";
import { DrawPixel } from "./DrawPixel";
import { FillPattern } from "./FillPattern";
export class DrawRect {
    constructor(canvasBytes, canvasSize) {
        _DrawRect_canvasBytes.set(this, void 0);
        _DrawRect_canvasSize.set(this, void 0);
        _DrawRect_pixel.set(this, void 0);
        __classPrivateFieldSet(this, _DrawRect_canvasBytes, canvasBytes, "f");
        __classPrivateFieldSet(this, _DrawRect_canvasSize, canvasSize, "f");
        __classPrivateFieldSet(this, _DrawRect_pixel, new DrawPixel(__classPrivateFieldGet(this, _DrawRect_canvasBytes, "f"), __classPrivateFieldGet(this, _DrawRect_canvasSize, "f"), {
            disableRounding: true,
        }), "f");
    }
    // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
    // TODO: tests for MappingColor
    // TODO: tests for CompositeColor and fillPattern
    // TODO: cover ClippingRegion with tests
    draw(xy, wh, color, fill, fillPattern = FillPattern.primaryOnly, clippingRegion = null) {
        Vector2d.forEachIntXyWithinRectOf(xy, wh, true, fill, (xy) => {
            if (fillPattern.hasPrimaryColorAt(xy)) {
                __classPrivateFieldGet(this, _DrawRect_pixel, "f").draw(xy, color, clippingRegion);
            }
            else {
                if (color instanceof CompositeColor) {
                    __classPrivateFieldGet(this, _DrawRect_pixel, "f").draw(xy, color.secondary, clippingRegion);
                }
            }
        });
    }
}
_DrawRect_canvasBytes = new WeakMap(), _DrawRect_canvasSize = new WeakMap(), _DrawRect_pixel = new WeakMap();
