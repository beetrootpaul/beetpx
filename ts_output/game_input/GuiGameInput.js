"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GuiGameInput_params, _GuiGameInput_currentContinuousEvents, _GuiGameInput_recentFireOnceEvents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuiGameInput = void 0;
class GuiGameInput {
    constructor(params) {
        _GuiGameInput_params.set(this, void 0);
        _GuiGameInput_currentContinuousEvents.set(this, new Set());
        _GuiGameInput_recentFireOnceEvents.set(this, new Set());
        __classPrivateFieldSet(this, _GuiGameInput_params, params, "f");
    }
    startListening() {
        document
            .querySelectorAll(__classPrivateFieldGet(this, _GuiGameInput_params, "f").muteButtonsSelector)
            .forEach((button) => {
            button.addEventListener("click", () => {
                __classPrivateFieldGet(this, _GuiGameInput_recentFireOnceEvents, "f").add("mute_unmute_toggle");
            });
        });
        document
            .querySelectorAll(__classPrivateFieldGet(this, _GuiGameInput_params, "f").fullScreenButtonsSelector)
            .forEach((button) => {
            button.addEventListener("click", () => {
                __classPrivateFieldGet(this, _GuiGameInput_recentFireOnceEvents, "f").add("full_screen");
            });
        });
    }
    getCurrentContinuousEvents() {
        return __classPrivateFieldGet(this, _GuiGameInput_currentContinuousEvents, "f");
    }
    consumeFireOnceEvents() {
        const events = new Set(__classPrivateFieldGet(this, _GuiGameInput_recentFireOnceEvents, "f"));
        __classPrivateFieldGet(this, _GuiGameInput_recentFireOnceEvents, "f").clear();
        return events;
    }
}
exports.GuiGameInput = GuiGameInput;
_GuiGameInput_params = new WeakMap(), _GuiGameInput_currentContinuousEvents = new WeakMap(), _GuiGameInput_recentFireOnceEvents = new WeakMap();
