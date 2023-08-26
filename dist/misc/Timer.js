// TODO: update to be based on passed time and not on frame numbers
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
var _a, _Timer_zeroThreshold, _Timer_secondsTotal, _Timer_secondsLeft;
export class Timer {
    constructor(seconds) {
        _Timer_secondsTotal.set(this, void 0);
        _Timer_secondsLeft.set(this, void 0);
        __classPrivateFieldSet(this, _Timer_secondsTotal, Math.max(0, seconds), "f");
        __classPrivateFieldSet(this, _Timer_secondsLeft, __classPrivateFieldGet(this, _Timer_secondsTotal, "f"), "f");
    }
    /**
     * How many seconds has left until the timer ends.
     */
    get left() {
        return __classPrivateFieldGet(this, _Timer_secondsLeft, "f");
    }
    get progress() {
        return __classPrivateFieldGet(this, _Timer_secondsTotal, "f") > 0
            ? 1 - __classPrivateFieldGet(this, _Timer_secondsLeft, "f") / __classPrivateFieldGet(this, _Timer_secondsTotal, "f")
            : 1;
    }
    get hasFinished() {
        return __classPrivateFieldGet(this, _Timer_secondsLeft, "f") <= 0 || __classPrivateFieldGet(this, _Timer_secondsTotal, "f") <= 0;
    }
    update(secondsPassed) {
        __classPrivateFieldSet(this, _Timer_secondsLeft, Math.max(0, __classPrivateFieldGet(this, _Timer_secondsLeft, "f") - secondsPassed), "f");
        if (__classPrivateFieldGet(this, _Timer_secondsLeft, "f") <= __classPrivateFieldGet(Timer, _a, "f", _Timer_zeroThreshold)) {
            __classPrivateFieldSet(this, _Timer_secondsLeft, 0, "f");
        }
    }
}
_a = Timer, _Timer_secondsTotal = new WeakMap(), _Timer_secondsLeft = new WeakMap();
_Timer_zeroThreshold = { value: 1e-8 };
