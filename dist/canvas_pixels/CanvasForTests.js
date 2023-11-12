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
var _CanvasForTests_length, _CanvasForTests_rgbValues, _CanvasForTests_minX, _CanvasForTests_minY, _CanvasForTests_maxX, _CanvasForTests_maxY;
import { u_ } from "../Utils";
import { BpxVector2d } from "../misc/Vector2d";
import { Canvas } from "./Canvas";
import { CanvasSnapshotForTests } from "./CanvasSnapshotForTests";
export class CanvasForTests extends Canvas {
    constructor(canvasSize) {
        super(canvasSize);
        _CanvasForTests_length.set(this, void 0);
        _CanvasForTests_rgbValues.set(this, void 0);
        _CanvasForTests_minX.set(this, void 0);
        _CanvasForTests_minY.set(this, void 0);
        _CanvasForTests_maxX.set(this, void 0);
        _CanvasForTests_maxY.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasForTests_minX, 0, "f");
        __classPrivateFieldSet(this, _CanvasForTests_minY, 0, "f");
        __classPrivateFieldSet(this, _CanvasForTests_maxX, canvasSize.x - 1, "f");
        __classPrivateFieldSet(this, _CanvasForTests_maxY, canvasSize.y - 1, "f");
        __classPrivateFieldSet(this, _CanvasForTests_length, canvasSize.x * canvasSize.y, "f");
        __classPrivateFieldSet(this, _CanvasForTests_rgbValues, u_.range(__classPrivateFieldGet(this, _CanvasForTests_length, "f")).map(() => 0), "f");
    }
    setClippingRegion(xy, wh) {
        const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(xy.round(), xy.add(wh).round());
        __classPrivateFieldSet(this, _CanvasForTests_minX, xyMinInclusive.x, "f");
        __classPrivateFieldSet(this, _CanvasForTests_minY, xyMinInclusive.y, "f");
        __classPrivateFieldSet(this, _CanvasForTests_maxX, xyMaxExclusive.x - 1, "f");
        __classPrivateFieldSet(this, _CanvasForTests_maxY, xyMaxExclusive.y - 1, "f");
    }
    removeClippingRegion() {
        __classPrivateFieldSet(this, _CanvasForTests_minX, 0, "f");
        __classPrivateFieldSet(this, _CanvasForTests_minY, 0, "f");
        __classPrivateFieldSet(this, _CanvasForTests_maxX, this.canvasSize.x - 1, "f");
        __classPrivateFieldSet(this, _CanvasForTests_maxY, this.canvasSize.y - 1, "f");
    }
    canSetAny(xMin, yMin, xMax, yMax) {
        return (xMax >= __classPrivateFieldGet(this, _CanvasForTests_minX, "f") &&
            yMax >= __classPrivateFieldGet(this, _CanvasForTests_minY, "f") &&
            xMin <= __classPrivateFieldGet(this, _CanvasForTests_maxX, "f") &&
            yMin <= __classPrivateFieldGet(this, _CanvasForTests_maxY, "f"));
    }
    canSetAt(x, y) {
        return x >= 0 && y >= 0 && x < this.canvasSize.x && y < this.canvasSize.y;
    }
    set(color, x, y) {
        if (x < 0 || y < 0 || x >= this.canvasSize.x || y >= this.canvasSize.y) {
            throw Error(`(x,y) index out of bounds: (x,y) = (${x},${y}), bottom bound = (0,0), upper bound = (${this.canvasSize.x - 1},${this.canvasSize.y - 1})`);
        }
        const index = y * this.canvasSize.x + x;
        if (index >= __classPrivateFieldGet(this, _CanvasForTests_length, "f")) {
            throw Error(`index out of bounds: index = ${index}, max allowed index = ${__classPrivateFieldGet(this, _CanvasForTests_length, "f") - 1}`);
        }
        __classPrivateFieldGet(this, _CanvasForTests_rgbValues, "f")[index] = (color.r << 16) + (color.g << 8) + color.b;
    }
    newSnapshot() {
        return new CanvasSnapshotForTests(__classPrivateFieldGet(this, _CanvasForTests_rgbValues, "f").slice());
    }
    doRender() { }
}
_CanvasForTests_length = new WeakMap(), _CanvasForTests_rgbValues = new WeakMap(), _CanvasForTests_minX = new WeakMap(), _CanvasForTests_minY = new WeakMap(), _CanvasForTests_maxX = new WeakMap(), _CanvasForTests_maxY = new WeakMap();
