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
import { BpxVector2d } from "../../misc/Vector2d";
export class DrawRect {
    constructor(canvas) {
        _DrawRect_instances.add(this);
        _DrawRect_canvas.set(this, void 0);
        __classPrivateFieldSet(this, _DrawRect_canvas, canvas, "f");
    }
    draw(xy, wh, color, fill, pattern) {
        const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(xy.round(), xy.add(wh).round());
        
        if (!__classPrivateFieldGet(this, _DrawRect_canvas, "f").canSetAny(xyMinInclusive.x, xyMinInclusive.y, xyMaxExclusive.x - 1, xyMaxExclusive.y - 1)) {
            return;
        }
        const c1 = color.type === "pattern" ? color.primary : color;
        const c2 = color.type === "pattern" ? color.secondary : null;
        const sn = c1?.type === "canvas_snapshot_mapping"
            ? __classPrivateFieldGet(this, _DrawRect_canvas, "f").getMostRecentSnapshot()
            : null;
        const fp = pattern;
        
        for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
            __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, x, xyMinInclusive.y, c1, c2, fp, sn);
            __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, x, xyMaxExclusive.y - 1, c1, c2, fp, sn);
        }
        for (let y = xyMinInclusive.y + 1; y < xyMaxExclusive.y - 1; y += 1) {
            __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, xyMinInclusive.x, y, c1, c2, fp, sn);
            __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, xyMaxExclusive.x - 1, y, c1, c2, fp, sn);
        }
        if (fill === "inside") {
            
            for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
                for (let y = xyMinInclusive.y + 1; y < xyMaxExclusive.y - 1; y += 1) {
                    __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, x, y, c1, c2, fp, sn);
                }
            }
        }
        else if (fill === "outside") {
            
            for (let x = 0; x < xyMinInclusive.x; x += 1) {
                
                for (let y = 0; y < xyMinInclusive.y; y += 1) {
                    __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, x, y, c1, c2, fp, sn);
                }
                
                for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
                    __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, x, y, c1, c2, fp, sn);
                }
                
                for (let y = xyMaxExclusive.y; y < __classPrivateFieldGet(this, _DrawRect_canvas, "f").canvasSize.y; y += 1) {
                    __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, x, y, c1, c2, fp, sn);
                }
            }
            
            for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
                for (let y = 0; y < xyMinInclusive.y; y += 1) {
                    __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, x, y, c1, c2, fp, sn);
                }
            }
            
            for (let x = xyMinInclusive.x; x < xyMaxExclusive.x; x += 1) {
                for (let y = xyMaxExclusive.y; y < __classPrivateFieldGet(this, _DrawRect_canvas, "f").canvasSize.y; y += 1) {
                    __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, x, y, c1, c2, fp, sn);
                }
            }
            for (let x = xyMaxExclusive.x; x < __classPrivateFieldGet(this, _DrawRect_canvas, "f").canvasSize.x; x += 1) {
                
                for (let y = 0; y < xyMinInclusive.y; y += 1) {
                    __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, x, y, c1, c2, fp, sn);
                }
                
                for (let y = xyMinInclusive.y; y < xyMaxExclusive.y; y += 1) {
                    __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, x, y, c1, c2, fp, sn);
                }
                
                for (let y = xyMaxExclusive.y; y < __classPrivateFieldGet(this, _DrawRect_canvas, "f").canvasSize.y; y += 1) {
                    __classPrivateFieldGet(this, _DrawRect_instances, "m", _DrawRect_drawPixel).call(this, x, y, c1, c2, fp, sn);
                }
            }
        }
    }
}
_DrawRect_canvas = new WeakMap(), _DrawRect_instances = new WeakSet(), _DrawRect_drawPixel = function _DrawRect_drawPixel(x, y, c1, c2, pattern, snapshot) {
    if (!__classPrivateFieldGet(this, _DrawRect_canvas, "f").canSetAt(x, y)) {
        return;
    }
    if (pattern.hasPrimaryColorAt(x, y)) {
        if (!c1) {
        }
        else if (c1.type === "rgb") {
            __classPrivateFieldGet(this, _DrawRect_canvas, "f").set(c1, x, y);
        }
        else {
            const mapped = c1.getMappedColor(snapshot, y * __classPrivateFieldGet(this, _DrawRect_canvas, "f").canvasSize.x + x);
            if (mapped) {
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
