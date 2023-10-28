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
var _DrawPixel_canvasPixels, _DrawPixel_options;
import { BpxCompositeColor, BpxMappingColor, BpxSolidColor, } from "../Color";
import { u_ } from "../Utils";
import { BpxFillPattern } from "./FillPattern";
export class DrawPixel {
    constructor(canvasPixels, options = {}) {
        _DrawPixel_canvasPixels.set(this, void 0);
        _DrawPixel_options.set(this, void 0);
        __classPrivateFieldSet(this, _DrawPixel_canvasPixels, canvasPixels, "f");
        __classPrivateFieldSet(this, _DrawPixel_options, options, "f");
    }
    // TODO: consolidate where composite color and fill patterns are handled (look for `instanceof`). Consider renaming fill pattern to e.g. pattern color as well
    // TODO: tests for MappingColor
    // TODO: consider moving fill pattern and composite color support inside here
    // TODO: cover ClippingRegion with tests
    draw(x, y, color, fillPattern = BpxFillPattern.primaryOnly, clippingRegion = null) {
        var _a;
        x = __classPrivateFieldGet(this, _DrawPixel_options, "f").disableRounding ? x : Math.round(x);
        y = __classPrivateFieldGet(this, _DrawPixel_options, "f").disableRounding ? y : Math.round(y);
        if (!__classPrivateFieldGet(this, _DrawPixel_options, "f").disableVisitedCheck &&
            __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").wasAlreadySet(x, y)) {
            return;
        }
        if (clippingRegion && !clippingRegion.allowsDrawingAt(x, y)) {
            return;
        }
        if (x >= 0 &&
            y >= 0 &&
            x < __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").canvasSize.x &&
            y < __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").canvasSize.y) {
            if (fillPattern.hasPrimaryColorAt(x, y)) {
                if (color instanceof BpxSolidColor) {
                    __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").set(color, x, y);
                }
                else if (color instanceof BpxCompositeColor) {
                    if (color.primary instanceof BpxSolidColor) {
                        __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").set(color.primary, x, y);
                    }
                }
                else if (color instanceof BpxMappingColor) {
                    const snapshot = (_a = __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").getSnapshot(color.snapshotId)) !== null && _a !== void 0 ? _a : u_.throwError(`Tried to access a non-existent canvas snapshot of ID: ${color.snapshotId}`);
                    const mapped = color.getMappedColorFromCanvasSnapshot(snapshot, y * __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").canvasSize.x + x);
                    if (mapped instanceof BpxSolidColor) {
                        __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").set(mapped, x, y);
                    }
                }
            }
            else {
                if (color instanceof BpxCompositeColor) {
                    if (color.secondary instanceof BpxSolidColor) {
                        __classPrivateFieldGet(this, _DrawPixel_canvasPixels, "f").set(color.secondary, x, y);
                    }
                }
            }
        }
    }
}
_DrawPixel_canvasPixels = new WeakMap(), _DrawPixel_options = new WeakMap();
