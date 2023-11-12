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
var _DrawRect_instances, _DrawRect_canvas, _DrawRect_drawPixel;
import { u_ } from "../Utils";
import { BpxCompositeColor } from "../color/CompositeColor";
import { BpxMappingColor } from "../color/MappingColor";
import { BpxSolidColor } from "../color/SolidColor";
import { BpxVector2d } from "../misc/Vector2d";
import { BpxFillPattern } from "./FillPattern";
export class DrawRect {
    constructor(canvas) {
        _DrawRect_instances.add(this);
        _DrawRect_canvas.set(this, void 0);
        __classPrivateFieldSet(this, _DrawRect_canvas, canvas, "f");
    }
    
    
    
    
    draw(xy, wh, color, fill, fillPattern = BpxFillPattern.primaryOnly) {
        var _a;
        const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(xy.round(), xy.add(wh).round());
        
        if (xyMaxExclusive.x - xyMinInclusive.x <= 0 ||
            xyMaxExclusive.y - xyMinInclusive.y <= 0) {
            return;
        }
        
        if (!__classPrivateFieldGet(this, _DrawRect_canvas, "f").canSetAny(xyMinInclusive.x, xyMinInclusive.y, xyMaxExclusive.x - 1, xyMaxExclusive.y - 1)) {
            return;
        }
        const c1 = color instanceof BpxCompositeColor
            ? color.primary instanceof BpxSolidColor
                ? color.primary
                : null
            : color;
        const c2 = color instanceof BpxCompositeColor
            ? color.secondary instanceof BpxSolidColor
                ? color.secondary
                : null
            : null;
        const sn = c1 instanceof BpxMappingColor
            ? (_a = __classPrivateFieldGet(this, _DrawRect_canvas, "f").getSnapshot(c1.snapshotId)) !== null && _a !== void 0 ? _a : u_.throwError(`Tried to access a non-existent canvas snapshot of ID: ${c1.snapshotId}`)
            : null;
        const fp = fillPattern;
        for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
            if (fill || y === xyMinInclusive.y || y === xyMaxExclusive.y - 1) {
                for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
                    __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, x, y, c1, c2, fp, sn);
                }
            }
            else {
                __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, xyMinInclusive.x, y, c1, c2, fp, sn);
                __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, xyMaxExclusive.x - 1, y, c1, c2, fp, sn);
            }
        }
    }
}
_DrawRect_canvas = new WeakMap(), _DrawRect_instances = new WeakSet(), _DrawRect_drawPixel = function _DrawRect_drawPixel(x, y, c1, c2, fillPattern, snapshot) {
    if (!__classPrivateFieldGet(this, _DrawRect_canvas, "f").canSetAt(x, y)) {
        return;
    }
    if (fillPattern.hasPrimaryColorAt(x, y)) {
        if (!c1) {
        }
        else if (c1 instanceof BpxSolidColor) {
            __classPrivateFieldGet(this, _DrawRect_canvas, "f").set(c1, x, y);
        }
        else {
            const mapped = c1.getMappedColorFromCanvasSnapshot(snapshot !== null && snapshot !== void 0 ? snapshot : u_.throwError("Snapshot was not passed when trying to obtain a mapped color"), y * __classPrivateFieldGet(this, _DrawRect_canvas, "f").canvasSize.x + x);
            if (mapped instanceof BpxSolidColor) {
                __classPrivateFieldGet(this, _DrawRect_canvas, "f").set(mapped, x, y);
            }
        }
    }
    else {
        if (c2 != null) {
            __classPrivateFieldGet(this, _DrawRect_canvas, "f").set(c2, x, y);
        }
    }
};
