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
    // TODO: support ClippingRegion + cover with tests
    draw(color, clippingRegion = null) {
        for (let pixel = 0; pixel < __classPrivateFieldGet(this, _DrawClear_canvasPixels, "f").canvasSize.x * __classPrivateFieldGet(this, _DrawClear_canvasPixels, "f").canvasSize.y; pixel += 1) {
            __classPrivateFieldGet(this, _DrawClear_canvasPixels, "f").set(pixel, color);
        }
    }
}
_DrawClear_canvasPixels = new WeakMap();
