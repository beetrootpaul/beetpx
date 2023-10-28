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
var _DrawClear_canvasPixels;
export class DrawClear {
    constructor(canvasPixels) {
        _DrawClear_canvasPixels.set(this, void 0);
        __classPrivateFieldSet(this, _DrawClear_canvasPixels, canvasPixels, "f");
    }
    // TODO: cover clippingRegion with tests
    draw(color, clippingRegion = null) {
        for (let x = 0; x < __classPrivateFieldGet(this, _DrawClear_canvasPixels, "f").canvasSize.x; ++x) {
            for (let y = 0; y < __classPrivateFieldGet(this, _DrawClear_canvasPixels, "f").canvasSize.y; ++y) {
                if (!__classPrivateFieldGet(this, _DrawClear_canvasPixels, "f").wasAlreadySet(x, y)) {
                    if (!clippingRegion || clippingRegion.allowsDrawingAt(x, y)) {
                        __classPrivateFieldGet(this, _DrawClear_canvasPixels, "f").set(color, x, y);
                    }
                }
            }
        }
    }
}
_DrawClear_canvasPixels = new WeakMap();
