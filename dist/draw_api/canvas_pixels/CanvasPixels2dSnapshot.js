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
var _CanvasPixels2dSnapshot_rgbValues;
import { BpxSolidColor } from "../../Color";
export class CanvasPixels2dSnapshot {
    constructor(rgbValues) {
        _CanvasPixels2dSnapshot_rgbValues.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasPixels2dSnapshot_rgbValues, rgbValues, "f");
    }
    get(index) {
        const value = __classPrivateFieldGet(this, _CanvasPixels2dSnapshot_rgbValues, "f")[index];
        return new BpxSolidColor((value & 0xff0000) >> 16, (value & 0x00ff00) >> 8, value & 0x0000ff);
    }
}
_CanvasPixels2dSnapshot_rgbValues = new WeakMap();
