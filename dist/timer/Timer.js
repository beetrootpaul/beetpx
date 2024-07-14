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
var _BpxTimer_instances, _BpxTimer_frames, _BpxTimer_loop, _BpxTimer_ignoreGlobalPause, _BpxTimer_isPaused, _BpxTimer_offsetFrame, _BpxTimer_pausedFrame, _BpxTimer_fn_get, _BpxTimer_tRaw_get;
import { BeetPx } from "../BeetPx";
import { clamp } from "../utils/clamp";
import { mod } from "../utils/mod";
export class BpxTimer {
    static for(opts) {
        return new BpxTimer(opts);
    }
    constructor(opts) {
        _BpxTimer_instances.add(this);
        _BpxTimer_frames.set(this, void 0);
        _BpxTimer_loop.set(this, void 0);
        _BpxTimer_ignoreGlobalPause.set(this, void 0);
        _BpxTimer_isPaused.set(this, void 0);
        _BpxTimer_offsetFrame.set(this, void 0);
        _BpxTimer_pausedFrame.set(this, void 0);
        __classPrivateFieldSet(this, _BpxTimer_ignoreGlobalPause, opts.onGamePause === "ignore", "f");
        __classPrivateFieldSet(this, _BpxTimer_frames, Math.max(0, Math.round(opts.frames)), "f");
        __classPrivateFieldSet(this, _BpxTimer_loop, opts.loop, "f");
        __classPrivateFieldSet(this, _BpxTimer_offsetFrame, __classPrivateFieldGet(this, _BpxTimer_instances, "a", _BpxTimer_fn_get) + opts.delayFrames, "f");
        __classPrivateFieldSet(this, _BpxTimer_isPaused, false, "f");
        __classPrivateFieldSet(this, _BpxTimer_pausedFrame, null, "f");
        if (opts.pause) {
            this.pause();
        }
    }
    get t() {
        return (__classPrivateFieldGet(this, _BpxTimer_loop, "f") ?
            __classPrivateFieldGet(this, _BpxTimer_instances, "a", _BpxTimer_tRaw_get) >= 0 ?
                mod(__classPrivateFieldGet(this, _BpxTimer_instances, "a", _BpxTimer_tRaw_get), __classPrivateFieldGet(this, _BpxTimer_frames, "f"))
                : 0
            : clamp(0, __classPrivateFieldGet(this, _BpxTimer_instances, "a", _BpxTimer_tRaw_get), __classPrivateFieldGet(this, _BpxTimer_frames, "f")));
    }
    get framesLeft() {
        return __classPrivateFieldGet(this, _BpxTimer_frames, "f") - this.t;
    }
    get progress() {
        return __classPrivateFieldGet(this, _BpxTimer_frames, "f") > 0 ? this.t / __classPrivateFieldGet(this, _BpxTimer_frames, "f") : 1;
    }
    get hasFinished() {
        return __classPrivateFieldGet(this, _BpxTimer_instances, "a", _BpxTimer_tRaw_get) >= __classPrivateFieldGet(this, _BpxTimer_frames, "f");
    }
    get hasJustFinished() {
        return (__classPrivateFieldGet(this, _BpxTimer_frames, "f") > 0 ?
            __classPrivateFieldGet(this, _BpxTimer_loop, "f") ?
                __classPrivateFieldGet(this, _BpxTimer_instances, "a", _BpxTimer_tRaw_get) > 0 && this.t === 0
                : __classPrivateFieldGet(this, _BpxTimer_instances, "a", _BpxTimer_tRaw_get) === __classPrivateFieldGet(this, _BpxTimer_frames, "f")
            : __classPrivateFieldGet(this, _BpxTimer_loop, "f") ? true
                : __classPrivateFieldGet(this, _BpxTimer_instances, "a", _BpxTimer_tRaw_get) === 0);
    }
    pause() {
        if (__classPrivateFieldGet(this, _BpxTimer_isPaused, "f"))
            return;
        __classPrivateFieldSet(this, _BpxTimer_isPaused, true, "f");
        __classPrivateFieldSet(this, _BpxTimer_pausedFrame, __classPrivateFieldGet(this, _BpxTimer_instances, "a", _BpxTimer_fn_get), "f");
    }
    resume() {
        if (!__classPrivateFieldGet(this, _BpxTimer_isPaused, "f"))
            return;
        __classPrivateFieldSet(this, _BpxTimer_isPaused, false, "f");
        __classPrivateFieldSet(this, _BpxTimer_offsetFrame, __classPrivateFieldGet(this, _BpxTimer_offsetFrame, "f") + (__classPrivateFieldGet(this, _BpxTimer_instances, "a", _BpxTimer_fn_get) - (__classPrivateFieldGet(this, _BpxTimer_pausedFrame, "f") ?? 0)), "f");
        __classPrivateFieldSet(this, _BpxTimer_pausedFrame, null, "f");
    }
    restart() {
        __classPrivateFieldSet(this, _BpxTimer_offsetFrame, __classPrivateFieldGet(this, _BpxTimer_instances, "a", _BpxTimer_fn_get), "f");
        __classPrivateFieldSet(this, _BpxTimer_pausedFrame, null, "f");
        __classPrivateFieldSet(this, _BpxTimer_isPaused, false, "f");
    }
}
_BpxTimer_frames = new WeakMap(), _BpxTimer_loop = new WeakMap(), _BpxTimer_ignoreGlobalPause = new WeakMap(), _BpxTimer_isPaused = new WeakMap(), _BpxTimer_offsetFrame = new WeakMap(), _BpxTimer_pausedFrame = new WeakMap(), _BpxTimer_instances = new WeakSet(), _BpxTimer_fn_get = function _BpxTimer_fn_get() {
    return __classPrivateFieldGet(this, _BpxTimer_ignoreGlobalPause, "f") ?
        BeetPx.frameNumber
        : BeetPx.frameNumberOutsidePause;
}, _BpxTimer_tRaw_get = function _BpxTimer_tRaw_get() {
    return (__classPrivateFieldGet(this, _BpxTimer_pausedFrame, "f") ?? __classPrivateFieldGet(this, _BpxTimer_instances, "a", _BpxTimer_fn_get)) - __classPrivateFieldGet(this, _BpxTimer_offsetFrame, "f");
};
