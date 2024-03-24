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
var _Button_instances, _Button_isPressed, _Button_wasJustToggled, _Button_firstRepeatFrames, _Button_loopedRepeatFrames, _Button_repeatingTimer, _Button_isRepeatingEnabled_get;
import { timerSeq_ } from "../../timer/TimerSequence";
export class Button {
    constructor() {
        _Button_instances.add(this);
        _Button_isPressed.set(this, false);
        _Button_wasJustToggled.set(this, false);
        _Button_firstRepeatFrames.set(this, null);
        _Button_loopedRepeatFrames.set(this, null);
        _Button_repeatingTimer.set(this, null);
    }
    setRepeating(params) {
        __classPrivateFieldSet(this, _Button_firstRepeatFrames, params.firstRepeatFrames, "f");
        __classPrivateFieldSet(this, _Button_loopedRepeatFrames, params.loopedRepeatFrames, "f");
    }
    get isPressed() {
        return __classPrivateFieldGet(this, _Button_isPressed, "f");
    }
    get wasJustPressed() {
        return ((__classPrivateFieldGet(this, _Button_wasJustToggled, "f") && __classPrivateFieldGet(this, _Button_isPressed, "f")) ||
            (__classPrivateFieldGet(this, _Button_instances, "a", _Button_isRepeatingEnabled_get) &&
                __classPrivateFieldGet(this, _Button_repeatingTimer, "f")?.justFinishedPhase != null));
    }
    get wasJustReleased() {
        return ((__classPrivateFieldGet(this, _Button_wasJustToggled, "f") && !__classPrivateFieldGet(this, _Button_isPressed, "f")) ||
            (__classPrivateFieldGet(this, _Button_instances, "a", _Button_isRepeatingEnabled_get) &&
                __classPrivateFieldGet(this, _Button_repeatingTimer, "f")?.justFinishedPhase != null));
    }
    update(isPressed) {
        if (isPressed) {
            if (__classPrivateFieldGet(this, _Button_wasJustToggled, "f") && __classPrivateFieldGet(this, _Button_instances, "a", _Button_isRepeatingEnabled_get)) {
                __classPrivateFieldSet(this, _Button_repeatingTimer, timerSeq_({
                    intro: __classPrivateFieldGet(this, _Button_firstRepeatFrames, "f")
                        ? [["first", __classPrivateFieldGet(this, _Button_firstRepeatFrames, "f")]]
                        : undefined,
                    loop: __classPrivateFieldGet(this, _Button_loopedRepeatFrames, "f")
                        ? [["looped", __classPrivateFieldGet(this, _Button_loopedRepeatFrames, "f")]]
                        : undefined,
                }), "f");
            }
        }
        else {
            __classPrivateFieldSet(this, _Button_repeatingTimer, null, "f");
        }
        __classPrivateFieldSet(this, _Button_wasJustToggled, __classPrivateFieldGet(this, _Button_isPressed, "f") !== isPressed, "f");
        __classPrivateFieldSet(this, _Button_isPressed, isPressed, "f");
    }
}
_Button_isPressed = new WeakMap(), _Button_wasJustToggled = new WeakMap(), _Button_firstRepeatFrames = new WeakMap(), _Button_loopedRepeatFrames = new WeakMap(), _Button_repeatingTimer = new WeakMap(), _Button_instances = new WeakSet(), _Button_isRepeatingEnabled_get = function _Button_isRepeatingEnabled_get() {
    return __classPrivateFieldGet(this, _Button_firstRepeatFrames, "f") != null || __classPrivateFieldGet(this, _Button_loopedRepeatFrames, "f") != null;
};
