"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TouchGameInput_instances, _TouchGameInput_eventsAndButtons, _TouchGameInput_eventsSinceLastUpdate, _TouchGameInput_handleTouchEvent;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchGameInput = void 0;
class TouchGameInput {
    constructor() {
        _TouchGameInput_instances.add(this);
        _TouchGameInput_eventsAndButtons.set(this, new Map([
            ["button_left", []],
            ["button_right", []],
            ["button_up", []],
            ["button_down", []],
            ["button_o", []],
            ["button_x", []],
            ["button_menu", []],
        ]));
        _TouchGameInput_eventsSinceLastUpdate.set(this, new Set());
        // TODO: externalize these CSS selectors as framework params or some separate class which keeps all the CSS classes etc.
        __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_left")
            ?.push(...document.querySelectorAll(".controls_left"));
        __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_right")
            ?.push(...document.querySelectorAll(".controls_right"));
        __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_up")
            ?.push(...document.querySelectorAll(".controls_up"));
        __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_o")
            ?.push(...document.querySelectorAll(".controls_o"));
        __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_x")
            ?.push(...document.querySelectorAll(".controls_x"));
        __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_menu")
            ?.push(...document.querySelectorAll(".controls_menu"));
    }
    startListening() {
        document
            // TODO: externalize this selector as a framework params or some separate class which keeps all the CSS classes etc.
            .querySelectorAll(".touch_controls")
            .forEach((touchArea) => {
            touchArea.addEventListener("touchstart", (touchEvent) => {
                __classPrivateFieldGet(this, _TouchGameInput_instances, "m", _TouchGameInput_handleTouchEvent).call(this, touchEvent);
            });
            touchArea.addEventListener("touchmove", (touchEvent) => {
                __classPrivateFieldGet(this, _TouchGameInput_instances, "m", _TouchGameInput_handleTouchEvent).call(this, touchEvent);
            });
            touchArea.addEventListener("touchcancel", (touchEvent) => {
                __classPrivateFieldGet(this, _TouchGameInput_instances, "m", _TouchGameInput_handleTouchEvent).call(this, touchEvent);
            });
            touchArea.addEventListener("touchend", (touchEvent) => {
                __classPrivateFieldGet(this, _TouchGameInput_instances, "m", _TouchGameInput_handleTouchEvent).call(this, touchEvent);
            });
        });
    }
    update(eventsCollector) {
        for (const event of __classPrivateFieldGet(this, _TouchGameInput_eventsSinceLastUpdate, "f")) {
            eventsCollector.add(event);
        }
    }
}
exports.TouchGameInput = TouchGameInput;
_TouchGameInput_eventsAndButtons = new WeakMap(), _TouchGameInput_eventsSinceLastUpdate = new WeakMap(), _TouchGameInput_instances = new WeakSet(), _TouchGameInput_handleTouchEvent = function _TouchGameInput_handleTouchEvent(touchEvent) {
    for (const [gameInputEvent, buttons] of __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f").entries()) {
        let hasTouchWithinButtonBounds = false;
        Array.from(touchEvent.touches).forEach((touch) => {
            buttons.forEach((b) => {
                const boundingRect = b.getBoundingClientRect();
                if (touch.clientX > boundingRect.left &&
                    touch.clientX < boundingRect.right &&
                    touch.clientY > boundingRect.top &&
                    touch.clientY < boundingRect.bottom) {
                    hasTouchWithinButtonBounds = true;
                }
            });
        });
        if (hasTouchWithinButtonBounds) {
            __classPrivateFieldGet(this, _TouchGameInput_eventsSinceLastUpdate, "f").add(gameInputEvent);
        }
        else {
            __classPrivateFieldGet(this, _TouchGameInput_eventsSinceLastUpdate, "f").delete(gameInputEvent);
        }
    }
};
