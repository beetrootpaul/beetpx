"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Buttons_left, _Buttons_right, _Buttons_up, _Buttons_down, _Buttons_o, _Buttons_x;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buttons = void 0;
const Button_1 = require("./Button");
class Buttons {
    constructor() {
        _Buttons_left.set(this, new Button_1.Button());
        _Buttons_right.set(this, new Button_1.Button());
        _Buttons_up.set(this, new Button_1.Button());
        _Buttons_down.set(this, new Button_1.Button());
        _Buttons_o.set(this, new Button_1.Button());
        _Buttons_x.set(this, new Button_1.Button());
    }
    wasJustPressed(button) {
        switch (button) {
            case "left":
                return __classPrivateFieldGet(this, _Buttons_left, "f").wasJustPressed;
            case "right":
                return __classPrivateFieldGet(this, _Buttons_right, "f").wasJustPressed;
            case "up":
                return __classPrivateFieldGet(this, _Buttons_up, "f").wasJustPressed;
            case "down":
                return __classPrivateFieldGet(this, _Buttons_down, "f").wasJustPressed;
            case "o":
                return __classPrivateFieldGet(this, _Buttons_o, "f").wasJustPressed;
            case "x":
                return __classPrivateFieldGet(this, _Buttons_x, "f").wasJustPressed;
        }
    }
    wasJustReleased(button) {
        switch (button) {
            case "left":
                return __classPrivateFieldGet(this, _Buttons_left, "f").wasJustReleased;
            case "right":
                return __classPrivateFieldGet(this, _Buttons_right, "f").wasJustReleased;
            case "up":
                return __classPrivateFieldGet(this, _Buttons_up, "f").wasJustReleased;
            case "down":
                return __classPrivateFieldGet(this, _Buttons_down, "f").wasJustReleased;
            case "o":
                return __classPrivateFieldGet(this, _Buttons_o, "f").wasJustReleased;
            case "x":
                return __classPrivateFieldGet(this, _Buttons_x, "f").wasJustReleased;
        }
    }
    isPressed(button) {
        switch (button) {
            case "left":
                return __classPrivateFieldGet(this, _Buttons_left, "f").isPressed;
            case "right":
                return __classPrivateFieldGet(this, _Buttons_right, "f").isPressed;
            case "up":
                return __classPrivateFieldGet(this, _Buttons_up, "f").isPressed;
            case "down":
                return __classPrivateFieldGet(this, _Buttons_down, "f").isPressed;
            case "o":
                return __classPrivateFieldGet(this, _Buttons_o, "f").isPressed;
            case "x":
                return __classPrivateFieldGet(this, _Buttons_x, "f").isPressed;
        }
    }
    update(continuousInputEvents) {
        __classPrivateFieldGet(this, _Buttons_left, "f").update(continuousInputEvents.has("button_left"));
        __classPrivateFieldGet(this, _Buttons_right, "f").update(continuousInputEvents.has("button_right"));
        __classPrivateFieldGet(this, _Buttons_up, "f").update(continuousInputEvents.has("button_up"));
        __classPrivateFieldGet(this, _Buttons_down, "f").update(continuousInputEvents.has("button_down"));
        __classPrivateFieldGet(this, _Buttons_o, "f").update(continuousInputEvents.has("button_o"));
        __classPrivateFieldGet(this, _Buttons_x, "f").update(continuousInputEvents.has("button_x"));
    }
}
exports.Buttons = Buttons;
_Buttons_left = new WeakMap(), _Buttons_right = new WeakMap(), _Buttons_up = new WeakMap(), _Buttons_down = new WeakMap(), _Buttons_o = new WeakMap(), _Buttons_x = new WeakMap();
