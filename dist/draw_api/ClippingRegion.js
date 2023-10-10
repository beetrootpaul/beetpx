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
var _BpxClippingRegion_xy1, _BpxClippingRegion_xy2;
import { BpxVector2d } from "../Vector2d";
export class BpxClippingRegion {
    constructor(xy, wh) {
        var _a, _b;
        _BpxClippingRegion_xy1.set(this, void 0);
        _BpxClippingRegion_xy2.set(this, void 0);
        __classPrivateFieldSet(this, _BpxClippingRegion_xy1, xy.round(), "f");
        __classPrivateFieldSet(this, _BpxClippingRegion_xy2, xy.add(wh).round(), "f");
        _a = this, _b = this, [({ set value(_c) { __classPrivateFieldSet(_a, _BpxClippingRegion_xy1, _c, "f"); } }).value, ({ set value(_c) { __classPrivateFieldSet(_b, _BpxClippingRegion_xy2, _c, "f"); } }).value] = BpxVector2d.minMax(__classPrivateFieldGet(this, _BpxClippingRegion_xy1, "f"), __classPrivateFieldGet(this, _BpxClippingRegion_xy2, "f"));
    }
    // TODO: consider a faster implementation based on bitmasks for a continuous chunks of pixels
    allowsDrawingAt(xy) {
        return xy.gte(__classPrivateFieldGet(this, _BpxClippingRegion_xy1, "f")) && xy.lt(__classPrivateFieldGet(this, _BpxClippingRegion_xy2, "f"));
    }
}
_BpxClippingRegion_xy1 = new WeakMap(), _BpxClippingRegion_xy2 = new WeakMap();
