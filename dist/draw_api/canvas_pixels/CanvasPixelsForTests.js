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
var _CanvasPixelsForTests_length, _CanvasPixelsForTests_rgbValues, _CanvasPixelsForTests_minX, _CanvasPixelsForTests_minY, _CanvasPixelsForTests_maxX, _CanvasPixelsForTests_maxY;
import { u_ } from "../../Utils";
import { BpxVector2d } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsForTestsSnapshot } from "./CanvasPixelsForTestsSnapshot";
export class CanvasPixelsForTests extends CanvasPixels {
    constructor(canvasSize) {
        super(canvasSize);
        _CanvasPixelsForTests_length.set(this, void 0);
        _CanvasPixelsForTests_rgbValues.set(this, void 0);
        _CanvasPixelsForTests_minX.set(this, void 0);
        _CanvasPixelsForTests_minY.set(this, void 0);
        _CanvasPixelsForTests_maxX.set(this, void 0);
        _CanvasPixelsForTests_maxY.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasPixelsForTests_minX, 0, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForTests_minY, 0, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForTests_maxX, canvasSize.x - 1, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForTests_maxY, canvasSize.y - 1, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForTests_length, canvasSize.x * canvasSize.y, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForTests_rgbValues, u_.range(__classPrivateFieldGet(this, _CanvasPixelsForTests_length, "f")).map(() => 0), "f");
    }
    setClippingRegion(xy, wh) {
        const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(xy.round(), xy.add(wh).round());
        __classPrivateFieldSet(this, _CanvasPixelsForTests_minX, xyMinInclusive.x, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForTests_minY, xyMinInclusive.y, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForTests_maxX, xyMaxExclusive.x - 1, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForTests_maxY, xyMaxExclusive.y - 1, "f");
    }
    removeClippingRegion() {
        __classPrivateFieldSet(this, _CanvasPixelsForTests_minX, 0, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForTests_minY, 0, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForTests_maxX, this.canvasSize.x - 1, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForTests_maxY, this.canvasSize.y - 1, "f");
    }
    canSetAny(xMin, yMin, xMax, yMax) {
        return (xMax >= __classPrivateFieldGet(this, _CanvasPixelsForTests_minX, "f") &&
            yMax >= __classPrivateFieldGet(this, _CanvasPixelsForTests_minY, "f") &&
            xMin <= __classPrivateFieldGet(this, _CanvasPixelsForTests_maxX, "f") &&
            yMin <= __classPrivateFieldGet(this, _CanvasPixelsForTests_maxY, "f"));
    }
    canSetAt(x, y) {
        return x >= 0 && y >= 0 && x < this.canvasSize.x && y < this.canvasSize.y;
    }
    set(color, x, y) {
        if (x < 0 || y < 0 || x >= this.canvasSize.x || y >= this.canvasSize.y) {
            throw Error(`(x,y) index out of bounds: (x,y) = (${x},${y}), bottom bound = (0,0), upper bound = (${this.canvasSize.x - 1},${this.canvasSize.y - 1})`);
        }
        const index = y * this.canvasSize.x + x;
        if (index >= __classPrivateFieldGet(this, _CanvasPixelsForTests_length, "f")) {
            throw Error(`index out of bounds: index = ${index}, max allowed index = ${__classPrivateFieldGet(this, _CanvasPixelsForTests_length, "f") - 1}`);
        }
        __classPrivateFieldGet(this, _CanvasPixelsForTests_rgbValues, "f")[index] = (color.r << 16) + (color.g << 8) + color.b;
    }
    newSnapshot() {
        return new CanvasPixelsForTestsSnapshot(__classPrivateFieldGet(this, _CanvasPixelsForTests_rgbValues, "f").slice());
    }
    onWindowResize() { }
    doRender() { }
}
_CanvasPixelsForTests_length = new WeakMap(), _CanvasPixelsForTests_rgbValues = new WeakMap(), _CanvasPixelsForTests_minX = new WeakMap(), _CanvasPixelsForTests_minY = new WeakMap(), _CanvasPixelsForTests_maxX = new WeakMap(), _CanvasPixelsForTests_maxY = new WeakMap();
