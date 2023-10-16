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
var _DrawPixel_instances, _DrawPixel_canvasBytes, _DrawPixel_canvasSize, _DrawPixel_options, _DrawPixel_drawSolid;
import { BpxCompositeColor, BpxMappingColor, BpxSolidColor, } from "../Color";
import { v_0_0_ } from "../Vector2d";
import { BpxFillPattern } from "./FillPattern";
export class DrawPixel {
    constructor(canvasBytes, canvasSize, options = {}) {
        _DrawPixel_instances.add(this);
        _DrawPixel_canvasBytes.set(this, void 0);
        _DrawPixel_canvasSize.set(this, void 0);
        _DrawPixel_options.set(this, void 0);
        __classPrivateFieldSet(this, _DrawPixel_canvasBytes, canvasBytes, "f");
        __classPrivateFieldSet(this, _DrawPixel_canvasSize, canvasSize, "f");
        __classPrivateFieldSet(this, _DrawPixel_options, options, "f");
    }
    // TODO: consolidate where composite color and fill patterns are handled (look for `instanceof`). Consider renaming fill pattern to e.g. pattern color as well
    // TODO: tests for MappingColor
    // TODO: consider moving fill pattern and composite color support inside here
    // TODO: cover ClippingRegion with tests
    draw(xy, color, clippingRegion = null, fillPattern = BpxFillPattern.primaryOnly) {
        xy = __classPrivateFieldGet(this, _DrawPixel_options, "f").disableRounding ? xy : xy.round();
        if (clippingRegion && !clippingRegion.allowsDrawingAt(xy)) {
            return;
        }
        if (xy.gte(v_0_0_) && xy.lt(__classPrivateFieldGet(this, _DrawPixel_canvasSize, "f"))) {
            const i = 4 * (xy.y * __classPrivateFieldGet(this, _DrawPixel_canvasSize, "f").x + xy.x);
            if (fillPattern.hasPrimaryColorAt(xy)) {
                if (color instanceof BpxCompositeColor) {
                    __classPrivateFieldGet(this, _DrawPixel_instances, "m", _DrawPixel_drawSolid).call(this, i, color.primary);
                }
                else if (color instanceof BpxMappingColor) {
                    // TODO: this doesn't seem right: to wire mapping with snapshot outside the mapped color, even though it contains both
                    const mappedColor = color.getMappedColorForCanvasIndex(color.canvasSnapshot.canvasBytes[i], color.canvasSnapshot.canvasBytes[i + 1], color.canvasSnapshot.canvasBytes[i + 2], color.canvasSnapshot.canvasBytes[i + 3]);
                    __classPrivateFieldGet(this, _DrawPixel_instances, "m", _DrawPixel_drawSolid).call(this, i, mappedColor);
                }
                else {
                    __classPrivateFieldGet(this, _DrawPixel_instances, "m", _DrawPixel_drawSolid).call(this, i, color);
                }
            }
            else {
                if (color instanceof BpxCompositeColor) {
                    __classPrivateFieldGet(this, _DrawPixel_instances, "m", _DrawPixel_drawSolid).call(this, i, color.secondary);
                }
            }
        }
    }
}
_DrawPixel_canvasBytes = new WeakMap(), _DrawPixel_canvasSize = new WeakMap(), _DrawPixel_options = new WeakMap(), _DrawPixel_instances = new WeakSet(), _DrawPixel_drawSolid = function _DrawPixel_drawSolid(canvasIndex, color) {
    if (color instanceof BpxSolidColor) {
        __classPrivateFieldGet(this, _DrawPixel_canvasBytes, "f")[canvasIndex] = color.r;
        __classPrivateFieldGet(this, _DrawPixel_canvasBytes, "f")[canvasIndex + 1] = color.g;
        __classPrivateFieldGet(this, _DrawPixel_canvasBytes, "f")[canvasIndex + 2] = color.b;
        __classPrivateFieldGet(this, _DrawPixel_canvasBytes, "f")[canvasIndex + 3] = 0xff;
    }
};
