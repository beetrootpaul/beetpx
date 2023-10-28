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
var _DrawEllipse_instances, _DrawEllipse_canvasPixels, _DrawEllipse_drawPixel;
import { BpxCompositeColor, BpxMappingColor, BpxSolidColor } from "../Color";
import { u_ } from "../Utils";
import { BpxVector2d } from "../Vector2d";
import { BpxFillPattern } from "./FillPattern";
export class DrawEllipse {
    constructor(canvasPixels) {
        _DrawEllipse_instances.add(this);
        _DrawEllipse_canvasPixels.set(this, void 0);
        __classPrivateFieldSet(this, _DrawEllipse_canvasPixels, canvasPixels, "f");
    }
    // TODO: tests for MappingColor x fillPattern => secondary means no mapping?
    // TODO: tests for MappingColor
    // TODO: tests for CompositeColor and fillPattern
    // TODO: cover ClippingRegion with tests
    // Based on http://members.chello.at/easyfilter/bresenham.html
    draw(xy, wh, color, fill, fillPattern = BpxFillPattern.primaryOnly, clippingRegion = null) {
        var _a;
        const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(xy.round(), xy.add(wh).round());
        if (xyMaxExclusive.x - xyMinInclusive.x <= 0 ||
            xyMaxExclusive.y - xyMinInclusive.y <= 0) {
            return;
        }
        // avoid all computations if the whole rectangle is outside the canvas
        if (xyMaxExclusive.x <= 0 ||
            xyMaxExclusive.y <= 0 ||
            xyMinInclusive.x >= __classPrivateFieldGet(this, _DrawEllipse_canvasPixels, "f").canvasSize.x ||
            xyMinInclusive.y >= __classPrivateFieldGet(this, _DrawEllipse_canvasPixels, "f").canvasSize.y) {
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
            ? (_a = __classPrivateFieldGet(this, _DrawEllipse_canvasPixels, "f").getSnapshot(c1.snapshotId)) !== null && _a !== void 0 ? _a : u_.throwError(`Tried to access a non-existent canvas snapshot of ID: ${c1.snapshotId}`)
            : null;
        const fp = fillPattern;
        const cr = clippingRegion;
        //
        // PREPARE
        //
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
            //
            // DRAW THE CURRENT PIXEL IN EACH QUADRANT
            //
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, right, bottom, c1, c2, fp, cr, sn);
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, left, bottom, c1, c2, fp, cr, sn);
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, left, top, c1, c2, fp, cr, sn);
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, right, top, c1, c2, fp, cr, sn);
            if (fill) {
                for (let x = left + 1; x < right; ++x) {
                    __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, x, top, c1, c2, fp, cr, sn);
                    __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, x, bottom, c1, c2, fp, cr, sn);
                }
            }
            //
            // STEP TO THE NEXT PIXEL
            //
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
        //
        // DRAW MISSING TOP & BOTTOM PARTS
        //
        while (bottom - top <= b) {
            // TODO: update the implementation below to honor fill pattern
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, left - 1, bottom, c1, c2, fp, cr, sn);
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, right + 1, bottom, c1, c2, fp, cr, sn);
            bottom += 1;
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, left - 1, top, c1, c2, fp, cr, sn);
            __classPrivateFieldGet(this, _DrawEllipse_instances, "m", _DrawEllipse_drawPixel).call(this, right + 1, top, c1, c2, fp, cr, sn);
            top -= 1;
        }
    }
}
_DrawEllipse_canvasPixels = new WeakMap(), _DrawEllipse_instances = new WeakSet(), _DrawEllipse_drawPixel = function _DrawEllipse_drawPixel(x, y, c1, c2, fillPattern, clippingRegion, snapshot) {
    if (!__classPrivateFieldGet(this, _DrawEllipse_canvasPixels, "f").canSetAt(x, y)) {
        return;
    }
    if (clippingRegion && !clippingRegion.allowsDrawingAt(x, y)) {
        return;
    }
    if (fillPattern.hasPrimaryColorAt(x, y)) {
        if (!c1) {
        }
        else if (c1 instanceof BpxSolidColor) {
            __classPrivateFieldGet(this, _DrawEllipse_canvasPixels, "f").set(c1, x, y);
        }
        else {
            const mapped = c1.getMappedColorFromCanvasSnapshot(snapshot !== null && snapshot !== void 0 ? snapshot : u_.throwError("Snapshot was not passed when trying to obtain a mapped color"), y * __classPrivateFieldGet(this, _DrawEllipse_canvasPixels, "f").canvasSize.x + x);
            if (mapped instanceof BpxSolidColor) {
                __classPrivateFieldGet(this, _DrawEllipse_canvasPixels, "f").set(mapped, x, y);
            }
        }
    }
    else {
        if (c2 != null) {
            __classPrivateFieldGet(this, _DrawEllipse_canvasPixels, "f").set(c2, x, y);
        }
    }
};
