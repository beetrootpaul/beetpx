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
var _CanvasSnapshotForProduction_imageDataData;
import { BpxRgbColor } from "../color/RgbColor";
export class CanvasSnapshotForProduction {
    constructor(imageDataData) {
        _CanvasSnapshotForProduction_imageDataData.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasSnapshotForProduction_imageDataData, imageDataData, "f");
    }
    getColorAtIndex(index) {
        if (index >= __classPrivateFieldGet(this, _CanvasSnapshotForProduction_imageDataData, "f").length / 4) {
            throw Error(`index out of bounds: index = ${index}, max allowed index = ${__classPrivateFieldGet(this, _CanvasSnapshotForProduction_imageDataData, "f").length / 4 - 1}`);
        }
        const dataIndex = index * 4;
        return new BpxRgbColor(__classPrivateFieldGet(this, _CanvasSnapshotForProduction_imageDataData, "f")[dataIndex], __classPrivateFieldGet(this, _CanvasSnapshotForProduction_imageDataData, "f")[dataIndex + 1], __classPrivateFieldGet(this, _CanvasSnapshotForProduction_imageDataData, "f")[dataIndex + 2]);
    }
}
_CanvasSnapshotForProduction_imageDataData = new WeakMap();
