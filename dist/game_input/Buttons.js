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
var _Buttons_left, _Buttons_right, _Buttons_up, _Buttons_down, _Buttons_a, _Buttons_b, _Buttons_menu, _Buttons_repeatingLeft, _Buttons_repeatingRight, _Buttons_repeatingUp, _Buttons_repeatingDown, _Buttons_repeatingA, _Buttons_repeatingB, _Buttons_repeatingMenu;
import { v_ } from "../Vector2d";
import { Button } from "./Button";
export class Buttons {
    constructor() {
        _Buttons_left.set(this, new Button());
        _Buttons_right.set(this, new Button());
        _Buttons_up.set(this, new Button());
        _Buttons_down.set(this, new Button());
        _Buttons_a.set(this, new Button());
        _Buttons_b.set(this, new Button());
        _Buttons_menu.set(this, new Button());
        _Buttons_repeatingLeft.set(this, true);
        _Buttons_repeatingRight.set(this, true);
        _Buttons_repeatingUp.set(this, true);
        _Buttons_repeatingDown.set(this, true);
        _Buttons_repeatingA.set(this, true);
        _Buttons_repeatingB.set(this, true);
        _Buttons_repeatingMenu.set(this, false);
    }
    update(events) {
        __classPrivateFieldGet(this, _Buttons_left, "f").update(events.has("button_left"));
        __classPrivateFieldGet(this, _Buttons_right, "f").update(events.has("button_right"));
        __classPrivateFieldGet(this, _Buttons_up, "f").update(events.has("button_up"));
        __classPrivateFieldGet(this, _Buttons_down, "f").update(events.has("button_down"));
        __classPrivateFieldGet(this, _Buttons_a, "f").update(events.has("button_a"));
        __classPrivateFieldGet(this, _Buttons_b, "f").update(events.has("button_b"));
        __classPrivateFieldGet(this, _Buttons_menu, "f").update(events.has("button_menu"));
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
            case "a":
                return __classPrivateFieldGet(this, _Buttons_a, "f").isPressed;
            case "b":
                return __classPrivateFieldGet(this, _Buttons_b, "f").isPressed;
            case "menu":
                return __classPrivateFieldGet(this, _Buttons_menu, "f").isPressed;
        }
    }
    areDirectionsPressedAsVector() {
        return v_((__classPrivateFieldGet(this, _Buttons_left, "f").isPressed ? -1 : 0) + (__classPrivateFieldGet(this, _Buttons_right, "f").isPressed ? 1 : 0), (__classPrivateFieldGet(this, _Buttons_up, "f").isPressed ? -1 : 0) + (__classPrivateFieldGet(this, _Buttons_down, "f").isPressed ? 1 : 0));
    }
    setRepeating(button, repeating) {
        switch (button) {
            case "left":
                __classPrivateFieldSet(this, _Buttons_repeatingLeft, repeating, "f");
                return;
            case "right":
                __classPrivateFieldSet(this, _Buttons_repeatingRight, repeating, "f");
                return;
            case "up":
                __classPrivateFieldSet(this, _Buttons_repeatingUp, repeating, "f");
                return;
            case "down":
                __classPrivateFieldSet(this, _Buttons_repeatingDown, repeating, "f");
                return;
            case "a":
                __classPrivateFieldSet(this, _Buttons_repeatingA, repeating, "f");
                return;
            case "b":
                __classPrivateFieldSet(this, _Buttons_repeatingB, repeating, "f");
                return;
            case "menu":
                __classPrivateFieldSet(this, _Buttons_repeatingMenu, repeating, "f");
                return;
        }
    }
    wasAnyJustPressed() {
        return (__classPrivateFieldGet(this, _Buttons_left, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingLeft, "f")) ||
            __classPrivateFieldGet(this, _Buttons_right, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingRight, "f")) ||
            __classPrivateFieldGet(this, _Buttons_up, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingUp, "f")) ||
            __classPrivateFieldGet(this, _Buttons_down, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingDown, "f")) ||
            __classPrivateFieldGet(this, _Buttons_a, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingA, "f")) ||
            __classPrivateFieldGet(this, _Buttons_b, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingB, "f")) ||
            __classPrivateFieldGet(this, _Buttons_menu, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingMenu, "f")));
    }
    wasJustPressed(button) {
        switch (button) {
            case "left":
                return __classPrivateFieldGet(this, _Buttons_left, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingLeft, "f"));
            case "right":
                return __classPrivateFieldGet(this, _Buttons_right, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingRight, "f"));
            case "up":
                return __classPrivateFieldGet(this, _Buttons_up, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingUp, "f"));
            case "down":
                return __classPrivateFieldGet(this, _Buttons_down, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingDown, "f"));
            case "a":
                return __classPrivateFieldGet(this, _Buttons_a, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingA, "f"));
            case "b":
                return __classPrivateFieldGet(this, _Buttons_b, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingB, "f"));
            case "menu":
                return __classPrivateFieldGet(this, _Buttons_menu, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingMenu, "f"));
        }
    }
    wasJustReleased(button) {
        switch (button) {
            case "left":
                return __classPrivateFieldGet(this, _Buttons_left, "f").wasJustReleased(__classPrivateFieldGet(this, _Buttons_repeatingLeft, "f"));
            case "right":
                return __classPrivateFieldGet(this, _Buttons_right, "f").wasJustReleased(__classPrivateFieldGet(this, _Buttons_repeatingRight, "f"));
            case "up":
                return __classPrivateFieldGet(this, _Buttons_up, "f").wasJustReleased(__classPrivateFieldGet(this, _Buttons_repeatingUp, "f"));
            case "down":
                return __classPrivateFieldGet(this, _Buttons_down, "f").wasJustReleased(__classPrivateFieldGet(this, _Buttons_repeatingDown, "f"));
            case "a":
                return __classPrivateFieldGet(this, _Buttons_a, "f").wasJustReleased(__classPrivateFieldGet(this, _Buttons_repeatingA, "f"));
            case "b":
                return __classPrivateFieldGet(this, _Buttons_b, "f").wasJustReleased(__classPrivateFieldGet(this, _Buttons_repeatingB, "f"));
            case "menu":
                return __classPrivateFieldGet(this, _Buttons_menu, "f").wasJustReleased(__classPrivateFieldGet(this, _Buttons_repeatingMenu, "f"));
        }
    }
}
_Buttons_left = new WeakMap(), _Buttons_right = new WeakMap(), _Buttons_up = new WeakMap(), _Buttons_down = new WeakMap(), _Buttons_a = new WeakMap(), _Buttons_b = new WeakMap(), _Buttons_menu = new WeakMap(), _Buttons_repeatingLeft = new WeakMap(), _Buttons_repeatingRight = new WeakMap(), _Buttons_repeatingUp = new WeakMap(), _Buttons_repeatingDown = new WeakMap(), _Buttons_repeatingA = new WeakMap(), _Buttons_repeatingB = new WeakMap(), _Buttons_repeatingMenu = new WeakMap();
