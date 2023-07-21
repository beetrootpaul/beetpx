"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _KeyboardGameInput_keyMapping, _KeyboardGameInput_currentContinuousEvents, _KeyboardGameInput_recentFireOnceEvents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardGameInput = void 0;
const GameInput_1 = require("./GameInput");
class KeyboardGameInput {
    constructor(params) {
        _KeyboardGameInput_keyMapping.set(this, new Map([
            ["ArrowLeft", "left"],
            ["ArrowRight", "right"],
            ["ArrowUp", "up"],
            ["ArrowDown", "down"],
            ["a", "left"],
            ["d", "right"],
            ["w", "up"],
            ["s", "down"],
            ["A", "left"],
            ["D", "right"],
            ["W", "up"],
            ["S", "down"],
            ["m", "mute_unmute_toggle"],
            ["M", "mute_unmute_toggle"],
            ["f", "full_screen"],
            ["F", "full_screen"],
        ]));
        _KeyboardGameInput_currentContinuousEvents.set(this, new Set());
        _KeyboardGameInput_recentFireOnceEvents.set(this, new Set());
        if (params.debugToggleKey) {
            __classPrivateFieldGet(this, _KeyboardGameInput_keyMapping, "f").set(params.debugToggleKey, "debug_toggle");
        }
    }
    startListening() {
        document.addEventListener("keydown", (keyboardEvent) => {
            const gameInputEvent = __classPrivateFieldGet(this, _KeyboardGameInput_keyMapping, "f").get(keyboardEvent.key);
            if (gameInputEvent) {
                keyboardEvent.preventDefault();
                if (!GameInput_1.gameInputEventBehavior[gameInputEvent]?.fireOnce) {
                    __classPrivateFieldGet(this, _KeyboardGameInput_currentContinuousEvents, "f").add(gameInputEvent);
                }
            }
        });
        document.addEventListener("keyup", (keyboardEvent) => {
            const gameInputEvent = __classPrivateFieldGet(this, _KeyboardGameInput_keyMapping, "f").get(keyboardEvent.key);
            if (gameInputEvent) {
                keyboardEvent.preventDefault();
                if (GameInput_1.gameInputEventBehavior[gameInputEvent]?.fireOnce) {
                    __classPrivateFieldGet(this, _KeyboardGameInput_recentFireOnceEvents, "f").add(gameInputEvent);
                }
                else {
                    __classPrivateFieldGet(this, _KeyboardGameInput_currentContinuousEvents, "f").delete(gameInputEvent);
                }
            }
        });
    }
    getCurrentContinuousEvents() {
        return __classPrivateFieldGet(this, _KeyboardGameInput_currentContinuousEvents, "f");
    }
    consumeFireOnceEvents() {
        const events = new Set(__classPrivateFieldGet(this, _KeyboardGameInput_recentFireOnceEvents, "f"));
        __classPrivateFieldGet(this, _KeyboardGameInput_recentFireOnceEvents, "f").clear();
        return events;
    }
}
exports.KeyboardGameInput = KeyboardGameInput;
_KeyboardGameInput_keyMapping = new WeakMap(), _KeyboardGameInput_currentContinuousEvents = new WeakMap(), _KeyboardGameInput_recentFireOnceEvents = new WeakMap();
