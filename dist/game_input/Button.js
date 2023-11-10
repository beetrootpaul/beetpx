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
var _a, _Button_repeatingFramesStart, _Button_repeatingFramesInterval, _Button_isPressed, _Button_wasJustToggled, _Button_repeatingTimer;
import { BpxTimer } from "../misc/Timer";
import { BpxUtils } from "../Utils";
export class Button {
    constructor() {
        _Button_isPressed.set(this, false);
        _Button_wasJustToggled.set(this, false);
        _Button_repeatingTimer.set(this, null);
    }
    static get repeatingFramesStart() {
        return __classPrivateFieldGet(Button, _a, "f", _Button_repeatingFramesStart);
    }
    static get repeatingFramesInterval() {
        return __classPrivateFieldGet(Button, _a, "f", _Button_repeatingFramesInterval);
    }
    static setRepeatingParamsFor(updateFps) {
        __classPrivateFieldSet(Button, _a, updateFps === 30
            ? 15
            : updateFps === 60
                ? 30
                : BpxUtils.throwError(`Unsupported desiredUpdateFps: ${updateFps}`), "f", _Button_repeatingFramesStart);
        __classPrivateFieldSet(Button, _a, updateFps === 30
            ? 4
            : updateFps === 60
                ? 8
                : BpxUtils.throwError(`Unsupported desiredUpdateFps: ${updateFps}`), "f", _Button_repeatingFramesInterval);
    }
    get isPressed() {
        return __classPrivateFieldGet(this, _Button_isPressed, "f");
    }
    wasJustPressed(repeating) {
        var _b;
        return ((__classPrivateFieldGet(this, _Button_wasJustToggled, "f") && __classPrivateFieldGet(this, _Button_isPressed, "f")) ||
            (repeating && !!((_b = __classPrivateFieldGet(this, _Button_repeatingTimer, "f")) === null || _b === void 0 ? void 0 : _b.hasFinished)));
    }
    wasJustReleased(repeating) {
        var _b;
        return ((__classPrivateFieldGet(this, _Button_wasJustToggled, "f") && !__classPrivateFieldGet(this, _Button_isPressed, "f")) ||
            (repeating && !!((_b = __classPrivateFieldGet(this, _Button_repeatingTimer, "f")) === null || _b === void 0 ? void 0 : _b.hasFinished)));
    }
    update(isPressed) {
        var _b, _c;
        __classPrivateFieldSet(this, _Button_wasJustToggled, __classPrivateFieldGet(this, _Button_isPressed, "f") !== isPressed, "f");
        __classPrivateFieldSet(this, _Button_isPressed, isPressed, "f");
        if (isPressed && ((_b = __classPrivateFieldGet(this, _Button_repeatingTimer, "f")) === null || _b === void 0 ? void 0 : _b.hasFinished)) {
            __classPrivateFieldSet(this, _Button_repeatingTimer, new BpxTimer({
                frames: Button.repeatingFramesInterval,
            }), "f");
        }
        (_c = __classPrivateFieldGet(this, _Button_repeatingTimer, "f")) === null || _c === void 0 ? void 0 : _c.update();
        if (isPressed && __classPrivateFieldGet(this, _Button_wasJustToggled, "f")) {
            __classPrivateFieldSet(this, _Button_repeatingTimer, new BpxTimer({
                frames: Button.repeatingFramesStart,
            }), "f");
        }
        if (!isPressed && __classPrivateFieldGet(this, _Button_repeatingTimer, "f")) {
            __classPrivateFieldSet(this, _Button_repeatingTimer, null, "f");
        }
    }
}
_a = Button, _Button_isPressed = new WeakMap(), _Button_wasJustToggled = new WeakMap(), _Button_repeatingTimer = new WeakMap();
_Button_repeatingFramesStart = { value: 30 };
_Button_repeatingFramesInterval = { value: 8 };
