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
var _CanvasPixelsWebGl2_length;
import { BpxSolidColor } from "../../Color";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsWebGl2Snapshot } from "./CanvasPixelsWebGl2Snapshot";
export class CanvasPixelsWebGl2 extends CanvasPixels {
    constructor(canvasSize) {
        super(canvasSize);
        _CanvasPixelsWebGl2_length.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasPixelsWebGl2_length, canvasSize.x * canvasSize.y, "f");
    }
    set(index, color) {
        if (index >= __classPrivateFieldGet(this, _CanvasPixelsWebGl2_length, "f")) {
            throw Error(`CanvasPixelsWebGl2: index out of bounds: index = ${index}, maxAllowedIndex = ${__classPrivateFieldGet(this, _CanvasPixelsWebGl2_length, "f") - 1}`);
        }
        // TODO: ???
    }
    get(index) {
        if (index >= __classPrivateFieldGet(this, _CanvasPixelsWebGl2_length, "f")) {
            throw Error(`CanvasPixelsWebGl2: index out of bounds: index = ${index}, maxAllowedIndex = ${__classPrivateFieldGet(this, _CanvasPixelsWebGl2_length, "f") - 1}`);
        }
        // TODO: ???
        return BpxSolidColor.fromRgbCssHex("#012345");
    }
    takeSnapshot() {
        // TODO: ???
        return new CanvasPixelsWebGl2Snapshot();
    }
    onWindowResize() {
        // TODO: ???
    }
    render() {
        // TODO: ???
    }
}
_CanvasPixelsWebGl2_length = new WeakMap();
