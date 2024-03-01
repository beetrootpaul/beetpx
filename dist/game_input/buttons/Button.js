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
var _a, _Button_repeatingFramesStart, _Button_repeatingFramesInterval, _Button_repeatingTimer, _Button_nextRepeatingTimer, _Button_isPressed, _Button_wasJustToggled;
import { timerSeq_ } from "../../timer/TimerSequence";
import { BpxUtils } from "../../Utils";
export class Button {
    constructor() {
        _Button_repeatingTimer.set(this, null);
        _Button_nextRepeatingTimer.set(this, null);
        _Button_isPressed.set(this, false);
        _Button_wasJustToggled.set(this, false);
    }
    
    static get repeatingFramesStart() {
        return __classPrivateFieldGet(_a, _a, "f", _Button_repeatingFramesStart);
    }
    
    static get repeatingFramesInterval() {
        return __classPrivateFieldGet(_a, _a, "f", _Button_repeatingFramesInterval);
    }
    
    static configureRepeatingParamsFor(updateFps) {
        __classPrivateFieldSet(_a, _a, updateFps === 30
            ? 15
            : updateFps === 60
                ? 30
                : BpxUtils.throwError(`Unsupported desiredUpdateFps: ${updateFps}`), "f", _Button_repeatingFramesStart);
        __classPrivateFieldSet(_a, _a, updateFps === 30
            ? 4
            : updateFps === 60
                ? 8
                : BpxUtils.throwError(`Unsupported desiredUpdateFps: ${updateFps}`), "f", _Button_repeatingFramesInterval);
    }
    get isPressed() {
        return __classPrivateFieldGet(this, _Button_isPressed, "f");
    }
    get wasJustPressed() {
        return ((__classPrivateFieldGet(this, _Button_wasJustToggled, "f") && __classPrivateFieldGet(this, _Button_isPressed, "f")) ||
            !!__classPrivateFieldGet(this, _Button_repeatingTimer, "f")?.justFinishedPhase);
    }
    get wasJustReleased() {
        return ((__classPrivateFieldGet(this, _Button_wasJustToggled, "f") && !__classPrivateFieldGet(this, _Button_isPressed, "f")) ||
            !!__classPrivateFieldGet(this, _Button_repeatingTimer, "f")?.justFinishedPhase);
    }
    makeRepeating(initialFrames, intervalFrames) {
        initialFrames = Math.round(initialFrames);
        intervalFrames = Math.round(intervalFrames);
        __classPrivateFieldSet(this, _Button_nextRepeatingTimer, timerSeq_({
            intro: initialFrames > 0 ? [["initial", initialFrames]] : undefined,
            loop: intervalFrames > 0 ? [["interval", intervalFrames]] : undefined,
        }, { pause: true }), "f");
    }
    makeNotRepeating() {
        __classPrivateFieldSet(this, _Button_repeatingTimer, null, "f");
        __classPrivateFieldSet(this, _Button_nextRepeatingTimer, null, "f");
    }
    update(isPressed) {
        __classPrivateFieldSet(this, _Button_wasJustToggled, __classPrivateFieldGet(this, _Button_isPressed, "f") !== isPressed, "f");
        __classPrivateFieldSet(this, _Button_isPressed, isPressed, "f");
        if (__classPrivateFieldGet(this, _Button_wasJustToggled, "f")) {
            if (isPressed) {
                __classPrivateFieldGet(this, _Button_repeatingTimer, "f")?.resume();
            }
            else if (!isPressed) {
                if (__classPrivateFieldGet(this, _Button_nextRepeatingTimer, "f")) {
                    __classPrivateFieldSet(this, _Button_repeatingTimer, __classPrivateFieldGet(this, _Button_nextRepeatingTimer, "f"), "f");
                    __classPrivateFieldSet(this, _Button_nextRepeatingTimer, null, "f");
                }
                __classPrivateFieldGet(this, _Button_repeatingTimer, "f")?.restart();
                __classPrivateFieldGet(this, _Button_repeatingTimer, "f")?.pause();
            }
        }
    }
}
_a = Button, _Button_repeatingTimer = new WeakMap(), _Button_nextRepeatingTimer = new WeakMap(), _Button_isPressed = new WeakMap(), _Button_wasJustToggled = new WeakMap();

_Button_repeatingFramesStart = { value: 30 };
_Button_repeatingFramesInterval = { value: 8 };
