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
var _FpsLoggerAverage_samples, _FpsLoggerAverage_nextIndex, _FpsLoggerAverage_averageFps;
export class FpsLoggerNoop {
    // TODO: rework to *always* count average FPS and only decided whether to *log* it to the console.
    //       Probably there will be no need for FpsLoggerNoop vs FpsLoggerAverage.
    //       Or maybe even just make logging dependent on *debug* flag.
    get mostRecentAverageFps() {
        return 1;
    }
    track(_fps) { }
}
// TODO: does it even still work?
export class FpsLoggerAverage {
    constructor() {
        _FpsLoggerAverage_samples.set(this, Array.from({ length: 60 }));
        _FpsLoggerAverage_nextIndex.set(this, 0);
        _FpsLoggerAverage_averageFps.set(this, 1);
    }
    get mostRecentAverageFps() {
        return __classPrivateFieldGet(this, _FpsLoggerAverage_averageFps, "f");
    }
    track(fps) {
        var _a, _b;
        __classPrivateFieldGet(this, _FpsLoggerAverage_samples, "f")[__classPrivateFieldSet(this, _FpsLoggerAverage_nextIndex, (_b = __classPrivateFieldGet(this, _FpsLoggerAverage_nextIndex, "f"), _a = _b++, _b), "f"), _a] = fps;
        __classPrivateFieldSet(this, _FpsLoggerAverage_nextIndex, __classPrivateFieldGet(this, _FpsLoggerAverage_nextIndex, "f") % __classPrivateFieldGet(this, _FpsLoggerAverage_samples, "f").length, "f");
        if (__classPrivateFieldGet(this, _FpsLoggerAverage_nextIndex, "f") === 0) {
            const s = __classPrivateFieldGet(this, _FpsLoggerAverage_samples, "f").reduce((sum, nextFps) => sum + nextFps, 0);
            __classPrivateFieldSet(this, _FpsLoggerAverage_averageFps, Math.floor(s / __classPrivateFieldGet(this, _FpsLoggerAverage_samples, "f").length), "f");
        }
    }
}
_FpsLoggerAverage_samples = new WeakMap(), _FpsLoggerAverage_nextIndex = new WeakMap(), _FpsLoggerAverage_averageFps = new WeakMap();
