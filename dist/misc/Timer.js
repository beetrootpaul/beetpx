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
var _BpxTimer_frames, _BpxTimer_t;
export function timer_(frames) {
    return BpxTimer.for({ frames });
}
export class BpxTimer {
    static for(params) {
        return new BpxTimer(params);
    }
    constructor(params) {
        _BpxTimer_frames.set(this, void 0);
        _BpxTimer_t.set(this, 0);
        __classPrivateFieldSet(this, _BpxTimer_frames, Math.floor(params.frames), "f");
        this.restart();
    }
    get framesLeft() {
        return Math.max(0, __classPrivateFieldGet(this, _BpxTimer_t, "f"));
    }
    get progress() {
        return __classPrivateFieldGet(this, _BpxTimer_frames, "f") > 0 ? 1 - this.framesLeft / __classPrivateFieldGet(this, _BpxTimer_frames, "f") : 1;
    }
    get hasFinished() {
        return __classPrivateFieldGet(this, _BpxTimer_t, "f") <= 0;
    }
    get hasJustFinished() {
        return __classPrivateFieldGet(this, _BpxTimer_t, "f") == 0;
    }
    update() {
        __classPrivateFieldSet(this, _BpxTimer_t, Math.max(-1, __classPrivateFieldGet(this, _BpxTimer_t, "f") - 1), "f");
    }
    restart() {
        __classPrivateFieldSet(this, _BpxTimer_t, Math.max(0, __classPrivateFieldGet(this, _BpxTimer_frames, "f")), "f");
    }
}
_BpxTimer_frames = new WeakMap(), _BpxTimer_t = new WeakMap();
