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
var _CanvasForProduction_instances, _CanvasForProduction_length, _CanvasForProduction_htmlCanvas, _CanvasForProduction_htmlCanvasContext, _CanvasForProduction_offscreenContext, _CanvasForProduction_offscreenImageData, _CanvasForProduction_initializeAsNonTransparent;
import { v_ } from "../misc/Vector2d";
import { u_ } from "../Utils";
import { Canvas } from "./Canvas";
import { CanvasSnapshotForProduction } from "./CanvasSnapshotForProduction";
export class CanvasForProduction extends Canvas {
    constructor(canvasSize, htmlCanvas, htmlCanvasBackground) {
        super(canvasSize);
        _CanvasForProduction_instances.add(this);
        _CanvasForProduction_length.set(this, void 0);
        _CanvasForProduction_htmlCanvas.set(this, void 0);
        _CanvasForProduction_htmlCanvasContext.set(this, void 0);
        _CanvasForProduction_offscreenContext.set(this, void 0);
        _CanvasForProduction_offscreenImageData.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasForProduction_length, canvasSize.x * canvasSize.y, "f");
        __classPrivateFieldSet(this, _CanvasForProduction_htmlCanvas, htmlCanvas, "f");
        __classPrivateFieldGet(this, _CanvasForProduction_htmlCanvas, "f").style.backgroundColor = htmlCanvasBackground.cssHex;
        __classPrivateFieldSet(this, _CanvasForProduction_htmlCanvasContext, __classPrivateFieldGet(this, _CanvasForProduction_htmlCanvas, "f").getContext("2d", {
            colorSpace: "srgb",
            
            alpha: true,
        }) ?? u_.throwError("Was unable to obtain '2d' context from <canvas>"), "f");
        __classPrivateFieldGet(this, _CanvasForProduction_htmlCanvasContext, "f").imageSmoothingEnabled = false;
        const offscreenCanvas = document
            .createElement("canvas")
            .transferControlToOffscreen();
        offscreenCanvas.width = canvasSize.x;
        offscreenCanvas.height = canvasSize.y;
        __classPrivateFieldSet(this, _CanvasForProduction_offscreenContext, offscreenCanvas.getContext("2d", {
            colorSpace: "srgb",
            
            alpha: false,
        }) ??
            u_.throwError("Was unable to obtain '2d' context from OffscreenCanvas"), "f");
        __classPrivateFieldSet(this, _CanvasForProduction_offscreenImageData, __classPrivateFieldGet(this, _CanvasForProduction_offscreenContext, "f").createImageData(__classPrivateFieldGet(this, _CanvasForProduction_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _CanvasForProduction_offscreenContext, "f").canvas.height, { colorSpace: "srgb" }), "f");
        __classPrivateFieldGet(this, _CanvasForProduction_instances, "m", _CanvasForProduction_initializeAsNonTransparent).call(this);
    }
    set(color, x, y) {
        if (x < 0 || y < 0 || x >= this.canvasSize.x || y >= this.canvasSize.y) {
            throw Error(`(x,y) index out of bounds: (x,y) = (${x},${y}), bottom bound = (0,0), upper bound = (${this.canvasSize.x - 1},${this.canvasSize.y - 1})`);
        }
        const index = y * this.canvasSize.x + x;
        if (index >= __classPrivateFieldGet(this, _CanvasForProduction_length, "f")) {
            throw Error(`index out of bounds: index = ${index}, max allowed index = ${__classPrivateFieldGet(this, _CanvasForProduction_length, "f") - 1}`);
        }
        const dataIndex = index * 4;
        __classPrivateFieldGet(this, _CanvasForProduction_offscreenImageData, "f").data[dataIndex] = color.r;
        __classPrivateFieldGet(this, _CanvasForProduction_offscreenImageData, "f").data[dataIndex + 1] = color.g;
        __classPrivateFieldGet(this, _CanvasForProduction_offscreenImageData, "f").data[dataIndex + 2] = color.b;
    }
    newSnapshot() {
        return new CanvasSnapshotForProduction(__classPrivateFieldGet(this, _CanvasForProduction_offscreenImageData, "f").data.slice());
    }
    doRender() {
        __classPrivateFieldGet(this, _CanvasForProduction_offscreenContext, "f").putImageData(__classPrivateFieldGet(this, _CanvasForProduction_offscreenImageData, "f"), 0, 0);
        const htmlCanvasSize = v_(__classPrivateFieldGet(this, _CanvasForProduction_htmlCanvas, "f").width, __classPrivateFieldGet(this, _CanvasForProduction_htmlCanvas, "f").height);
        const scaleToFill = Math.max(1, Math.min(htmlCanvasSize.div(this.canvasSize).floor().x, htmlCanvasSize.div(this.canvasSize).floor().y));
        const centeringOffset = htmlCanvasSize
            .sub(this.canvasSize.mul(scaleToFill))
            .div(2)
            .floor();
        __classPrivateFieldGet(this, _CanvasForProduction_htmlCanvasContext, "f").drawImage(__classPrivateFieldGet(this, _CanvasForProduction_offscreenContext, "f").canvas, 0, 0, __classPrivateFieldGet(this, _CanvasForProduction_offscreenContext, "f").canvas.width, __classPrivateFieldGet(this, _CanvasForProduction_offscreenContext, "f").canvas.height, centeringOffset.x, centeringOffset.y, scaleToFill * this.canvasSize.x, scaleToFill * this.canvasSize.y);
    }
}
_CanvasForProduction_length = new WeakMap(), _CanvasForProduction_htmlCanvas = new WeakMap(), _CanvasForProduction_htmlCanvasContext = new WeakMap(), _CanvasForProduction_offscreenContext = new WeakMap(), _CanvasForProduction_offscreenImageData = new WeakMap(), _CanvasForProduction_instances = new WeakSet(), _CanvasForProduction_initializeAsNonTransparent = function _CanvasForProduction_initializeAsNonTransparent() {
    for (let i = 3; i < __classPrivateFieldGet(this, _CanvasForProduction_offscreenImageData, "f").data.length; i += 4) {
        __classPrivateFieldGet(this, _CanvasForProduction_offscreenImageData, "f").data[i] = 0xff;
    }
};
