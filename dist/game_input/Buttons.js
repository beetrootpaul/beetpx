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
var _Buttons_left, _Buttons_right, _Buttons_up, _Buttons_down, _Buttons_o, _Buttons_x, _Buttons_menu, _Buttons_repeatingLeft, _Buttons_repeatingRight, _Buttons_repeatingUp, _Buttons_repeatingDown, _Buttons_repeatingO, _Buttons_repeatingX, _Buttons_repeatingMenu;
import { BeetPx } from "../BeetPx";
import { Button } from "./Button";
export class Buttons {
    constructor() {
        _Buttons_left.set(this, new Button());
        _Buttons_right.set(this, new Button());
        _Buttons_up.set(this, new Button());
        _Buttons_down.set(this, new Button());
        _Buttons_o.set(this, new Button());
        _Buttons_x.set(this, new Button());
        _Buttons_menu.set(this, new Button());
        _Buttons_repeatingLeft.set(this, true);
        _Buttons_repeatingRight.set(this, true);
        _Buttons_repeatingUp.set(this, true);
        _Buttons_repeatingDown.set(this, true);
        _Buttons_repeatingO.set(this, true);
        _Buttons_repeatingX.set(this, true);
        _Buttons_repeatingMenu.set(this, false);
    }
    update(events) {
        __classPrivateFieldGet(this, _Buttons_left, "f").update(events.has("button_left"), BeetPx.dt);
        __classPrivateFieldGet(this, _Buttons_right, "f").update(events.has("button_right"), BeetPx.dt);
        __classPrivateFieldGet(this, _Buttons_up, "f").update(events.has("button_up"), BeetPx.dt);
        __classPrivateFieldGet(this, _Buttons_down, "f").update(events.has("button_down"), BeetPx.dt);
        __classPrivateFieldGet(this, _Buttons_o, "f").update(events.has("button_o"), BeetPx.dt);
        __classPrivateFieldGet(this, _Buttons_x, "f").update(events.has("button_x"), BeetPx.dt);
        __classPrivateFieldGet(this, _Buttons_menu, "f").update(events.has("button_menu"), BeetPx.dt);
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
            case "menu":
                return __classPrivateFieldGet(this, _Buttons_menu, "f").isPressed;
        }
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
            case "o":
                __classPrivateFieldSet(this, _Buttons_repeatingO, repeating, "f");
                return;
            case "x":
                __classPrivateFieldSet(this, _Buttons_repeatingX, repeating, "f");
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
            __classPrivateFieldGet(this, _Buttons_o, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingO, "f")) ||
            __classPrivateFieldGet(this, _Buttons_x, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingX, "f")) ||
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
            case "o":
                return __classPrivateFieldGet(this, _Buttons_o, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingO, "f"));
            case "x":
                return __classPrivateFieldGet(this, _Buttons_x, "f").wasJustPressed(__classPrivateFieldGet(this, _Buttons_repeatingX, "f"));
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
            case "o":
                return __classPrivateFieldGet(this, _Buttons_o, "f").wasJustReleased(__classPrivateFieldGet(this, _Buttons_repeatingO, "f"));
            case "x":
                return __classPrivateFieldGet(this, _Buttons_x, "f").wasJustReleased(__classPrivateFieldGet(this, _Buttons_repeatingX, "f"));
            case "menu":
                return __classPrivateFieldGet(this, _Buttons_menu, "f").wasJustReleased(__classPrivateFieldGet(this, _Buttons_repeatingMenu, "f"));
        }
    }
}
_Buttons_left = new WeakMap(), _Buttons_right = new WeakMap(), _Buttons_up = new WeakMap(), _Buttons_down = new WeakMap(), _Buttons_o = new WeakMap(), _Buttons_x = new WeakMap(), _Buttons_menu = new WeakMap(), _Buttons_repeatingLeft = new WeakMap(), _Buttons_repeatingRight = new WeakMap(), _Buttons_repeatingUp = new WeakMap(), _Buttons_repeatingDown = new WeakMap(), _Buttons_repeatingO = new WeakMap(), _Buttons_repeatingX = new WeakMap(), _Buttons_repeatingMenu = new WeakMap();
