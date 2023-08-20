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
var _Button_isPressed, _Button_wasJustToggled, _Button_repeatingTimer;
import { Timer } from "../misc/Timer";
export class Button {
    constructor() {
        _Button_isPressed.set(this, false);
        _Button_wasJustToggled.set(this, false);
        _Button_repeatingTimer.set(this, null);
    }
    get isPressed() {
        return __classPrivateFieldGet(this, _Button_isPressed, "f");
    }
    wasJustPressed(repeating) {
        var _a;
        return ((__classPrivateFieldGet(this, _Button_wasJustToggled, "f") && __classPrivateFieldGet(this, _Button_isPressed, "f")) ||
            (repeating && !!((_a = __classPrivateFieldGet(this, _Button_repeatingTimer, "f")) === null || _a === void 0 ? void 0 : _a.hasFinished)));
    }
    wasJustReleased(repeating) {
        var _a;
        return ((__classPrivateFieldGet(this, _Button_wasJustToggled, "f") && !__classPrivateFieldGet(this, _Button_isPressed, "f")) ||
            (repeating && !!((_a = __classPrivateFieldGet(this, _Button_repeatingTimer, "f")) === null || _a === void 0 ? void 0 : _a.hasFinished)));
    }
    update(isPressed) {
        var _a, _b;
        __classPrivateFieldSet(this, _Button_wasJustToggled, __classPrivateFieldGet(this, _Button_isPressed, "f") !== isPressed, "f");
        __classPrivateFieldSet(this, _Button_isPressed, isPressed, "f");
        if (isPressed && ((_a = __classPrivateFieldGet(this, _Button_repeatingTimer, "f")) === null || _a === void 0 ? void 0 : _a.hasFinished)) {
            __classPrivateFieldSet(this, _Button_repeatingTimer, new Timer({
                frames: Button.repeatingFramesInterval,
            }), "f");
        }
        (_b = __classPrivateFieldGet(this, _Button_repeatingTimer, "f")) === null || _b === void 0 ? void 0 : _b.update();
        if (isPressed && __classPrivateFieldGet(this, _Button_wasJustToggled, "f")) {
            __classPrivateFieldSet(this, _Button_repeatingTimer, new Timer({ frames: Button.repeatingFramesStart }), "f");
        }
        if (!isPressed && __classPrivateFieldGet(this, _Button_repeatingTimer, "f")) {
            __classPrivateFieldSet(this, _Button_repeatingTimer, null, "f");
        }
    }
}
_Button_isPressed = new WeakMap(), _Button_wasJustToggled = new WeakMap(), _Button_repeatingTimer = new WeakMap();
// TODO: these numbers work good for 60 FPS. Make them depending on FPS to have the same durations in seconds
Button.repeatingFramesStart = 30;
Button.repeatingFramesInterval = 8;
