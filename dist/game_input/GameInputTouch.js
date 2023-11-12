var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GameInputTouch_instances, _a, _GameInputTouch_bitMasks, _GameInputTouch_config, _GameInputTouch_ongoingTouches, _GameInputTouch_handleTouchEvent, _GameInputTouch_isAnyElementTouched;
import { HtmlTemplate } from "../HtmlTemplate";
export class GameInputTouch {
    constructor() {
        _GameInputTouch_instances.add(this);
        this.inputMethod = "touch";
        _GameInputTouch_config.set(this, [
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).up | __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).left,
                events: ["button_up", "button_left"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsUpLeft,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).up,
                events: ["button_up"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsUp,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).up | __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).right,
                events: ["button_up", "button_right"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsUpRight,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).left,
                events: ["button_left"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsLeft,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).right,
                events: ["button_right"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsRight,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).down | __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).left,
                events: ["button_down", "button_left"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsDownLeft,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).down,
                events: ["button_down"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsDown,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).down | __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).right,
                events: ["button_down", "button_right"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsDownRight,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).a,
                events: ["button_a"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsA,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).b,
                events: ["button_b"],
                requiresStart: false,
                selector: HtmlTemplate.selectors.controlsB,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).menu,
                events: ["button_menu"],
                requiresStart: true,
                selector: HtmlTemplate.selectors.controlsMenu,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).muteUnmute,
                events: ["mute_unmute_toggle"],
                requiresStart: true,
                selector: HtmlTemplate.selectors.controlsMuteToggle,
                elements: [],
            },
            {
                bitMask: __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).fullScreen,
                events: ["full_screen"],
                requiresStart: true,
                selector: HtmlTemplate.selectors.controlsFullScreen,
                elements: [],
            },
        ]);
        _GameInputTouch_ongoingTouches.set(this, new Map());
        __classPrivateFieldGet(this, _GameInputTouch_config, "f").forEach(({ selector, elements }) => {
            elements.push(...document.querySelectorAll(selector));
        });
    }
    startListening() {
        document.addEventListener("touchstart", __classPrivateFieldGet(this, _GameInputTouch_instances, "m", _GameInputTouch_handleTouchEvent).bind(this));
        document.addEventListener("touchmove", __classPrivateFieldGet(this, _GameInputTouch_instances, "m", _GameInputTouch_handleTouchEvent).bind(this));
        document.addEventListener("touchcancel", __classPrivateFieldGet(this, _GameInputTouch_instances, "m", _GameInputTouch_handleTouchEvent).bind(this));
        document.addEventListener("touchend", __classPrivateFieldGet(this, _GameInputTouch_instances, "m", _GameInputTouch_handleTouchEvent).bind(this));
    }
    update(eventsCollector) {
        let anythingAdded = false;
        for (const [touchIdentifier, ongoingEvents,] of __classPrivateFieldGet(this, _GameInputTouch_ongoingTouches, "f").entries()) {
            for (const { bitMask, events } of __classPrivateFieldGet(this, _GameInputTouch_config, "f")) {
                if ((ongoingEvents & bitMask) === bitMask) {
                    for (const event of events) {
                        eventsCollector.add(event);
                    }
                }
            }
            
            
            
            
            
            
            
            
            if (ongoingEvents & __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).fullScreen) {
                __classPrivateFieldGet(this, _GameInputTouch_ongoingTouches, "f").set(touchIdentifier, ongoingEvents & ~__classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).fullScreen);
            }
        }
        return anythingAdded;
    }
}
_a = GameInputTouch, _GameInputTouch_config = new WeakMap(), _GameInputTouch_ongoingTouches = new WeakMap(), _GameInputTouch_instances = new WeakSet(), _GameInputTouch_handleTouchEvent = function _GameInputTouch_handleTouchEvent(touchEvent) {
    
    
    
    touchEvent.preventDefault();
    for (const touch of touchEvent.changedTouches) {
        if (touchEvent.type === "touchmove") {
            let detectedEvents = 0;
            for (const { elements, bitMask, requiresStart } of __classPrivateFieldGet(this, _GameInputTouch_config, "f")) {
                if (!requiresStart &&
                    __classPrivateFieldGet(this, _GameInputTouch_instances, "m", _GameInputTouch_isAnyElementTouched).call(this, elements, touch, bitMask)) {
                    detectedEvents |= bitMask;
                }
            }
            __classPrivateFieldGet(this, _GameInputTouch_ongoingTouches, "f").set(touch.identifier, detectedEvents);
        }
        else if (touchEvent.type === "touchstart") {
            let detectedEvents = 0;
            for (const { elements, bitMask, events } of __classPrivateFieldGet(this, _GameInputTouch_config, "f")) {
                if (__classPrivateFieldGet(this, _GameInputTouch_instances, "m", _GameInputTouch_isAnyElementTouched).call(this, elements, touch, bitMask)) {
                    detectedEvents |= bitMask;
                }
            }
            __classPrivateFieldGet(this, _GameInputTouch_ongoingTouches, "f").set(touch.identifier, detectedEvents);
        }
        else if (touchEvent.type === "touchend" ||
            touchEvent.type === "touchcancel") {
            __classPrivateFieldGet(this, _GameInputTouch_ongoingTouches, "f").delete(touch.identifier);
        }
    }
}, _GameInputTouch_isAnyElementTouched = function _GameInputTouch_isAnyElementTouched(elements, touch, bitMask) {
    for (const el of elements) {
        const bcr = el.getBoundingClientRect();
        if (touch.clientX >=
            bcr.left -
                (bitMask & __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).left ? bcr.width : 0) &&
            touch.clientX <=
                bcr.right +
                    (bitMask & __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).right ? bcr.width : 0) &&
            touch.clientY >=
                bcr.top - (bitMask & __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).up ? bcr.height : 0) &&
            touch.clientY <=
                bcr.bottom +
                    (bitMask & __classPrivateFieldGet(GameInputTouch, _a, "f", _GameInputTouch_bitMasks).down ? bcr.height : 0)) {
            return true;
        }
    }
    return false;
};
_GameInputTouch_bitMasks = { value: {
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
