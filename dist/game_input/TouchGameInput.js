var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TouchGameInput_instances, _TouchGameInput_eventsAndButtons, _TouchGameInput_eventsSinceLastUpdate, _TouchGameInput_handleTouchEvent;
export class TouchGameInput {
    constructor() {
        var _a, _b, _c, _d, _e, _f, _g;
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
        (_a = __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_left")) === null || _a === void 0 ? void 0 : _a.push(...document.querySelectorAll(".controls_left"));
        (_b = __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_right")) === null || _b === void 0 ? void 0 : _b.push(...document.querySelectorAll(".controls_right"));
        (_c = __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_up")) === null || _c === void 0 ? void 0 : _c.push(...document.querySelectorAll(".controls_up"));
        (_d = __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_down")) === null || _d === void 0 ? void 0 : _d.push(...document.querySelectorAll(".controls_down"));
        (_e = __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_o")) === null || _e === void 0 ? void 0 : _e.push(...document.querySelectorAll(".controls_o"));
        (_f = __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_x")) === null || _f === void 0 ? void 0 : _f.push(...document.querySelectorAll(".controls_x"));
        (_g = __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f")
            .get("button_menu")) === null || _g === void 0 ? void 0 : _g.push(...document.querySelectorAll(".controls_menu"));
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
