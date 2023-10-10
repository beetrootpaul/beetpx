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
var _DrawPixels_pixel;
import { DrawPixel } from "./DrawPixel";
export class DrawPixels {
    constructor(canvasBytes, canvasSize) {
        _DrawPixels_pixel.set(this, void 0);
        __classPrivateFieldSet(this, _DrawPixels_pixel, new DrawPixel(canvasBytes, canvasSize), "f");
    }
    // TODO: add tests
    draw(xy, bits, color, clippingRegion = null) {
        xy = xy.round();
        for (let bitsY = 0; bitsY < bits.length; bitsY += 1) {
            for (let bitsX = 0; bitsX < bits[bitsY].length; bitsX += 1) {
                if (bits[bitsY][bitsX] !== "#") {
                    continue;
                }
                const canvasXy = xy.add(bitsX, bitsY);
                if (clippingRegion && !clippingRegion.allowsDrawingAt(canvasXy)) {
                    return;
                }
                __classPrivateFieldGet(this, _DrawPixels_pixel, "f").draw(canvasXy, color);
            }
        }
    }
}
_DrawPixels_pixel = new WeakMap();
