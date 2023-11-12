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
var _DrawLine_instances, _DrawLine_canvas, _DrawLine_drawPixel;
import { u_ } from "../Utils";
import { BpxCompositeColor } from "../color/CompositeColor";
import { BpxMappingColor } from "../color/MappingColor";
import { BpxSolidColor } from "../color/SolidColor";
import { v_ } from "../misc/Vector2d";
import { BpxFillPattern } from "./FillPattern";
export class DrawLine {
    constructor(canvas) {
        _DrawLine_instances.add(this);
        _DrawLine_canvas.set(this, void 0);
        __classPrivateFieldSet(this, _DrawLine_canvas, canvas, "f");
    }
    
    
    
    
    
    draw(xy, wh, color, fillPattern = BpxFillPattern.primaryOnly) {
        var _a;
        
        
        
        const xyStart = xy.round();
        const xyEnd = xy.add(wh).round();
        if (xyEnd.x - xyStart.x === 0 || xyEnd.y - xyStart.y === 0) {
            return;
        }
        
        
        
        wh = xyEnd.sub(xyStart);
        const whSub1 = wh.sub(wh.sign());
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
            ? (_a = __classPrivateFieldGet(this, _DrawLine_canvas, "f").getSnapshot(c1.snapshotId)) !== null && _a !== void 0 ? _a : u_.throwError(`Tried to access a non-existent canvas snapshot of ID: ${c1.snapshotId}`)
            : null;
        const fp = fillPattern;
        
        
        
        let dXy = whSub1.abs().mul(v_(1, -1));
        let currentXy = xyStart;
        const targetXy = xyStart.add(whSub1);
        const step = whSub1.sign();
        let err = dXy.x + dXy.y;
        while (true) {
            
            
            
            __classPrivateFieldGet(this, _DrawLine_instances, "m", _DrawLine_drawPixel).call(this, currentXy.x, currentXy.y, c1, c2, fp, sn);
            if (currentXy.eq(targetXy))
                break;
            
            
            
            const errBeforeStep = err;
            if (2 * errBeforeStep >= dXy.y) {
                currentXy = currentXy.add(v_(step.x, 0));
                err += dXy.y;
            }
            if (2 * errBeforeStep <= dXy.x) {
                currentXy = currentXy.add(v_(0, step.y));
                err += dXy.x;
            }
        }
    }
}
_DrawLine_canvas = new WeakMap(), _DrawLine_instances = new WeakSet(), _DrawLine_drawPixel = function _DrawLine_drawPixel(x, y, c1, c2, fillPattern, snapshot) {
    if (!__classPrivateFieldGet(this, _DrawLine_canvas, "f").canSetAt(x, y)) {
        return;
    }
    if (fillPattern.hasPrimaryColorAt(x, y)) {
        if (!c1) {
        }
        else if (c1 instanceof BpxSolidColor) {
            __classPrivateFieldGet(this, _DrawLine_canvas, "f").set(c1, x, y);
        }
        else {
            const mapped = c1.getMappedColorFromCanvasSnapshot(snapshot !== null && snapshot !== void 0 ? snapshot : u_.throwError("Snapshot was not passed when trying to obtain a mapped color"), y * __classPrivateFieldGet(this, _DrawLine_canvas, "f").canvasSize.x + x);
            if (mapped instanceof BpxSolidColor) {
                __classPrivateFieldGet(this, _DrawLine_canvas, "f").set(mapped, x, y);
            }
        }
    }
    else {
        if (c2 != null) {
            __classPrivateFieldGet(this, _DrawLine_canvas, "f").set(c2, x, y);
        }
    }
};
