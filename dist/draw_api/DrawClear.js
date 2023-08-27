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
var _DrawClear_canvasBytes, _DrawClear_canvasSize;
export class DrawClear {
    constructor(canvasBytes, canvasSize) {
        _DrawClear_canvasBytes.set(this, void 0);
        _DrawClear_canvasSize.set(this, void 0);
        __classPrivateFieldSet(this, _DrawClear_canvasBytes, canvasBytes, "f");
        __classPrivateFieldSet(this, _DrawClear_canvasSize, canvasSize.round(), "f");
    }
    // TODO: support ClippingRegion + cover with tests
    draw(color, clippingRegion = null) {
        for (let pixel = 0; pixel < __classPrivateFieldGet(this, _DrawClear_canvasSize, "f").x * __classPrivateFieldGet(this, _DrawClear_canvasSize, "f").y; pixel += 1) {
            const i = pixel * 4;
            __classPrivateFieldGet(this, _DrawClear_canvasBytes, "f")[i] = color.r;
            __classPrivateFieldGet(this, _DrawClear_canvasBytes, "f")[i + 1] = color.g;
            __classPrivateFieldGet(this, _DrawClear_canvasBytes, "f")[i + 2] = color.b;
            __classPrivateFieldGet(this, _DrawClear_canvasBytes, "f")[i + 3] = 0xff;
        }
    }
}
_DrawClear_canvasBytes = new WeakMap(), _DrawClear_canvasSize = new WeakMap();
