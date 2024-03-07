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
var _GameButtons_left, _GameButtons_right, _GameButtons_up, _GameButtons_down, _GameButtons_a, _GameButtons_b, _GameButtons_menu, _GameButtons_repeatingLeft, _GameButtons_repeatingRight, _GameButtons_repeatingUp, _GameButtons_repeatingDown, _GameButtons_repeatingA, _GameButtons_repeatingB, _GameButtons_repeatingMenu;
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
        _GameButtons_repeatingLeft.set(this, true);
        _GameButtons_repeatingRight.set(this, true);
        _GameButtons_repeatingUp.set(this, true);
        _GameButtons_repeatingDown.set(this, true);
        _GameButtons_repeatingA.set(this, true);
        _GameButtons_repeatingB.set(this, true);
        _GameButtons_repeatingMenu.set(this, false);
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
    setRepeating(button, repeating) {
        switch (button) {
            case "left":
                __classPrivateFieldSet(this, _GameButtons_repeatingLeft, repeating, "f");
                return;
            case "right":
                __classPrivateFieldSet(this, _GameButtons_repeatingRight, repeating, "f");
                return;
            case "up":
                __classPrivateFieldSet(this, _GameButtons_repeatingUp, repeating, "f");
                return;
            case "down":
                __classPrivateFieldSet(this, _GameButtons_repeatingDown, repeating, "f");
                return;
            case "a":
                __classPrivateFieldSet(this, _GameButtons_repeatingA, repeating, "f");
                return;
            case "b":
                __classPrivateFieldSet(this, _GameButtons_repeatingB, repeating, "f");
                return;
            case "menu":
                __classPrivateFieldSet(this, _GameButtons_repeatingMenu, repeating, "f");
                return;
        }
    }
    wasAnyJustPressed() {
        return (__classPrivateFieldGet(this, _GameButtons_left, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingLeft, "f")) ||
            __classPrivateFieldGet(this, _GameButtons_right, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingRight, "f")) ||
            __classPrivateFieldGet(this, _GameButtons_up, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingUp, "f")) ||
            __classPrivateFieldGet(this, _GameButtons_down, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingDown, "f")) ||
            __classPrivateFieldGet(this, _GameButtons_a, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingA, "f")) ||
            __classPrivateFieldGet(this, _GameButtons_b, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingB, "f")) ||
            __classPrivateFieldGet(this, _GameButtons_menu, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingMenu, "f")));
    }
    wasJustPressed(button) {
        switch (button) {
            case "left":
                return __classPrivateFieldGet(this, _GameButtons_left, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingLeft, "f"));
            case "right":
                return __classPrivateFieldGet(this, _GameButtons_right, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingRight, "f"));
            case "up":
                return __classPrivateFieldGet(this, _GameButtons_up, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingUp, "f"));
            case "down":
                return __classPrivateFieldGet(this, _GameButtons_down, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingDown, "f"));
            case "a":
                return __classPrivateFieldGet(this, _GameButtons_a, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingA, "f"));
            case "b":
                return __classPrivateFieldGet(this, _GameButtons_b, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingB, "f"));
            case "menu":
                return __classPrivateFieldGet(this, _GameButtons_menu, "f").wasJustPressed(__classPrivateFieldGet(this, _GameButtons_repeatingMenu, "f"));
        }
    }
    wasJustReleased(button) {
        switch (button) {
            case "left":
                return __classPrivateFieldGet(this, _GameButtons_left, "f").wasJustReleased(__classPrivateFieldGet(this, _GameButtons_repeatingLeft, "f"));
            case "right":
                return __classPrivateFieldGet(this, _GameButtons_right, "f").wasJustReleased(__classPrivateFieldGet(this, _GameButtons_repeatingRight, "f"));
            case "up":
                return __classPrivateFieldGet(this, _GameButtons_up, "f").wasJustReleased(__classPrivateFieldGet(this, _GameButtons_repeatingUp, "f"));
            case "down":
                return __classPrivateFieldGet(this, _GameButtons_down, "f").wasJustReleased(__classPrivateFieldGet(this, _GameButtons_repeatingDown, "f"));
            case "a":
                return __classPrivateFieldGet(this, _GameButtons_a, "f").wasJustReleased(__classPrivateFieldGet(this, _GameButtons_repeatingA, "f"));
            case "b":
                return __classPrivateFieldGet(this, _GameButtons_b, "f").wasJustReleased(__classPrivateFieldGet(this, _GameButtons_repeatingB, "f"));
            case "menu":
                return __classPrivateFieldGet(this, _GameButtons_menu, "f").wasJustReleased(__classPrivateFieldGet(this, _GameButtons_repeatingMenu, "f"));
        }
    }
}
_GameButtons_left = new WeakMap(), _GameButtons_right = new WeakMap(), _GameButtons_up = new WeakMap(), _GameButtons_down = new WeakMap(), _GameButtons_a = new WeakMap(), _GameButtons_b = new WeakMap(), _GameButtons_menu = new WeakMap(), _GameButtons_repeatingLeft = new WeakMap(), _GameButtons_repeatingRight = new WeakMap(), _GameButtons_repeatingUp = new WeakMap(), _GameButtons_repeatingDown = new WeakMap(), _GameButtons_repeatingA = new WeakMap(), _GameButtons_repeatingB = new WeakMap(), _GameButtons_repeatingMenu = new WeakMap();
