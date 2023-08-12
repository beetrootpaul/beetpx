"use strict";
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
var _Button_isPressed, _Button_wasJustToggled;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
// TODO: implement a PICO-8 like button press detection which starts to repeat after certain threshold
class Button {
    constructor() {
        _Button_isPressed.set(this, false);
        _Button_wasJustToggled.set(this, false);
    }
    get wasJustPressed() {
        return __classPrivateFieldGet(this, _Button_wasJustToggled, "f") && __classPrivateFieldGet(this, _Button_isPressed, "f");
    }
    get wasJustReleased() {
        return __classPrivateFieldGet(this, _Button_wasJustToggled, "f") && !__classPrivateFieldGet(this, _Button_isPressed, "f");
    }
    get isPressed() {
        return __classPrivateFieldGet(this, _Button_isPressed, "f");
    }
    update(isPressed) {
        __classPrivateFieldSet(this, _Button_wasJustToggled, __classPrivateFieldGet(this, _Button_isPressed, "f") !== isPressed, "f");
        __classPrivateFieldSet(this, _Button_isPressed, isPressed, "f");
    }
}
exports.Button = Button;
_Button_isPressed = new WeakMap(), _Button_wasJustToggled = new WeakMap();
