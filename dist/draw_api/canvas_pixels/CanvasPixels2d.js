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
var _CanvasPixels2d_outImageData, _CanvasPixels2d_length, _CanvasPixels2d_rgbValues;
import { BpxSolidColor } from "../../Color";
import { u_ } from "../../Utils";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixels2dSnapshot } from "./CanvasPixels2dSnapshot";
export class CanvasPixels2d extends CanvasPixels {
    constructor(canvasSize, outImageData) {
        super(canvasSize);
        _CanvasPixels2d_outImageData.set(this, void 0);
        _CanvasPixels2d_length.set(this, void 0);
        _CanvasPixels2d_rgbValues.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasPixels2d_outImageData, outImageData, "f");
        __classPrivateFieldSet(this, _CanvasPixels2d_length, canvasSize.x * canvasSize.y, "f");
        __classPrivateFieldSet(this, _CanvasPixels2d_rgbValues, u_.range(__classPrivateFieldGet(this, _CanvasPixels2d_length, "f")).map(() => 0), "f");
    }
    set(index, color) {
        __classPrivateFieldGet(this, _CanvasPixels2d_rgbValues, "f")[index] = (color.r << 16) + (color.g << 8) + color.b;
    }
    get(index) {
        if (index >= __classPrivateFieldGet(this, _CanvasPixels2d_length, "f")) {
            throw Error(`CanvasPixels: index out of bounds: index = ${index}, maxAllowedIndex = ${__classPrivateFieldGet(this, _CanvasPixels2d_length, "f") - 1}`);
        }
        const value = __classPrivateFieldGet(this, _CanvasPixels2d_rgbValues, "f")[index];
        return new BpxSolidColor((value & 0xff0000) >> 16, (value & 0x00ff00) >> 8, value & 0x0000ff);
    }
    takeSnapshot() {
        return new CanvasPixels2dSnapshot([...__classPrivateFieldGet(this, _CanvasPixels2d_rgbValues, "f")]);
    }
    render() {
        for (let index = 0; index < __classPrivateFieldGet(this, _CanvasPixels2d_length, "f"); index++) {
            const value = __classPrivateFieldGet(this, _CanvasPixels2d_rgbValues, "f")[index];
            const dataIndex = index * 4;
            __classPrivateFieldGet(this, _CanvasPixels2d_outImageData, "f")[dataIndex] = (value & 0xff0000) >> 16;
            __classPrivateFieldGet(this, _CanvasPixels2d_outImageData, "f")[dataIndex + 1] = (value & 0x00ff00) >> 8;
            __classPrivateFieldGet(this, _CanvasPixels2d_outImageData, "f")[dataIndex + 2] = value & 0x0000ff;
        }
    }
}
_CanvasPixels2d_outImageData = new WeakMap(), _CanvasPixels2d_length = new WeakMap(), _CanvasPixels2d_rgbValues = new WeakMap();
