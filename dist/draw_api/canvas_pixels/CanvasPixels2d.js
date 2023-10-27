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
var _CanvasPixels2d_instances, _CanvasPixels2d_length, _CanvasPixels2d_rgbValues, _CanvasPixels2d_visited, _CanvasPixels2d_htmlCanvas, _CanvasPixels2d_htmlCanvasContext, _CanvasPixels2d_offscreenContext, _CanvasPixels2d_offscreenImageData, _CanvasPixels2d_initializeAsNonTransparent;
import { u_ } from "../../Utils";
import { v_ } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixels2dSnapshot } from "./CanvasPixels2dSnapshot";
// TODO: rename to express the "occupancy check" aspect
export class CanvasPixels2d extends CanvasPixels {
    constructor(canvasSize, htmlCanvas, htmlCanvasBackground) {
        var _a, _b;
        super(canvasSize);
        _CanvasPixels2d_instances.add(this);
        _CanvasPixels2d_length.set(this, void 0);
        _CanvasPixels2d_rgbValues.set(this, void 0);
        _CanvasPixels2d_visited.set(this, void 0);
        _CanvasPixels2d_htmlCanvas.set(this, void 0);
        _CanvasPixels2d_htmlCanvasContext.set(this, void 0);
        _CanvasPixels2d_offscreenContext.set(this, void 0);
        _CanvasPixels2d_offscreenImageData.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasPixels2d_length, canvasSize.x * canvasSize.y, "f");
        __classPrivateFieldSet(this, _CanvasPixels2d_rgbValues, u_.range(__classPrivateFieldGet(this, _CanvasPixels2d_length, "f")).map(() => 0), "f");
        __classPrivateFieldSet(this, _CanvasPixels2d_visited, u_.range(__classPrivateFieldGet(this, _CanvasPixels2d_length, "f")).map(() => false), "f");
        __classPrivateFieldSet(this, _CanvasPixels2d_htmlCanvas, htmlCanvas, "f");
        __classPrivateFieldGet(this, _CanvasPixels2d_htmlCanvas, "f").style.backgroundColor = htmlCanvasBackground.asRgbCssHex();
        __classPrivateFieldSet(this, _CanvasPixels2d_htmlCanvasContext, (_a = __classPrivateFieldGet(this, _CanvasPixels2d_htmlCanvas, "f").getContext("2d", {
            // we allow transparency in order ot make background color visible around the game itself
            alpha: true,
        })) !== null && _a !== void 0 ? _a : u_.throwError("CanvasPixels2d: Was unable to obtain '2d' context from <canvas>"), "f");
        const offscreenCanvas = document
            .createElement("canvas")
            .transferControlToOffscreen();
        offscreenCanvas.width = canvasSize.x;
        offscreenCanvas.height = canvasSize.y;
        __classPrivateFieldSet(this, _CanvasPixels2d_offscreenContext, (_b = offscreenCanvas.getContext("2d", {
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
            alpha: false,
        })) !== null && _b !== void 0 ? _b : u_.throwError("CanvasPixels2d: Was unable to obtain '2d' context from OffscreenCanvas"), "f");
        __classPrivateFieldSet(this, _CanvasPixels2d_offscreenImageData, __classPrivateFieldGet(this, _CanvasPixels2d_offscreenContext, "f").createImageData(__classPrivateFieldGet(this, _CanvasPixels2d_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _CanvasPixels2d_offscreenContext, "f").canvas.height), "f");
        __classPrivateFieldGet(this, _CanvasPixels2d_instances, "m", _CanvasPixels2d_initializeAsNonTransparent).call(this);
    }
    wasAlreadySet(xOrIndex, y) {
        // transform x and y to index, if needed
        xOrIndex =
            typeof y === "number" ? y * this.canvasSize.x + xOrIndex : xOrIndex;
        if (xOrIndex < 0 || xOrIndex >= __classPrivateFieldGet(this, _CanvasPixels2d_length, "f")) {
            return true;
        }
        return __classPrivateFieldGet(this, _CanvasPixels2d_visited, "f")[xOrIndex];
    }
    set(index, color) {
        if (index >= __classPrivateFieldGet(this, _CanvasPixels2d_length, "f")) {
            throw Error(`CanvasPixels2d: index out of bounds: index = ${index}, maxAllowedIndex = ${__classPrivateFieldGet(this, _CanvasPixels2d_length, "f") - 1}`);
        }
        __classPrivateFieldGet(this, _CanvasPixels2d_rgbValues, "f")[index] = (color.r << 16) + (color.g << 8) + color.b;
        __classPrivateFieldGet(this, _CanvasPixels2d_visited, "f")[index] = true;
    }
    newSnapshot() {
        return new CanvasPixels2dSnapshot([...__classPrivateFieldGet(this, _CanvasPixels2d_rgbValues, "f")]);
    }
    onWindowResize() {
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
        __classPrivateFieldGet(this, _CanvasPixels2d_htmlCanvas, "f").width =
            __classPrivateFieldGet(this, _CanvasPixels2d_htmlCanvas, "f").getBoundingClientRect().width * window.devicePixelRatio;
        __classPrivateFieldGet(this, _CanvasPixels2d_htmlCanvas, "f").height =
            __classPrivateFieldGet(this, _CanvasPixels2d_htmlCanvas, "f").getBoundingClientRect().height * window.devicePixelRatio;
        // seems like we have to set it every time the canvas size is changed
        __classPrivateFieldGet(this, _CanvasPixels2d_htmlCanvasContext, "f").imageSmoothingEnabled = false;
    }
    resetVisitedMarkers() {
        for (let index = 0; index < __classPrivateFieldGet(this, _CanvasPixels2d_length, "f"); index++) {
            __classPrivateFieldGet(this, _CanvasPixels2d_visited, "f")[index] = false;
        }
    }
    doRender() {
        for (let index = 0; index < __classPrivateFieldGet(this, _CanvasPixels2d_length, "f"); index++) {
            const value = __classPrivateFieldGet(this, _CanvasPixels2d_rgbValues, "f")[index];
            const dataIndex = index * 4;
            __classPrivateFieldGet(this, _CanvasPixels2d_offscreenImageData, "f").data[dataIndex] = (value & 0xff0000) >> 16;
            __classPrivateFieldGet(this, _CanvasPixels2d_offscreenImageData, "f").data[dataIndex + 1] = (value & 0x00ff00) >> 8;
            __classPrivateFieldGet(this, _CanvasPixels2d_offscreenImageData, "f").data[dataIndex + 2] = value & 0x0000ff;
        }
        __classPrivateFieldGet(this, _CanvasPixels2d_offscreenContext, "f").putImageData(__classPrivateFieldGet(this, _CanvasPixels2d_offscreenImageData, "f"), 0, 0);
        const htmlCanvasSize = v_(__classPrivateFieldGet(this, _CanvasPixels2d_htmlCanvas, "f").width, __classPrivateFieldGet(this, _CanvasPixels2d_htmlCanvas, "f").height);
        const scaleToFill = Math.min(htmlCanvasSize.div(this.canvasSize).floor().x, htmlCanvasSize.div(this.canvasSize).floor().y);
        const centeringOffset = htmlCanvasSize
            .sub(this.canvasSize.mul(scaleToFill))
            .div(2)
            .floor();
        // TODO: does the fitting algorithm take DPI into account? Maybe it would allow low res game to occupy more space?
        __classPrivateFieldGet(this, _CanvasPixels2d_htmlCanvasContext, "f").drawImage(__classPrivateFieldGet(this, _CanvasPixels2d_offscreenContext, "f").canvas, 0, 0, __classPrivateFieldGet(this, _CanvasPixels2d_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _CanvasPixels2d_offscreenContext, "f").canvas.height, centeringOffset.x, centeringOffset.y, scaleToFill * this.canvasSize.x, scaleToFill * this.canvasSize.y);
    }
}
_CanvasPixels2d_length = new WeakMap(), _CanvasPixels2d_rgbValues = new WeakMap(), _CanvasPixels2d_visited = new WeakMap(), _CanvasPixels2d_htmlCanvas = new WeakMap(), _CanvasPixels2d_htmlCanvasContext = new WeakMap(), _CanvasPixels2d_offscreenContext = new WeakMap(), _CanvasPixels2d_offscreenImageData = new WeakMap(), _CanvasPixels2d_instances = new WeakSet(), _CanvasPixels2d_initializeAsNonTransparent = function _CanvasPixels2d_initializeAsNonTransparent() {
    for (let i = 3; i < __classPrivateFieldGet(this, _CanvasPixels2d_offscreenImageData, "f").data.length; i += 4) {
        __classPrivateFieldGet(this, _CanvasPixels2d_offscreenImageData, "f").data[i] = 0xff;
    }
};
