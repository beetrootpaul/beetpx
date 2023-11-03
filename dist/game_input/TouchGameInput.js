var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TouchGameInput_instances, _TouchGameInput_eventsAndButtons, _TouchGameInput_eventsSinceLastUpdate, _TouchGameInput_handleTouchEvent;
import { HtmlTemplate } from "../HtmlTemplate";
export class TouchGameInput {
    constructor() {
        _TouchGameInput_instances.add(this);
        this.inputMethod = "touch";
        _TouchGameInput_eventsAndButtons.set(this, new Map([
            ["button_left", []],
            ["button_right", []],
            ["button_up", []],
            ["button_down", []],
            ["button_a", []],
            ["button_b", []],
            ["button_menu", []],
            ["mute_unmute_toggle", []],
            ["full_screen", []],
        ]));
        _TouchGameInput_eventsSinceLastUpdate.set(this, new Set());
        TouchGameInput.mapping.forEach(({ event, selector }) => {
            const buttons = document.querySelectorAll(selector);
            __classPrivateFieldGet(this, _TouchGameInput_eventsAndButtons, "f").get(event).push(...buttons);
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
        let anythingAdded = false;
        for (const event of __classPrivateFieldGet(this, _TouchGameInput_eventsSinceLastUpdate, "f")) {
            eventsCollector.add(event);
            anythingAdded = true;
        }
        // On macOS Chrome and Safari touch events are not registered during full
        //   screen transition. If user touches the button for a typical short duration,
        //   it ends up recognized as still pressed after the full screen transition
        //   ends. Therefore, in order to toggle full screen back, user has to press
        //   the button twice: once to "release" the key, and second time to initiate
        //   the next full screen transition.
        // As a workaround we do not keep "full_screen" event "pressed", so the framework
        //   will recognize it as a key being up immediately.
        __classPrivateFieldGet(this, _TouchGameInput_eventsSinceLastUpdate, "f").delete("full_screen");
        return anythingAdded;
    }
}
_TouchGameInput_eventsAndButtons = new WeakMap(), _TouchGameInput_eventsSinceLastUpdate = new WeakMap(), _TouchGameInput_instances = new WeakSet(), _TouchGameInput_handleTouchEvent = function _TouchGameInput_handleTouchEvent(touchEvent) {
    // Try to prevent iOS Safari from doing helpful things that do not apply
    //   to a game like: text selection, div selection, area zoom on a double
    //   tap, etc.
    touchEvent.preventDefault();
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
    { event: "button_left", selector: HtmlTemplate.selectors.controlsLeft },
    { event: "button_left", selector: HtmlTemplate.selectors.controlsUpLeft },
    { event: "button_left", selector: HtmlTemplate.selectors.controlsDownLeft },
    { event: "button_right", selector: HtmlTemplate.selectors.controlsRight },
    { event: "button_right", selector: HtmlTemplate.selectors.controlsUpRight },
    {
        event: "button_right",
        selector: HtmlTemplate.selectors.controlsDownRight,
    },
    { event: "button_up", selector: HtmlTemplate.selectors.controlsUp },
    { event: "button_up", selector: HtmlTemplate.selectors.controlsUpLeft },
    { event: "button_up", selector: HtmlTemplate.selectors.controlsUpRight },
    { event: "button_down", selector: HtmlTemplate.selectors.controlsDown },
    { event: "button_down", selector: HtmlTemplate.selectors.controlsDownLeft },
    {
        event: "button_down",
        selector: HtmlTemplate.selectors.controlsDownRight,
    },
    { event: "button_a", selector: HtmlTemplate.selectors.controlsA },
    { event: "button_b", selector: HtmlTemplate.selectors.controlsB },
    { event: "button_menu", selector: HtmlTemplate.selectors.controlsMenu },
    {
        event: "mute_unmute_toggle",
        selector: HtmlTemplate.selectors.controlsMuteToggle,
    },
    {
        event: "full_screen",
        selector: HtmlTemplate.selectors.controlsFullScreen,
    },
];
