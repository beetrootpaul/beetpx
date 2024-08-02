var _a;
import { HtmlTemplate } from "../HtmlTemplate";
export class GameInputTouch {
    inputMethod = "touch";
    static #bitMasks = {
        up: 0b1000_00_0_00,
        down: 0b0100_00_0_00,
        left: 0b0010_00_0_00,
        right: 0b0001_00_0_00,
        O: 0b0000_10_0_00,
        X: 0b0000_01_0_00,
        menu: 0b0000_00_1_00,
        muteUnmute: 0b0000_00_0_10,
        fullScreen: 0b0000_00_0_01,
    };
    #config = [
        {
            bitMask: _a.#bitMasks.up | _a.#bitMasks.left,
            events: ["button_up", "button_left"],
            requiresStart: false,
            selector: HtmlTemplate.selectors.controlsUpLeft,
            elements: [],
        },
        {
            bitMask: _a.#bitMasks.up,
            events: ["button_up"],
            requiresStart: false,
            selector: HtmlTemplate.selectors.controlsUp,
            elements: [],
        },
        {
            bitMask: _a.#bitMasks.up | _a.#bitMasks.right,
            events: ["button_up", "button_right"],
            requiresStart: false,
            selector: HtmlTemplate.selectors.controlsUpRight,
            elements: [],
        },
        {
            bitMask: _a.#bitMasks.left,
            events: ["button_left"],
            requiresStart: false,
            selector: HtmlTemplate.selectors.controlsLeft,
            elements: [],
        },
        {
            bitMask: _a.#bitMasks.right,
            events: ["button_right"],
            requiresStart: false,
            selector: HtmlTemplate.selectors.controlsRight,
            elements: [],
        },
        {
            bitMask: _a.#bitMasks.down | _a.#bitMasks.left,
            events: ["button_down", "button_left"],
            requiresStart: false,
            selector: HtmlTemplate.selectors.controlsDownLeft,
            elements: [],
        },
        {
            bitMask: _a.#bitMasks.down,
            events: ["button_down"],
            requiresStart: false,
            selector: HtmlTemplate.selectors.controlsDown,
            elements: [],
        },
        {
            bitMask: _a.#bitMasks.down | _a.#bitMasks.right,
            events: ["button_down", "button_right"],
            requiresStart: false,
            selector: HtmlTemplate.selectors.controlsDownRight,
            elements: [],
        },
        {
            bitMask: _a.#bitMasks.O,
            events: ["button_O"],
            requiresStart: false,
            selector: HtmlTemplate.selectors.controlsO,
            elements: [],
        },
        {
            bitMask: _a.#bitMasks.X,
            events: ["button_X"],
            requiresStart: false,
            selector: HtmlTemplate.selectors.controlsX,
            elements: [],
        },
        {
            bitMask: _a.#bitMasks.menu,
            events: ["button_menu"],
            requiresStart: true,
            selector: HtmlTemplate.selectors.controlsMenu,
            elements: [],
        },
        {
            bitMask: _a.#bitMasks.muteUnmute,
            events: ["mute_unmute_toggle"],
            requiresStart: true,
            selector: HtmlTemplate.selectors.controlsMuteToggle,
            elements: [],
        },
        {
            bitMask: _a.#bitMasks.fullScreen,
            events: ["full_screen"],
            requiresStart: true,
            selector: HtmlTemplate.selectors.controlsFullScreen,
            elements: [],
        },
    ];
    #ongoingTouches = new Map();
    constructor() {
        this.#config.forEach(({ selector, elements }) => {
            elements.push(...document.querySelectorAll(selector));
        });
    }
    startListening() {
        document.addEventListener("touchstart", this.#handleTouchEvent.bind(this));
        document.addEventListener("touchmove", this.#handleTouchEvent.bind(this));
        document.addEventListener("touchcancel", this.#handleTouchEvent.bind(this));
        document.addEventListener("touchend", this.#handleTouchEvent.bind(this));
    }
    #handleTouchEvent(touchEvent) {
        touchEvent.preventDefault();
        for (const touch of touchEvent.changedTouches) {
            if (touchEvent.type === "touchmove") {
                let detectedEvents = 0;
                for (const { elements, bitMask, requiresStart } of this.#config) {
                    if (!requiresStart &&
                        this.#isAnyElementTouched(elements, touch, bitMask)) {
                        detectedEvents |= bitMask;
                    }
                }
                this.#ongoingTouches.set(touch.identifier, detectedEvents);
            }
            else if (touchEvent.type === "touchstart") {
                let detectedEvents = 0;
                for (const { elements, bitMask, events } of this.#config) {
                    if (this.#isAnyElementTouched(elements, touch, bitMask)) {
                        detectedEvents |= bitMask;
                    }
                }
                this.#ongoingTouches.set(touch.identifier, detectedEvents);
            }
            else if (touchEvent.type === "touchend" ||
                touchEvent.type === "touchcancel") {
                this.#ongoingTouches.delete(touch.identifier);
            }
        }
    }
    #isAnyElementTouched(elements, touch, bitMask) {
        for (const el of elements) {
            const bcr = el.getBoundingClientRect();
            if (touch.clientX >=
                bcr.left -
                    (bitMask & _a.#bitMasks.left ? bcr.width : 0) &&
                touch.clientX <=
                    bcr.right +
                        (bitMask & _a.#bitMasks.right ? bcr.width : 0) &&
                touch.clientY >=
                    bcr.top - (bitMask & _a.#bitMasks.up ? bcr.height : 0) &&
                touch.clientY <=
                    bcr.bottom +
                        (bitMask & _a.#bitMasks.down ? bcr.height : 0)) {
                return true;
            }
        }
        return false;
    }
    update(eventsCollector) {
        let anythingAdded = false;
        for (const [touchIdentifier, ongoingEvents,] of this.#ongoingTouches.entries()) {
            for (const { bitMask, events } of this.#config) {
                if ((ongoingEvents & bitMask) === bitMask) {
                    for (const event of events) {
                        eventsCollector.add(event);
                    }
                }
            }
            if (ongoingEvents & _a.#bitMasks.fullScreen) {
                this.#ongoingTouches.set(touchIdentifier, ongoingEvents & ~_a.#bitMasks.fullScreen);
            }
        }
        return anythingAdded;
    }
}
_a = GameInputTouch;
//# sourceMappingURL=GameInputTouch.js.map