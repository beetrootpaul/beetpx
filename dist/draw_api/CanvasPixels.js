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
var _CanvasPixels_length, _CanvasPixels_rgbValues;
import { BpxSolidColor } from "../Color";
import { u_ } from "../Utils";
export class CanvasPixels {
    constructor(canvasSize, rgbValues) {
        _CanvasPixels_length.set(this, void 0);
        _CanvasPixels_rgbValues.set(this, void 0);
        this.canvasSize = canvasSize.round();
        __classPrivateFieldSet(this, _CanvasPixels_length, this.canvasSize.x * this.canvasSize.y, "f");
        __classPrivateFieldSet(this, _CanvasPixels_rgbValues, u_
            .range(__classPrivateFieldGet(this, _CanvasPixels_length, "f"))
            .map((index) => { var _a; return (_a = rgbValues === null || rgbValues === void 0 ? void 0 : rgbValues[index]) !== null && _a !== void 0 ? _a : 0; }), "f");
    }
    set(index, color) {
        __classPrivateFieldGet(this, _CanvasPixels_rgbValues, "f")[index] = (color.r << 16) + (color.g << 8) + color.b;
    }
    get(index) {
        if (index >= __classPrivateFieldGet(this, _CanvasPixels_length, "f")) {
            throw Error(`CanvasPixels: index out of bounds: index = ${index}, maxAllowedIndex = ${__classPrivateFieldGet(this, _CanvasPixels_length, "f") - 1}`);
        }
        const value = __classPrivateFieldGet(this, _CanvasPixels_rgbValues, "f")[index];
        return new BpxSolidColor((value & 0xff0000) >> 16, (value & 0x00ff00) >> 8, value & 0x0000ff);
    }
    clone() {
        return new CanvasPixels(this.canvasSize, __classPrivateFieldGet(this, _CanvasPixels_rgbValues, "f"));
    }
    renderTo(htmlCanvasData) {
        for (let index = 0; index < __classPrivateFieldGet(this, _CanvasPixels_length, "f"); index++) {
            const value = __classPrivateFieldGet(this, _CanvasPixels_rgbValues, "f")[index];
            const dataIndex = index * 4;
            htmlCanvasData[dataIndex] = (value & 0xff0000) >> 16;
            htmlCanvasData[dataIndex + 1] = (value & 0x00ff00) >> 8;
            htmlCanvasData[dataIndex + 2] = value & 0x0000ff;
        }
    }
}
_CanvasPixels_length = new WeakMap(), _CanvasPixels_rgbValues = new WeakMap();
