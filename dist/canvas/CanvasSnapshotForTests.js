"use strict";
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
var _CanvasSnapshotForTests_rgbValues;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasSnapshotForTests = void 0;
const RgbColor_1 = require("../color/RgbColor");
class CanvasSnapshotForTests {
    constructor(rgbValues) {
        _CanvasSnapshotForTests_rgbValues.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasSnapshotForTests_rgbValues, rgbValues, "f");
    }
    getColorAtIndex(index) {
        if (index >= __classPrivateFieldGet(this, _CanvasSnapshotForTests_rgbValues, "f").length) {
            throw Error(`index out of bounds: index = ${index}, max allowed index = ${__classPrivateFieldGet(this, _CanvasSnapshotForTests_rgbValues, "f").length - 1}`);
        }
        const value = __classPrivateFieldGet(this, _CanvasSnapshotForTests_rgbValues, "f")[index];
        return (0, RgbColor_1.rgb_)((value & 0xff0000) >> 16, (value & 0x00ff00) >> 8, value & 0x0000ff);
    }
}
exports.CanvasSnapshotForTests = CanvasSnapshotForTests;
_CanvasSnapshotForTests_rgbValues = new WeakMap();
