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
var _CanvasPixelsForProduction_instances, _CanvasPixelsForProduction_length, _CanvasPixelsForProduction_htmlCanvas, _CanvasPixelsForProduction_htmlCanvasContext, _CanvasPixelsForProduction_offscreenContext, _CanvasPixelsForProduction_offscreenImageData, _CanvasPixelsForProduction_minX, _CanvasPixelsForProduction_minY, _CanvasPixelsForProduction_maxX, _CanvasPixelsForProduction_maxY, _CanvasPixelsForProduction_initializeAsNonTransparent;
import { u_ } from "../../Utils";
import { BpxVector2d } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsForProductionSnapshot } from "./CanvasPixelsForProductionSnapshot";
export class CanvasPixelsForProduction extends CanvasPixels {
    constructor(canvasSize, htmlCanvas, htmlCanvasBackground) {
        var _a, _b;
        super(canvasSize);
        _CanvasPixelsForProduction_instances.add(this);
        _CanvasPixelsForProduction_length.set(this, void 0);
        _CanvasPixelsForProduction_htmlCanvas.set(this, void 0);
        _CanvasPixelsForProduction_htmlCanvasContext.set(this, void 0);
        _CanvasPixelsForProduction_offscreenContext.set(this, void 0);
        _CanvasPixelsForProduction_offscreenImageData.set(this, void 0);
        _CanvasPixelsForProduction_minX.set(this, void 0);
        _CanvasPixelsForProduction_minY.set(this, void 0);
        _CanvasPixelsForProduction_maxX.set(this, void 0);
        _CanvasPixelsForProduction_maxY.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_length, canvasSize.x * canvasSize.y, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_minX, 0, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_minY, 0, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_maxX, canvasSize.x - 1, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_maxY, canvasSize.y - 1, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_htmlCanvas, htmlCanvas, "f");
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvas, "f").style.backgroundColor = htmlCanvasBackground.asRgbCssHex();
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_htmlCanvasContext, (_a = __classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvas, "f").getContext("2d", {
            colorSpace: "srgb",
            // we allow transparency in order ot make background color visible around the game itself
            alpha: true,
        })) !== null && _a !== void 0 ? _a : u_.throwError("Was unable to obtain '2d' context from <canvas>"), "f");
        const offscreenCanvas = document
            .createElement("canvas")
            .transferControlToOffscreen();
        offscreenCanvas.width = canvasSize.x;
        offscreenCanvas.height = canvasSize.y;
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_offscreenContext, (_b = offscreenCanvas.getContext("2d", {
            colorSpace: "srgb",
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
            alpha: false,
        })) !== null && _b !== void 0 ? _b : u_.throwError("Was unable to obtain '2d' context from OffscreenCanvas"), "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_offscreenImageData, __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").createImageData(__classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").canvas.height, { colorSpace: "srgb" }), "f");
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_instances, "m", _CanvasPixelsForProduction_initializeAsNonTransparent).call(this);
    }
    setClippingRegion(xy, wh) {
        const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(xy.round(), xy.add(wh).round());
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_minX, xyMinInclusive.x, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_minY, xyMinInclusive.y, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_maxX, xyMaxExclusive.x - 1, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_maxY, xyMaxExclusive.y - 1, "f");
    }
    removeClippingRegion() {
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_minX, 0, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_minY, 0, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_maxX, this.canvasSize.x - 1, "f");
        __classPrivateFieldSet(this, _CanvasPixelsForProduction_maxY, this.canvasSize.y - 1, "f");
    }
    canSetAny(xMin, yMin, xMax, yMax) {
        return (xMax >= __classPrivateFieldGet(this, _CanvasPixelsForProduction_minX, "f") &&
            yMax >= __classPrivateFieldGet(this, _CanvasPixelsForProduction_minY, "f") &&
            xMin <= __classPrivateFieldGet(this, _CanvasPixelsForProduction_maxX, "f") &&
            yMin <= __classPrivateFieldGet(this, _CanvasPixelsForProduction_maxY, "f"));
    }
    canSetAt(x, y) {
        return (x >= __classPrivateFieldGet(this, _CanvasPixelsForProduction_minX, "f") && y >= __classPrivateFieldGet(this, _CanvasPixelsForProduction_minY, "f") && x <= __classPrivateFieldGet(this, _CanvasPixelsForProduction_maxX, "f") && y <= __classPrivateFieldGet(this, _CanvasPixelsForProduction_maxY, "f"));
    }
    set(color, x, y) {
        if (x < 0 || y < 0 || x >= this.canvasSize.x || y >= this.canvasSize.y) {
            throw Error(`(x,y) index out of bounds: (x,y) = (${x},${y}), bottom bound = (0,0), upper bound = (${this.canvasSize.x - 1},${this.canvasSize.y - 1})`);
        }
        const index = y * this.canvasSize.x + x;
        if (index >= __classPrivateFieldGet(this, _CanvasPixelsForProduction_length, "f")) {
            throw Error(`index out of bounds: index = ${index}, max allowed index = ${__classPrivateFieldGet(this, _CanvasPixelsForProduction_length, "f") - 1}`);
        }
        const dataIndex = index * 4;
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f").data[dataIndex] = color.r;
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f").data[dataIndex + 1] = color.g;
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f").data[dataIndex + 2] = color.b;
    }
    newSnapshot() {
        return new CanvasPixelsForProductionSnapshot(__classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f").data.slice());
    }
    onWindowResize() {
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
        // this.#htmlCanvas.width =
        //   this.#htmlCanvas.getBoundingClientRect().width * window.devicePixelRatio;
        // this.#htmlCanvas.height =
        //   this.#htmlCanvas.getBoundingClientRect().height * window.devicePixelRatio;
        // seems like we have to set it every time the canvas size is changed
        // this.#htmlCanvasContext.imageSmoothingEnabled = false;
    }
    doRender() {
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").putImageData(__classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f"), 0, 0);
        // const htmlCanvasSize = v_(this.#htmlCanvas.width, this.#htmlCanvas.height);
        // const scaleToFill = Math.max(
        //   1,
        //   Math.min(
        //     htmlCanvasSize.div(this.canvasSize).floor().x,
        //     htmlCanvasSize.div(this.canvasSize).floor().y,
        //   ),
        // );
        // const centeringOffset = htmlCanvasSize
        //   .sub(this.canvasSize.mul(scaleToFill))
        //   .div(2)
        //   .floor();
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_htmlCanvasContext, "f").drawImage(__classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").canvas, 0, 0, __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenContext, "f").canvas.height);
        // console.group("RENDER");
        // console.log(scaleToFill);
        // console.log(
        //   `${scaleToFill * this.canvasSize.x} x ${scaleToFill * this.canvasSize.y}`,
        // );
        // console.groupEnd();
    }
}
_CanvasPixelsForProduction_length = new WeakMap(), _CanvasPixelsForProduction_htmlCanvas = new WeakMap(), _CanvasPixelsForProduction_htmlCanvasContext = new WeakMap(), _CanvasPixelsForProduction_offscreenContext = new WeakMap(), _CanvasPixelsForProduction_offscreenImageData = new WeakMap(), _CanvasPixelsForProduction_minX = new WeakMap(), _CanvasPixelsForProduction_minY = new WeakMap(), _CanvasPixelsForProduction_maxX = new WeakMap(), _CanvasPixelsForProduction_maxY = new WeakMap(), _CanvasPixelsForProduction_instances = new WeakSet(), _CanvasPixelsForProduction_initializeAsNonTransparent = function _CanvasPixelsForProduction_initializeAsNonTransparent() {
    for (let i = 3; i < __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f").data.length; i += 4) {
        __classPrivateFieldGet(this, _CanvasPixelsForProduction_offscreenImageData, "f").data[i] = 0xff;
    }
};
