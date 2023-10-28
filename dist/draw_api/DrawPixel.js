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
var _DrawPixel_canvasPixels;
import { BpxFillPattern } from "./FillPattern";
export class DrawPixel {
    constructor(canvasPixels) {
        _DrawPixel_canvasPixels.set(this, void 0);
        __classPrivateFieldSet(this, _DrawPixel_canvasPixels, canvasPixels, "f");
    }
    // TODO: consolidate where composite color and fill patterns are handled (look for `instanceof`). Consider renaming fill pattern to e.g. pattern color as well
    // TODO: tests for MappingColor
    // TODO: consider moving fill pattern and composite color support inside here
    // TODO: cover ClippingRegion with tests
    draw(xy, color, fillPattern = BpxFillPattern.primaryOnly, clippingRegion = null) {
        xy = xy.round();
        if (!__classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").canSetAt(xy.x, xy.y)) {
            return;
        }
        if (clippingRegion && !clippingRegion.allowsDrawingAt(xy.x, xy.y)) {
            return;
        }
        if (fillPattern.hasPrimaryColorAt(xy.x, xy.y)) {
            __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").set(color, xy.x, xy.y);
        }
    }
}
_DrawPixel_canvasPixels = new WeakMap();
