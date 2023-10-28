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
var _CanvasPixelsForTests_length, _CanvasPixelsForTests_rgbValues;
import { u_ } from "../../Utils";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsForTestsSnapshot } from "./CanvasPixelsForTestsSnapshot";
export class CanvasPixelsForTests extends CanvasPixels {
    constructor(canvasSize) {
        super(canvasSize);
        _CanvasPixelsForTests_length.set(this, void 0);
        _CanvasPixelsForTests_rgbValues.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasPixelsForTests_length, canvasSize.x * canvasSize.y, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForTests_rgbValues, u_.range(__classPrivateFieldGet(this, _CanvasPixelsForTests_length, "f")).map(() => 0), "f");
    }
    wasAlreadySet(x, y) {
        return false;
    }
    set(color, x, y) {
        const index = y * this.canvasSize.x + x;
        if (index >= __classPrivateFieldGet(this, _CanvasPixelsForTests_length, "f")) {
            throw Error(`CanvasPixels2d: index out of bounds: index = ${index}, maxAllowedIndex = ${__classPrivateFieldGet(this, _CanvasPixelsForTests_length, "f") - 1}`);
        }
        __classPrivateFieldGet(this, _CanvasPixelsForTests_rgbValues, "f")[index] = (color.r << 16) + (color.g << 8) + color.b;
    }
    newSnapshot() {
        return new CanvasPixelsForTestsSnapshot([...__classPrivateFieldGet(this, _CanvasPixelsForTests_rgbValues, "f")]);
    }
    onWindowResize() { }
    resetVisitedMarkers() { }
    doRender() { }
}
_CanvasPixelsForTests_length = new WeakMap(), _CanvasPixelsForTests_rgbValues = new WeakMap();
