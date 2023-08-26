var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TouchGameInput_instances, _TouchGameInput_eventsAndButtons, _TouchGameInput_eventsSinceLastUpdate, _TouchGameInput_handleTouchEvent;
import { HtmlTemplate } from "../HtmlTemplate";
export class TouchGameInput {
    constructor(params) {
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
        TouchGameInput.mapping.forEach(({ event, button, selector }) => {
            const touchButtonElements = document.querySelectorAll(selector);
            __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f").get(event).push(...touchButtonElements);
            if (params.visibleButtons.includes(button)) {
                for (const el of touchButtonElements) {
                    el.classList.remove("hidden");
                }
            }
        });
    }
    startListening() {
        document
            .querySelectorAll(HtmlTemplate.selectors.touchControls)
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
TouchGameInput.mapping = [
    {
        event: "button_left",
        button: "left",
        selector: HtmlTemplate.selectors.controlsLeft,
    },
    {
        event: "button_right",
        button: "right",
        selector: HtmlTemplate.selectors.controlsRight,
    },
    {
        event: "button_up",
        button: "up",
        selector: HtmlTemplate.selectors.controlsUp,
    },
    {
        event: "button_down",
        button: "down",
        selector: HtmlTemplate.selectors.controlsDown,
    },
    {
        event: "button_o",
        button: "o",
        selector: HtmlTemplate.selectors.controlsO,
    },
    {
        event: "button_x",
        button: "x",
        selector: HtmlTemplate.selectors.controlsX,
    },
    {
        event: "button_menu",
        button: "menu",
        selector: HtmlTemplate.selectors.controlsMenu,
    },
];
