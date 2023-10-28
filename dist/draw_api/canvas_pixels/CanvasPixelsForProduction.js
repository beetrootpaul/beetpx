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
var _CanvasPixelsForProduction_instances, _CanvasPixelsForProduction_length, _CanvasPixelsForProduction_visited, _CanvasPixelsForProduction_htmlCanvas, _CanvasPixelsForProduction_htmlCanvasContext, _CanvasPixelsForProduction_offscreenContext, _CanvasPixelsForProduction_offscreenImageData, _CanvasPixelsForProduction_initializeAsNonTransparent;
import { u_ } from "../../Utils";
import { v_ } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsForProductionSnapshot } from "./CanvasPixelsForProductionSnapshot";
// TODO: rename, like, seriously…
export class CanvasPixelsForProduction extends CanvasPixels {
    constructor(canvasSize, htmlCanvas, htmlCanvasBackground) {
        var _a, _b;
        super(canvasSize);
        _CanvasPixelsForProduction_instances.add(this);
        _CanvasPixelsForProduction_length.set(this, void 0);
        _CanvasPixelsForProduction_visited.set(this, void 0);
        _CanvasPixelsForProduction_htmlCanvas.set(this, void 0);
        _CanvasPixelsForProduction_htmlCanvasContext.set(this, void 0);
        _CanvasPixelsForProduction_offscreenContext.set(this, void 0);
        _CanvasPixelsForProduction_offscreenImageData.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_length, canvasSize.x * canvasSize.y, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_visited, u_.range(__classPrivateFieldGet(this, _CanvasPixelsForProduction_length, "f")).map(() => false), "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_htmlCanvas, htmlCanvas, "f");
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvas, "f").style.backgroundColor = htmlCanvasBackground.asRgbCssHex();
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_htmlCanvasContext, (_a = __classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvas, "f").getContext("2d", {
            // we allow transparency in order ot make background color visible around the game itself
            alpha: true,
        })) !== null && _a !== void 0 ? _a : u_.throwError("CanvasPixels2d: Was unable to obtain '2d' context from <canvas>"), "f");
        const offscreenCanvas = document
            .createElement("canvas")
            .transferControlToOffscreen();
        offscreenCanvas.width = canvasSize.x;
        offscreenCanvas.height = canvasSize.y;
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_offscreenContext, (_b = offscreenCanvas.getContext("2d", {
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
            alpha: false,
        })) !== null && _b !== void 0 ? _b : u_.throwError("CanvasPixels2d: Was unable to obtain '2d' context from OffscreenCanvas"), "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_offscreenImageData, __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").createImageData(__classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").canvas.height), "f");
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_instances, "m", _CanvasPixelsForProduction_initializeAsNonTransparent).call(this);
    }
    wasAlreadySet(x, y) {
        const index = y * this.canvasSize.x + x;
        if (index < 0 || index >= __classPrivateFieldGet(this, _CanvasPixelsForProduction_length, "f")) {
            return true;
        }
        return __classPrivateFieldGet(this, _CanvasPixelsForProduction_visited, "f")[index];
    }
    set(color, x, y) {
        const index = y * this.canvasSize.x + x;
        if (index >= __classPrivateFieldGet(this, _CanvasPixelsForProduction_length, "f")) {
            throw Error(`CanvasPixels2d: index out of bounds: index = ${index}, maxAllowedIndex = ${__classPrivateFieldGet(this, _CanvasPixelsForProduction_length, "f") - 1}`);
        }
        const dataIndex = index * 4;
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f").data[dataIndex] = color.r;
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f").data[dataIndex + 1] = color.g;
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f").data[dataIndex + 2] = color.b;
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_visited, "f")[index] = true;
    }
    newSnapshot() {
        return new CanvasPixelsForProductionSnapshot(new Uint8ClampedArray(__classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f").data));
    }
    onWindowResize() {
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvas, "f").width =
            __classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvas, "f").getBoundingClientRect().width * window.devicePixelRatio;
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvas, "f").height =
            __classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvas, "f").getBoundingClientRect().height * window.devicePixelRatio;
        // seems like we have to set it every time the canvas size is changed
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvasContext, "f").imageSmoothingEnabled = false;
    }
    resetVisitedMarkers() {
        for (let index = 0; index < __classPrivateFieldGet(this, _CanvasPixelsForProduction_length, "f"); index++) {
            __classPrivateFieldGet(this, _CanvasPixelsForProduction_visited, "f")[index] = false;
        }
    }
    doRender() {
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").putImageData(__classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f"), 0, 0);
        const htmlCanvasSize = v_(__classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvas, "f").width, __classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvas, "f").height);
        const scaleToFill = Math.min(htmlCanvasSize.div(this.canvasSize).floor().x, htmlCanvasSize.div(this.canvasSize).floor().y);
        const centeringOffset = htmlCanvasSize
            .sub(this.canvasSize.mul(scaleToFill))
            .div(2)
            .floor();
        // TODO: does the fitting algorithm take DPI into account? Maybe it would allow low res game to occupy more space?
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvasContext, "f").drawImage(__classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").canvas, 0, 0, __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").canvas.height, centeringOffset.x, centeringOffset.y, scaleToFill * this.canvasSize.x, scaleToFill * this.canvasSize.y);
    }
}
_CanvasPixelsForProduction_length = new WeakMap(), _CanvasPixelsForProduction_visited = new WeakMap(), _CanvasPixelsForProduction_htmlCanvas = new WeakMap(), _CanvasPixelsForProduction_htmlCanvasContext = new WeakMap(), _CanvasPixelsForProduction_offscreenContext = new WeakMap(), _CanvasPixelsForProduction_offscreenImageData = new WeakMap(), _CanvasPixelsForProduction_instances = new WeakSet(), _CanvasPixelsForProduction_initializeAsNonTransparent = function _CanvasPixelsForProduction_initializeAsNonTransparent() {
    for (let i = 3; i < __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f").data.length; i += 4) {
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f").data[i] = 0xff;
    }
};
