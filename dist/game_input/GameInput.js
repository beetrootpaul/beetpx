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
var _GameInput_guiGameInput, _GameInput_keyboardGameInput, _GameInput_touchGameInput, _GameInput_gamepadGameInput;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInput = exports.gameInputEventBehavior = void 0;
const GamepadGameInput_1 = require("./GamepadGameInput");
const GuiGameInput_1 = require("./GuiGameInput");
const KeyboardGameInput_1 = require("./KeyboardGameInput");
const TouchGameInput_1 = require("./TouchGameInput");
exports.gameInputEventBehavior = {
    // TODO: is it possible to make these keys type-safe?
    // TODO: move full_screen out of this set OR move its handling to TouchGameInput and similar ones
    mute_unmute_toggle: { fireOnce: true },
    full_screen: { fireOnce: true },
    debug_toggle: { fireOnce: true },
    frame_by_frame_toggle: { fireOnce: true },
    frame_by_frame_step: { fireOnce: true },
};
class GameInput {
    constructor(params) {
        _GameInput_guiGameInput.set(this, void 0);
        _GameInput_keyboardGameInput.set(this, void 0);
        _GameInput_touchGameInput.set(this, void 0);
        _GameInput_gamepadGameInput.set(this, void 0);
        __classPrivateFieldSet(this, _GameInput_guiGameInput, new GuiGameInput_1.GuiGameInput({
            muteButtonsSelector: params.muteButtonsSelector,
            fullScreenButtonsSelector: params.fullScreenButtonsSelector,
        }), "f");
        __classPrivateFieldSet(this, _GameInput_keyboardGameInput, new KeyboardGameInput_1.KeyboardGameInput({
            debugToggleKey: params.debugToggleKey,
            debugFrameByFrameActivateKey: params.debugFrameByFrameActivateKey,
            debugFrameByFrameStepKey: params.debugFrameByFrameStepKey,
        }), "f");
        __classPrivateFieldSet(this, _GameInput_touchGameInput, new TouchGameInput_1.TouchGameInput(), "f");
        __classPrivateFieldSet(this, _GameInput_gamepadGameInput, new GamepadGameInput_1.GamepadGameInput(), "f");
    }
    startListening() {
        __classPrivateFieldGet(this, _GameInput_guiGameInput, "f").startListening();
        __classPrivateFieldGet(this, _GameInput_keyboardGameInput, "f").startListening();
        __classPrivateFieldGet(this, _GameInput_touchGameInput, "f").startListening();
    }
    getCurrentContinuousEvents() {
        const detectedEvents = new Set();
        for (const event of __classPrivateFieldGet(this, _GameInput_guiGameInput, "f").getCurrentContinuousEvents()) {
            detectedEvents.add(event);
        }
        for (const event of __classPrivateFieldGet(this, _GameInput_keyboardGameInput, "f").getCurrentContinuousEvents()) {
            detectedEvents.add(event);
        }
        for (const event of __classPrivateFieldGet(this, _GameInput_touchGameInput, "f").getCurrentContinuousEvents()) {
            detectedEvents.add(event);
        }
        for (const event of __classPrivateFieldGet(this, _GameInput_gamepadGameInput, "f").getCurrentContinuousEvents()) {
            detectedEvents.add(event);
        }
        return detectedEvents;
    }
    consumeFireOnceEvents() {
        const detectedEvents = new Set();
        for (const event of __classPrivateFieldGet(this, _GameInput_guiGameInput, "f").consumeFireOnceEvents()) {
            detectedEvents.add(event);
        }
        for (const event of __classPrivateFieldGet(this, _GameInput_keyboardGameInput, "f").consumeFireOnceEvents()) {
            detectedEvents.add(event);
        }
        return detectedEvents;
    }
}
exports.GameInput = GameInput;
_GameInput_guiGameInput = new WeakMap(), _GameInput_keyboardGameInput = new WeakMap(), _GameInput_touchGameInput = new WeakMap(), _GameInput_gamepadGameInput = new WeakMap();
