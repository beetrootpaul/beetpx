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
var _CanvasPixelsNoRender_length, _CanvasPixelsNoRender_rgbValues, _CanvasPixelsNoRender_snapshots;
import { u_ } from "../../Utils";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixels2dSnapshot } from "./CanvasPixels2dSnapshot";
export class CanvasPixelsNoRender extends CanvasPixels {
    constructor(canvasSize) {
        super(canvasSize);
        _CanvasPixelsNoRender_length.set(this, void 0);
        _CanvasPixelsNoRender_rgbValues.set(this, void 0);
        _CanvasPixelsNoRender_snapshots.set(this, new Map());
        __classPrivateFieldSet(this, _CanvasPixelsNoRender_length, canvasSize.x * canvasSize.y, "f");
        __classPrivateFieldSet(this, _CanvasPixelsNoRender_rgbValues, u_.range(__classPrivateFieldGet(this, _CanvasPixelsNoRender_length, "f")).map(() => 0), "f");
    }
    set(index, color) {
        if (index >= __classPrivateFieldGet(this, _CanvasPixelsNoRender_length, "f")) {
            throw Error(`CanvasPixelsNoRender: index out of bounds: index = ${index}, maxAllowedIndex = ${__classPrivateFieldGet(this, _CanvasPixelsNoRender_length, "f") - 1}`);
        }
        __classPrivateFieldGet(this, _CanvasPixelsNoRender_rgbValues, "f")[index] = (color.r << 16) + (color.g << 8) + color.b;
    }
    takeSnapshot() {
        const id = __classPrivateFieldGet(this, _CanvasPixelsNoRender_snapshots, "f").size + 1;
        __classPrivateFieldGet(this, _CanvasPixelsNoRender_snapshots, "f").set(id, new CanvasPixels2dSnapshot([...__classPrivateFieldGet(this, _CanvasPixelsNoRender_rgbValues, "f")]));
        return id;
    }
    getSnapshot(snapshotId) {
        var _a;
        return (_a = __classPrivateFieldGet(this, _CanvasPixelsNoRender_snapshots, "f").get(snapshotId)) !== null && _a !== void 0 ? _a : null;
    }
    onWindowResize() { }
    render() {
        __classPrivateFieldGet(this, _CanvasPixelsNoRender_snapshots, "f").clear();
    }
}
_CanvasPixelsNoRender_length = new WeakMap(), _CanvasPixelsNoRender_rgbValues = new WeakMap(), _CanvasPixelsNoRender_snapshots = new WeakMap();
