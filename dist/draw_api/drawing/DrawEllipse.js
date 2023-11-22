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
var _DrawEllipse_instances, _DrawEllipse_canvas, _DrawEllipse_drawPixel;
import { BpxVector2d } from "../../misc/Vector2d";
export class DrawEllipse {
    constructor(canvas) {
        _DrawEllipse_instances.add(this);
        _DrawEllipse_canvas.set(this, void 0);
        __classPrivateFieldSet(this, _DrawEllipse_canvas, canvas, "f");
    }
    
    draw(xy, wh, color, fill, pattern) {
        const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(xy.round(), xy.add(wh).round());
        
        if (xyMaxExclusive.x - xyMinInclusive.x <= 0 ||
            xyMaxExclusive.y - xyMinInclusive.y <= 0) {
            return;
        }
        
        if (!__classPrivateFieldGet(this, _DrawEllipse_canvas, "f").canSetAny(xyMinInclusive.x, xyMinInclusive.y, xyMaxExclusive.x - 1, xyMaxExclusive.y - 1)) {
            return;
        }
        const c1 = color.type === "pattern" ? color.primary : color;
        const c2 = color.type === "pattern" ? color.secondary : null;
        const sn = c1?.type === "canvas_snapshot_mapping"
            ? __classPrivateFieldGet(this, _DrawEllipse_canvas, "f").getMostRecentSnapshot()
            : null;
        const p = pattern;
        
        
        
        let a = xyMaxExclusive.x - xyMinInclusive.x - 1;
        let b = xyMaxExclusive.y - xyMinInclusive.y - 1;
        let b1 = b & 1;
        let left = xyMinInclusive.x;
        let right = xyMaxExclusive.x - 1;
        let bottom = xyMinInclusive.y + Math.floor((b + 1) / 2);
        let top = bottom - b1;
        let errIncrementX = 4 * (1 - a) * b * b;
        let errIncrementY = 4 * (b1 + 1) * a * a;
        let currentErr = errIncrementX + errIncrementY + b1 * a * a;
        a = 8 * a * a;
        b1 = 8 * b * b;
        do {
            
            
            
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, right, bottom, c1, c2, p, sn);
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, left, bottom, c1, c2, p, sn);
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, left, top, c1, c2, p, sn);
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, right, top, c1, c2, p, sn);
            if (fill) {
                for (let x = left + 1; x < right; ++x) {
                    __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, x, top, c1, c2, p, sn);
                    __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, x, bottom, c1, c2, p, sn);
                }
            }
            
            
            
            const currentErrBeforeStep = currentErr;
            if (2 * currentErrBeforeStep <= errIncrementY) {
                bottom += 1;
                top -= 1;
                errIncrementY += a;
                currentErr += errIncrementY;
            }
            if (2 * currentErrBeforeStep >= errIncrementX ||
                2 * currentErr > errIncrementY) {
                left += 1;
                right -= 1;
                errIncrementX += b1;
                currentErr += errIncrementX;
            }
        } while (left <= right);
        
        
        
        while (bottom - top <= b) {
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, left - 1, bottom, c1, c2, p, sn);
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, right + 1, bottom, c1, c2, p, sn);
            bottom += 1;
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, left - 1, top, c1, c2, p, sn);
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, right + 1, top, c1, c2, p, sn);
            top -= 1;
        }
    }
}
_DrawEllipse_canvas = new WeakMap(), _DrawEllipse_instances = new WeakSet(), _DrawEllipse_drawPixel = function _DrawEllipse_drawPixel(x, y, c1, c2, pattern, snapshot) {
    if (!__classPrivateFieldGet(this, _DrawEllipse_canvas, "f").canSetAt(x, y)) {
        return;
    }
    if (pattern.hasPrimaryColorAt(x, y)) {
        if (!c1) {
        }
        else if (c1.type === "rgb") {
            __classPrivateFieldGet(this, _DrawEllipse_canvas, "f").set(c1, x, y);
        }
        else {
            const mapped = c1.getMappedColor(snapshot, y * __classPrivateFieldGet(this, _DrawEllipse_canvas, "f").canvasSize.x + x);
            if (mapped) {
                __classPrivateFieldGet(this, _DrawEllipse_canvas, "f").set(mapped, x, y);
            }
        }
    }
    else {
        if (c2 != null) {
            __classPrivateFieldGet(this, _DrawEllipse_canvas, "f").set(c2, x, y);
        }
    }
};
