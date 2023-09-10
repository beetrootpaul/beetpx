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
var _Timer_frames, _Timer_t;
export class Timer {
    constructor(params) {
        _Timer_frames.set(this, void 0);
        _Timer_t.set(this, void 0);
        __classPrivateFieldSet(this, _Timer_frames, Math.floor(params.frames), "f");
        __classPrivateFieldSet(this, _Timer_t, Math.max(0, __classPrivateFieldGet(this, _Timer_frames, "f")), "f");
    }
    get framesLeft() {
        return __classPrivateFieldGet(this, _Timer_t, "f");
    }
    get progress() {
        return __classPrivateFieldGet(this, _Timer_frames, "f") > 0 ? 1 - __classPrivateFieldGet(this, _Timer_t, "f") / __classPrivateFieldGet(this, _Timer_frames, "f") : 1;
    }
    get hasFinished() {
        return __classPrivateFieldGet(this, _Timer_t, "f") <= 0 || __classPrivateFieldGet(this, _Timer_frames, "f") <= 0;
    }
    update() {
        __classPrivateFieldSet(this, _Timer_t, Math.max(0, __classPrivateFieldGet(this, _Timer_t, "f") - 1), "f");
    }
    // TODO: cover with tests
    restart() {
        __classPrivateFieldSet(this, _Timer_t, Math.max(0, __classPrivateFieldGet(this, _Timer_frames, "f")), "f");
    }
}
_Timer_frames = new WeakMap(), _Timer_t = new WeakMap();
