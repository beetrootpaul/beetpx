var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TouchGameInput_instances, _a, _TouchGameInput_bitMasks, _TouchGameInput_config, _TouchGameInput_ongoingTouches, _TouchGameInput_handleTouchEvent, _TouchGameInput_isAnyElementTouched;
import { HtmlTemplate } from "../HtmlTemplate";
export class TouchGameInput {
    constructor() {
        _TouchGameInput_instances.add(this);
        this.inputMethod = "touch";
        _TouchGameInput_config.set(this, [
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).up | __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).left,
                events: ["button_up", "button_left"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsUpLeft,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).up,
                events: ["button_up"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsUp,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).up | __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).right,
                events: ["button_up", "button_right"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsUpRight,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).left,
                events: ["button_left"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsLeft,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).right,
                events: ["button_right"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsRight,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).down | __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).left,
                events: ["button_down", "button_left"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsDownLeft,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).down,
                events: ["button_down"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsDown,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).down | __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).right,
                events: ["button_down", "button_right"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsDownRight,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).a,
                events: ["button_a"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsA,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).b,
                events: ["button_b"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsB,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).menu,
                events: ["button_menu"],
                requiresStart: true,
                selector: HtmlTemplate.selectors.controlsMenu,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).muteUnmute,
                events: ["mute_unmute_toggle"],
                requiresStart: true,
                selector: HtmlTemplate.selectors.controlsMuteToggle,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).fullScreen,
                events: ["full_screen"],
                requiresStart: true,
                selector: HtmlTemplate.selectors.controlsFullScreen,
                elements: [],
            },
        ]);
        _TouchGameInput_ongoingTouches.set(this, new Map());
        __classPrivateFieldGet(this, _TouchGameInput_config, "f").forEach(({ selector, elements }) => {
            elements.push(...document.querySelectorAll(selector));
        });
    }
    startListening() {
        document.addEventListener("touchstart", __classPrivateFieldGet(this, _TouchGameInput_instances, "m", _TouchGameInput_handleTouchEvent).bind(this));
        document.addEventListener("touchmove", __classPrivateFieldGet(this, _TouchGameInput_instances, "m", _TouchGameInput_handleTouchEvent).bind(this));
        document.addEventListener("touchcancel", __classPrivateFieldGet(this, _TouchGameInput_instances, "m", _TouchGameInput_handleTouchEvent).bind(this));
        document.addEventListener("touchend", __classPrivateFieldGet(this, _TouchGameInput_instances, "m", _TouchGameInput_handleTouchEvent).bind(this));
    }
    update(eventsCollector) {
        let anythingAdded = false;
        for (const [touchIdentifier, ongoingEvents,] of __classPrivateFieldGet(this, _TouchGameInput_ongoingTouches, "f").entries()) {
            for (const { bitMask, events } of __classPrivateFieldGet(this, _TouchGameInput_config, "f")) {
                if ((ongoingEvents & bitMask) === bitMask) {
                    for (const event of events) {
                        eventsCollector.add(event);
                    }
                }
            }
            // On macOS Chrome and Safari touch events are not registered during full
            //   screen transition. If user touches the button for a typical short duration,
            //   it ends up recognized as still pressed after the full screen transition
            //   ends. Therefore, in order to toggle full screen back, user has to press
            //   the button twice: once to "release" the key, and second time to initiate
            //   the next full screen transition.
            // As a workaround we do not keep "full_screen" event "pressed", so the framework
            //   will recognize it as a key being up immediately.
            if (ongoingEvents & __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).fullScreen) {
                __classPrivateFieldGet(this, _TouchGameInput_ongoingTouches, "f").set(touchIdentifier, ongoingEvents & ~__classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).fullScreen);
            }
        }
        return anythingAdded;
    }
}
_a = TouchGameInput, _TouchGameInput_config = new WeakMap(), _TouchGameInput_ongoingTouches = new WeakMap(), _TouchGameInput_instances = new WeakSet(), _TouchGameInput_handleTouchEvent = function _TouchGameInput_handleTouchEvent(touchEvent) {
    // Try to prevent iOS Safari from doing helpful things that do not apply
    //   to a game like: text selection, div selection, area zoom on a double
    //   tap, etc.
    touchEvent.preventDefault();
    for (const touch of touchEvent.changedTouches) {
        if (touchEvent.type === "touchmove") {
            let detectedEvents = 0;
            for (const { elements, bitMask, requiresStart } of __classPrivateFieldGet(this, _TouchGameInput_config, "f")) {
                if (!requiresStart &&
                    __classPrivateFieldGet(this, _TouchGameInput_instances, "m", _TouchGameInput_isAnyElementTouched).call(this, elements, touch, bitMask)) {
                    detectedEvents |= bitMask;
                }
            }
            __classPrivateFieldGet(this, _TouchGameInput_ongoingTouches, "f").set(touch.identifier, detectedEvents);
        }
        else if (touchEvent.type === "touchstart") {
            let detectedEvents = 0;
            for (const { elements, bitMask, events } of __classPrivateFieldGet(this, _TouchGameInput_config, "f")) {
                if (__classPrivateFieldGet(this, _TouchGameInput_instances, "m", _TouchGameInput_isAnyElementTouched).call(this, elements, touch, bitMask)) {
                    detectedEvents |= bitMask;
                }
            }
            __classPrivateFieldGet(this, _TouchGameInput_ongoingTouches, "f").set(touch.identifier, detectedEvents);
        }
        else if (touchEvent.type === "touchend" ||
            touchEvent.type === "touchcancel") {
            __classPrivateFieldGet(this, _TouchGameInput_ongoingTouches, "f").delete(touch.identifier);
        }
    }
}, _TouchGameInput_isAnyElementTouched = function _TouchGameInput_isAnyElementTouched(elements, touch, bitMask) {
    for (const el of elements) {
        const bcr = el.getBoundingClientRect();
        if (touch.clientX >=
            bcr.left -
                (bitMask & __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).left ? bcr.width : 0) &&
            touch.clientX <=
                bcr.right +
                    (bitMask & __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).right ? bcr.width : 0) &&
            touch.clientY >=
                bcr.top - (bitMask & __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).up ? bcr.height : 0) &&
            touch.clientY <=
                bcr.bottom +
                    (bitMask & __classPrivateFieldGet(TouchGameInput, _a, "f", _TouchGameInput_bitMasks).down ? bcr.height : 0)) {
            return true;
        }
    }
    return false;
};
_TouchGameInput_bitMasks = { value: {
        up: 256,
        down: 128,
        left: 64,
        right: 32,
        a: 16,
        b: 8,
        menu: 4,
        muteUnmute: 2,
        fullScreen: 1,
    } };
