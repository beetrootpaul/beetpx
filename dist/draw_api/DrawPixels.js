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
var _DrawPixels_canvasPixels;
export class DrawPixels {
    constructor(canvasPixels) {
        _DrawPixels_canvasPixels.set(this, void 0);
        __classPrivateFieldSet(this, _DrawPixels_canvasPixels, canvasPixels, "f");
    }
    // TODO: add tests
    draw(xy, bits, color, clippingRegion = null) {
        xy = xy.round();
        for (let bitsY = 0; bitsY < bits.length; bitsY += 1) {
            for (let bitsX = 0; bitsX < bits[bitsY].length; bitsX += 1) {
                if (bits[bitsY][bitsX] !== "#") {
                    continue;
                }
                const x = xy.x + bitsX;
                const y = xy.y + bitsY;
                if (__classPrivateFieldGet(this, _DrawPixels_canvasPixels, "f").canSetAt(x, y)) {
                    if (!clippingRegion || clippingRegion.allowsDrawingAt(x, y)) {
                        __classPrivateFieldGet(this, _DrawPixels_canvasPixels, "f").set(color, x, y);
                    }
                }
            }
        }
    }
}
_DrawPixels_canvasPixels = new WeakMap();
