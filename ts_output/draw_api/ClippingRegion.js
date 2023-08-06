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
var _ClippingRegion_xy1, _ClippingRegion_xy2;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClippingRegion = void 0;
const Vector2d_1 = require("../Vector2d");
class ClippingRegion {
    static of(xy1, xy2) {
        return new ClippingRegion(xy1, xy2);
    }
    constructor(xy1, xy2) {
        var _a, _b;
        _ClippingRegion_xy1.set(this, void 0);
        _ClippingRegion_xy2.set(this, void 0);
        _a = this, _b = this, [({ set value(_c) { __classPrivateFieldSet(_a, _ClippingRegion_xy1, _c, "f"); } }).value, ({ set value(_c) { __classPrivateFieldSet(_b, _ClippingRegion_xy2, _c, "f"); } }).value] = [Vector2d_1.Vector2d.min(xy1, xy2), Vector2d_1.Vector2d.max(xy1, xy2)];
    }
    allowsDrawingAt(xy) {
        return xy.gte(__classPrivateFieldGet(this, _ClippingRegion_xy1, "f")) && xy.lt(__classPrivateFieldGet(this, _ClippingRegion_xy2, "f"));
    }
}
exports.ClippingRegion = ClippingRegion;
_ClippingRegion_xy1 = new WeakMap(), _ClippingRegion_xy2 = new WeakMap();
