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
var _FpsDisplay_drawApi, _FpsDisplay_color, _FpsDisplay_xy, _FpsDisplay_recentSamples, _FpsDisplay_nextSampleIndex, _FpsDisplay_lastCalculatedAverageFps;
import { font_pico8_, rgb_p8_, v_ } from "../shorthands";
import { BpxUtils } from "../utils/Utils";
export class FpsDisplay {
    constructor(drawApi, canvasSize, params) {
        _FpsDisplay_drawApi.set(this, void 0);
        _FpsDisplay_color.set(this, void 0);
        _FpsDisplay_xy.set(this, void 0);
        _FpsDisplay_recentSamples.set(this, void 0);
        _FpsDisplay_nextSampleIndex.set(this, void 0);
        _FpsDisplay_lastCalculatedAverageFps.set(this, void 0);
        __classPrivateFieldSet(this, _FpsDisplay_drawApi, drawApi, "f");
        __classPrivateFieldSet(this, _FpsDisplay_color, params.color ?? rgb_p8_.orange, "f");
        const placement = params.placement ?? "top-right";
        __classPrivateFieldSet(this, _FpsDisplay_xy, v_(placement.endsWith("-left") ? 1 : canvasSize.x - 3 * 4, placement.startsWith("top-") ? 1 : canvasSize.y - 5), "f");
        __classPrivateFieldSet(this, _FpsDisplay_recentSamples, Array.from({ length: 15 }, () => 0), "f");
        __classPrivateFieldSet(this, _FpsDisplay_nextSampleIndex, 0, "f");
        __classPrivateFieldSet(this, _FpsDisplay_lastCalculatedAverageFps, 0, "f");
    }
    
    drawRenderingFps(renderingFps) {
        __classPrivateFieldGet(this, _FpsDisplay_recentSamples, "f")[__classPrivateFieldGet(this, _FpsDisplay_nextSampleIndex, "f")] = renderingFps;
        __classPrivateFieldSet(this, _FpsDisplay_nextSampleIndex, BpxUtils.mod(__classPrivateFieldGet(this, _FpsDisplay_nextSampleIndex, "f") + 1, __classPrivateFieldGet(this, _FpsDisplay_recentSamples, "f").length), "f");
        if (__classPrivateFieldGet(this, _FpsDisplay_nextSampleIndex, "f") === 0) {
            __classPrivateFieldSet(this, _FpsDisplay_lastCalculatedAverageFps, 0, "f");
            for (const sample of __classPrivateFieldGet(this, _FpsDisplay_recentSamples, "f")) {
                __classPrivateFieldSet(this, _FpsDisplay_lastCalculatedAverageFps, __classPrivateFieldGet(this, _FpsDisplay_lastCalculatedAverageFps, "f") + sample, "f");
            }
            __classPrivateFieldSet(this, _FpsDisplay_lastCalculatedAverageFps, __classPrivateFieldGet(this, _FpsDisplay_lastCalculatedAverageFps, "f") / __classPrivateFieldGet(this, _FpsDisplay_recentSamples, "f").length, "f");
        }
        const prevFont = __classPrivateFieldGet(this, _FpsDisplay_drawApi, "f").useFont(font_pico8_);
        __classPrivateFieldGet(this, _FpsDisplay_drawApi, "f").drawText(__classPrivateFieldGet(this, _FpsDisplay_lastCalculatedAverageFps, "f").toFixed(), __classPrivateFieldGet(this, _FpsDisplay_xy, "f").add(__classPrivateFieldGet(this, _FpsDisplay_drawApi, "f").cameraXy), __classPrivateFieldGet(this, _FpsDisplay_color, "f"));
        __classPrivateFieldGet(this, _FpsDisplay_drawApi, "f").useFont(prevFont);
    }
}
_FpsDisplay_drawApi = new WeakMap(), _FpsDisplay_color = new WeakMap(), _FpsDisplay_xy = new WeakMap(), _FpsDisplay_recentSamples = new WeakMap(), _FpsDisplay_nextSampleIndex = new WeakMap(), _FpsDisplay_lastCalculatedAverageFps = new WeakMap();
