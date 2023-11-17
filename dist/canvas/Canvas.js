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
var _Canvas_minX, _Canvas_minY, _Canvas_maxX, _Canvas_maxY, _Canvas_snapshot;
import { BpxVector2d, v_, v_0_0_ } from "../misc/Vector2d";
export class Canvas {
    constructor(canvasSize) {
        _Canvas_minX.set(this, void 0);
        _Canvas_minY.set(this, void 0);
        _Canvas_maxX.set(this, void 0);
        _Canvas_maxY.set(this, void 0);
        _Canvas_snapshot.set(this, null);
        this.canvasSize = canvasSize.round();
        __classPrivateFieldSet(this, _Canvas_minX, 0, "f");
        __classPrivateFieldSet(this, _Canvas_minY, 0, "f");
        __classPrivateFieldSet(this, _Canvas_maxX, this.canvasSize.x - 1, "f");
        __classPrivateFieldSet(this, _Canvas_maxY, this.canvasSize.y - 1, "f");
    }
    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    setClippingRegion(xy, wh) {
        const prev = [
            v_(__classPrivateFieldGet(this, _Canvas_minX, "f"), __classPrivateFieldGet(this, _Canvas_minY, "f")),
            v_(__classPrivateFieldGet(this, _Canvas_maxX, "f") - __classPrivateFieldGet(this, _Canvas_minX, "f") + 1, __classPrivateFieldGet(this, _Canvas_maxY, "f") - __classPrivateFieldGet(this, _Canvas_minY, "f") + 1),
        ];
        const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(xy.round(), xy.add(wh).round());
        __classPrivateFieldSet(this, _Canvas_minX, xyMinInclusive.x, "f");
        __classPrivateFieldSet(this, _Canvas_minY, xyMinInclusive.y, "f");
        __classPrivateFieldSet(this, _Canvas_maxX, xyMaxExclusive.x - 1, "f");
        __classPrivateFieldSet(this, _Canvas_maxY, xyMaxExclusive.y - 1, "f");
        return prev;
    }
    /**
     * @returns - previous clipping region in form of an array: [xy, wh]
     */
    removeClippingRegion() {
        return this.setClippingRegion(v_0_0_, this.canvasSize);
    }
    canSetAny(xMin, yMin, xMax, yMax) {
        return (xMax >= __classPrivateFieldGet(this, _Canvas_minX, "f") &&
            yMax >= __classPrivateFieldGet(this, _Canvas_minY, "f") &&
            xMin <= __classPrivateFieldGet(this, _Canvas_maxX, "f") &&
            yMin <= __classPrivateFieldGet(this, _Canvas_maxY, "f"));
    }
    canSetAt(x, y) {
        return (x >= __classPrivateFieldGet(this, _Canvas_minX, "f") && y >= __classPrivateFieldGet(this, _Canvas_minY, "f") && x <= __classPrivateFieldGet(this, _Canvas_maxX, "f") && y <= __classPrivateFieldGet(this, _Canvas_maxY, "f"));
    }
    takeSnapshot() {
        __classPrivateFieldSet(this, _Canvas_snapshot, this.newSnapshot(), "f");
    }
    getMostRecentSnapshot() {
        return __classPrivateFieldGet(this, _Canvas_snapshot, "f");
    }
    render() {
        __classPrivateFieldSet(this, _Canvas_snapshot, null, "f");
        this.doRender();
    }
}
_Canvas_minX = new WeakMap(), _Canvas_minY = new WeakMap(), _Canvas_maxX = new WeakMap(), _Canvas_maxY = new WeakMap(), _Canvas_snapshot = new WeakMap();
