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
var _DrawPixel_instances, _DrawPixel_canvasPixels, _DrawPixel_options, _DrawPixel_drawSolid;
import { BpxCompositeColor, BpxMappingColor, BpxSolidColor, } from "../Color";
import { u_ } from "../Utils";
import { v_0_0_ } from "../Vector2d";
import { BpxFillPattern } from "./FillPattern";
export class DrawPixel {
    constructor(canvasPixels, options = {}) {
        _DrawPixel_instances.add(this);
        _DrawPixel_canvasPixels.set(this, void 0);
        _DrawPixel_options.set(this, void 0);
        __classPrivateFieldSet(this, _DrawPixel_canvasPixels, canvasPixels, "f");
        __classPrivateFieldSet(this, _DrawPixel_options, options, "f");
    }
    // TODO: consolidate where composite color and fill patterns are handled (look for `instanceof`). Consider renaming fill pattern to e.g. pattern color as well
    // TODO: tests for MappingColor
    // TODO: consider moving fill pattern and composite color support inside here
    // TODO: cover ClippingRegion with tests
    draw(xy, color, clippingRegion = null, fillPattern = BpxFillPattern.primaryOnly) {
        var _a;
        xy = __classPrivateFieldGet(this, _DrawPixel_options, "f").disableRounding ? xy : xy.round();
        if (clippingRegion && !clippingRegion.allowsDrawingAt(xy)) {
            return;
        }
        if (xy.gte(v_0_0_) && xy.lt(__classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").canvasSize)) {
            const index = xy.y * __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").canvasSize.x + xy.x;
            if (fillPattern.hasPrimaryColorAt(xy)) {
                if (color instanceof BpxCompositeColor) {
                    __classPrivateFieldGet(this, _DrawPixel_instances, "m", _DrawPixel_drawSolid).call(this, index, color.primary);
                }
                else if (color instanceof BpxMappingColor) {
                    const snapshot = (_a = __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").getSnapshot(color.snapshotId)) !== null && _a !== void 0 ? _a : u_.throwError(`Tried to access a non-existent canvas snapshot of ID: ${color.snapshotId}`);
                    __classPrivateFieldGet(this, _DrawPixel_instances, "m", _DrawPixel_drawSolid).call(this, index, color.getMappedColorFromCanvasSnapshot(snapshot, index));
                }
                else {
                    __classPrivateFieldGet(this, _DrawPixel_instances, "m", _DrawPixel_drawSolid).call(this, index, color);
                }
            }
            else {
                if (color instanceof BpxCompositeColor) {
                    __classPrivateFieldGet(this, _DrawPixel_instances, "m", _DrawPixel_drawSolid).call(this, index, color.secondary);
                }
            }
        }
    }
}
_DrawPixel_canvasPixels = new WeakMap(), _DrawPixel_options = new WeakMap(), _DrawPixel_instances = new WeakSet(), _DrawPixel_drawSolid = function _DrawPixel_drawSolid(canvasIndex, color) {
    if (color instanceof BpxSolidColor) {
        __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").set(canvasIndex, color);
    }
};
