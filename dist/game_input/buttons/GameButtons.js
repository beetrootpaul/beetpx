var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GameButtons_left, _GameButtons_right, _GameButtons_up, _GameButtons_down, _GameButtons_a, _GameButtons_b, _GameButtons_menu;
import { v_ } from "../../shorthands";
import { Button } from "./Button";
export class GameButtons {
    constructor() {
        _GameButtons_left.set(this, new Button());
        _GameButtons_right.set(this, new Button());
        _GameButtons_up.set(this, new Button());
        _GameButtons_down.set(this, new Button());
        _GameButtons_a.set(this, new Button());
        _GameButtons_b.set(this, new Button());
        _GameButtons_menu.set(this, new Button());
    }
    update(events) {
        __classPrivateFieldGet(this, _GameButtons_left, "f").update(events.has("button_left"));
        __classPrivateFieldGet(this, _GameButtons_right, "f").update(events.has("button_right"));
        __classPrivateFieldGet(this, _GameButtons_up, "f").update(events.has("button_up"));
        __classPrivateFieldGet(this, _GameButtons_down, "f").update(events.has("button_down"));
        __classPrivateFieldGet(this, _GameButtons_a, "f").update(events.has("button_a"));
        __classPrivateFieldGet(this, _GameButtons_b, "f").update(events.has("button_b"));
        __classPrivateFieldGet(this, _GameButtons_menu, "f").update(events.has("button_menu"));
    }
    isAnyPressed() {
        return (__classPrivateFieldGet(this, _GameButtons_left, "f").isPressed ||
            __classPrivateFieldGet(this, _GameButtons_right, "f").isPressed ||
            __classPrivateFieldGet(this, _GameButtons_up, "f").isPressed ||
            __classPrivateFieldGet(this, _GameButtons_down, "f").isPressed ||
            __classPrivateFieldGet(this, _GameButtons_a, "f").isPressed ||
            __classPrivateFieldGet(this, _GameButtons_b, "f").isPressed ||
            __classPrivateFieldGet(this, _GameButtons_menu, "f").isPressed);
    }
    isPressed(button) {
        switch (button) {
            case "left":
                return __classPrivateFieldGet(this, _GameButtons_left, "f").isPressed;
            case "right":
                return __classPrivateFieldGet(this, _GameButtons_right, "f").isPressed;
            case "up":
                return __classPrivateFieldGet(this, _GameButtons_up, "f").isPressed;
            case "down":
                return __classPrivateFieldGet(this, _GameButtons_down, "f").isPressed;
            case "a":
                return __classPrivateFieldGet(this, _GameButtons_a, "f").isPressed;
            case "b":
                return __classPrivateFieldGet(this, _GameButtons_b, "f").isPressed;
            case "menu":
                return __classPrivateFieldGet(this, _GameButtons_menu, "f").isPressed;
        }
    }
    getPressedDirection() {
        return v_((__classPrivateFieldGet(this, _GameButtons_left, "f").isPressed ? -1 : 0) + (__classPrivateFieldGet(this, _GameButtons_right, "f").isPressed ? 1 : 0), (__classPrivateFieldGet(this, _GameButtons_up, "f").isPressed ? -1 : 0) + (__classPrivateFieldGet(this, _GameButtons_down, "f").isPressed ? 1 : 0));
    }
    setButtonRepeating(button, repeating) {
        switch (button) {
            case "left":
                __classPrivateFieldGet(this, _GameButtons_left, "f").setRepeating(repeating);
                return;
            case "right":
                __classPrivateFieldGet(this, _GameButtons_right, "f").setRepeating(repeating);
                return;
            case "up":
                __classPrivateFieldGet(this, _GameButtons_up, "f").setRepeating(repeating);
                return;
            case "down":
                __classPrivateFieldGet(this, _GameButtons_down, "f").setRepeating(repeating);
                return;
            case "a":
                __classPrivateFieldGet(this, _GameButtons_a, "f").setRepeating(repeating);
                return;
            case "b":
                __classPrivateFieldGet(this, _GameButtons_b, "f").setRepeating(repeating);
                return;
            case "menu":
                __classPrivateFieldGet(this, _GameButtons_menu, "f").setRepeating(repeating);
                return;
        }
    }
    wasAnyJustPressed() {
        return (__classPrivateFieldGet(this, _GameButtons_left, "f").wasJustPressed ||
            __classPrivateFieldGet(this, _GameButtons_right, "f").wasJustPressed ||
            __classPrivateFieldGet(this, _GameButtons_up, "f").wasJustPressed ||
            __classPrivateFieldGet(this, _GameButtons_down, "f").wasJustPressed ||
            __classPrivateFieldGet(this, _GameButtons_a, "f").wasJustPressed ||
            __classPrivateFieldGet(this, _GameButtons_b, "f").wasJustPressed ||
            __classPrivateFieldGet(this, _GameButtons_menu, "f").wasJustPressed);
    }
    wasJustPressed(button) {
        switch (button) {
            case "left":
                return __classPrivateFieldGet(this, _GameButtons_left, "f").wasJustPressed;
            case "right":
                return __classPrivateFieldGet(this, _GameButtons_right, "f").wasJustPressed;
            case "up":
                return __classPrivateFieldGet(this, _GameButtons_up, "f").wasJustPressed;
            case "down":
                return __classPrivateFieldGet(this, _GameButtons_down, "f").wasJustPressed;
            case "a":
                return __classPrivateFieldGet(this, _GameButtons_a, "f").wasJustPressed;
            case "b":
                return __classPrivateFieldGet(this, _GameButtons_b, "f").wasJustPressed;
            case "menu":
                return __classPrivateFieldGet(this, _GameButtons_menu, "f").wasJustPressed;
        }
    }
    wasJustReleased(button) {
        switch (button) {
            case "left":
                return __classPrivateFieldGet(this, _GameButtons_left, "f").wasJustReleased;
            case "right":
                return __classPrivateFieldGet(this, _GameButtons_right, "f").wasJustReleased;
            case "up":
                return __classPrivateFieldGet(this, _GameButtons_up, "f").wasJustReleased;
            case "down":
                return __classPrivateFieldGet(this, _GameButtons_down, "f").wasJustReleased;
            case "a":
                return __classPrivateFieldGet(this, _GameButtons_a, "f").wasJustReleased;
            case "b":
                return __classPrivateFieldGet(this, _GameButtons_b, "f").wasJustReleased;
            case "menu":
                return __classPrivateFieldGet(this, _GameButtons_menu, "f").wasJustReleased;
        }
    }
}
_GameButtons_left = new WeakMap(), _GameButtons_right = new WeakMap(), _GameButtons_up = new WeakMap(), _GameButtons_down = new WeakMap(), _GameButtons_a = new WeakMap(), _GameButtons_b = new WeakMap(), _GameButtons_menu = new WeakMap();
