"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TouchGameInput_instances, _TouchGameInput_buttonsAndEvents, _TouchGameInput_currentContinuousEvents, _TouchGameInput_handleTouchEvent;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchGameInput = void 0;
// TODO: implement support for gameInputEventBehavior[gameInputEvent]?.fireOnce
// TODO: implement X and O
class TouchGameInput {
    constructor() {
        _TouchGameInput_instances.add(this);
        _TouchGameInput_buttonsAndEvents.set(this, []);
        _TouchGameInput_currentContinuousEvents.set(this, new Set());
        // TODO: externalize these selectors as game params
        const selectorMapping = new Map([
            [".controls_left", "left"],
            [".controls_right", "right"],
            [".controls_up", "up"],
            [".controls_down", "down"],
        ]);
        for (const [selector, gameInputEvent] of selectorMapping.entries()) {
            document.querySelectorAll(selector).forEach((button) => {
                __classPrivateFieldGet(this, _TouchGameInput_buttonsAndEvents, "f").push([button, gameInputEvent]);
            });
        }
    }
    startListening() {
        document
            // TODO: externalize this selector
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
    getCurrentContinuousEvents() {
        return __classPrivateFieldGet(this, _TouchGameInput_currentContinuousEvents, "f");
    }
}
exports.TouchGameInput = TouchGameInput;
_TouchGameInput_buttonsAndEvents = new WeakMap(), _TouchGameInput_currentContinuousEvents = new WeakMap(), _TouchGameInput_instances = new WeakSet(), _TouchGameInput_handleTouchEvent = function _TouchGameInput_handleTouchEvent(touchEvent) {
    __classPrivateFieldGet(this, _TouchGameInput_currentContinuousEvents, "f").clear();
    Array.from(touchEvent.touches).forEach((touch) => {
        __classPrivateFieldGet(this, _TouchGameInput_buttonsAndEvents, "f").forEach(([button, gameInputEvent]) => {
            if (gameInputEvent) {
                const boundingRect = button.getBoundingClientRect();
                if (touch.clientX > boundingRect.left &&
                    touch.clientX < boundingRect.right &&
                    touch.clientY > boundingRect.top &&
                    touch.clientY < boundingRect.bottom) {
                    touchEvent.preventDefault();
                    __classPrivateFieldGet(this, _TouchGameInput_currentContinuousEvents, "f").add(gameInputEvent);
                }
            }
        });
    });
};
