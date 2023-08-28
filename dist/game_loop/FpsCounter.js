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
var _FpsCounter_samples, _FpsCounter_nextSampleIndex, _FpsCounter_millisTotal;
// TODO: cover this with tests
export class FpsCounter {
    constructor(params) {
        _FpsCounter_samples.set(this, void 0);
        _FpsCounter_nextSampleIndex.set(this, 0);
        _FpsCounter_millisTotal.set(this, 0);
        __classPrivateFieldSet(this, _FpsCounter_samples, Array.from({ length: params.historySize }, () => 0), "f");
    }
    get averageFps() {
        return Math.floor(__classPrivateFieldGet(this, _FpsCounter_samples, "f").length * (1000 / (__classPrivateFieldGet(this, _FpsCounter_millisTotal, "f") || 1)));
    }
    track(deltaTime) {
        __classPrivateFieldSet(this, _FpsCounter_millisTotal, __classPrivateFieldGet(this, _FpsCounter_millisTotal, "f") - __classPrivateFieldGet(this, _FpsCounter_samples, "f")[__classPrivateFieldGet(this, _FpsCounter_nextSampleIndex, "f")], "f");
        __classPrivateFieldGet(this, _FpsCounter_samples, "f")[__classPrivateFieldGet(this, _FpsCounter_nextSampleIndex, "f")] = deltaTime;
        __classPrivateFieldSet(this, _FpsCounter_millisTotal, __classPrivateFieldGet(this, _FpsCounter_millisTotal, "f") + deltaTime, "f");
        __classPrivateFieldSet(this, _FpsCounter_nextSampleIndex, (__classPrivateFieldGet(this, _FpsCounter_nextSampleIndex, "f") + 1) % __classPrivateFieldGet(this, _FpsCounter_samples, "f").length, "f");
    }
}
_FpsCounter_samples = new WeakMap(), _FpsCounter_nextSampleIndex = new WeakMap(), _FpsCounter_millisTotal = new WeakMap();
