var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _FpsCounter_fallbackFps, _FpsCounter_samples, _FpsCounter_nextIndex, _FpsCounter_averageFps;
export class FpsCounter {
    constructor(params) {
        _FpsCounter_samples.set(this, void 0);
        _FpsCounter_nextIndex.set(this, void 0);
        _FpsCounter_averageFps.set(this, void 0);
        __classPrivateFieldSet(this, _FpsCounter_samples, Array.from({ length: params.bufferSize }, () => __classPrivateFieldGet(FpsCounter, _a, "f", _FpsCounter_fallbackFps)), "f");
        __classPrivateFieldSet(this, _FpsCounter_nextIndex, 0, "f");
        __classPrivateFieldSet(this, _FpsCounter_averageFps, __classPrivateFieldGet(FpsCounter, _a, "f", _FpsCounter_fallbackFps), "f");
    }
    get averageFps() {
        return __classPrivateFieldGet(this, _FpsCounter_averageFps, "f");
    }
    track(fps) {
        var _b, _c;
        __classPrivateFieldGet(this, _FpsCounter_samples, "f")[__classPrivateFieldSet(this, _FpsCounter_nextIndex, (_c = __classPrivateFieldGet(this, _FpsCounter_nextIndex, "f"), _b = _c++, _c), "f"), _b] = fps;
        __classPrivateFieldSet(this, _FpsCounter_nextIndex, __classPrivateFieldGet(this, _FpsCounter_nextIndex, "f") % __classPrivateFieldGet(this, _FpsCounter_samples, "f").length, "f");
        __classPrivateFieldSet(this, _FpsCounter_averageFps, Math.floor(__classPrivateFieldGet(this, _FpsCounter_samples, "f").reduce((sum, nextSample) => sum + nextSample, 0) /
            __classPrivateFieldGet(this, _FpsCounter_samples, "f").length), "f");
    }
}
_a = FpsCounter, _FpsCounter_samples = new WeakMap(), _FpsCounter_nextIndex = new WeakMap(), _FpsCounter_averageFps = new WeakMap();
_FpsCounter_fallbackFps = { value: 1 };
