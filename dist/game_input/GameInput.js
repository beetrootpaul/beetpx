"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _GameInput_eventsCapturesInLastUpdate, _GameInput_mostRecentInputMethods;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInput = void 0;
const HtmlTemplate_1 = require("../HtmlTemplate");
const Button_1 = require("./buttons/Button");
const Buttons_1 = require("./buttons/Buttons");
const GameInputGamepad_1 = require("./GameInputGamepad");
const GameInputKeyboard_1 = require("./GameInputKeyboard");
const GameInputMouse_1 = require("./GameInputMouse");
const GameInputTouch_1 = require("./GameInputTouch");
class GameInput {
    constructor(params) {
        _GameInput_eventsCapturesInLastUpdate.set(this, new Set());
        _GameInput_mostRecentInputMethods.set(this, new Set());
        this.gameInputGamepad = new GameInputGamepad_1.GameInputGamepad({
            browserType: params.browserType,
        });
        this.gameInputsSpecialized = [
            new GameInputMouse_1.GameInputMouse(),
            new GameInputKeyboard_1.GameInputKeyboard({
                enableDebugInputs: params.enableDebugInputs,
            }),
            new GameInputTouch_1.GameInputTouch(),
            this.gameInputGamepad,
        ];
        this.gameButtons = new Buttons_1.Buttons();
        this.buttonFullScreen = new Button_1.Button();
        this.buttonMuteUnmute = new Button_1.Button();
        this.buttonDebugToggle = new Button_1.Button();
        this.buttonFrameByFrameToggle = new Button_1.Button();
        this.buttonFrameByFrameStep = new Button_1.Button();
    }
    startListening() {
        for (const sgi of this.gameInputsSpecialized) {
            sgi.startListening();
        }
    }
    /**
     * @return If any interaction happened.
     */
    update(params) {
        __classPrivateFieldGet(this, _GameInput_mostRecentInputMethods, "f").clear();
        const events = new Set();
        for (const sgi of this.gameInputsSpecialized) {
            if (sgi.update(events)) {
                
                
                __classPrivateFieldGet(this, _GameInput_mostRecentInputMethods, "f").add(sgi.inputMethod);
            }
        }
        __classPrivateFieldSet(this, _GameInput_eventsCapturesInLastUpdate, events, "f");
        if (!params.skipGameButtons) {
            this.gameButtons.update(events);
        }
        this.buttonFullScreen.update(events.has("full_screen"));
        this.buttonMuteUnmute.update(events.has("mute_unmute_toggle"));
        this.buttonDebugToggle.update(events.has("debug_toggle"));
        this.buttonFrameByFrameToggle.update(events.has("frame_by_frame_toggle"));
        this.buttonFrameByFrameStep.update(events.has("frame_by_frame_step"));
        HtmlTemplate_1.HtmlTemplate.updatePressedClasses({
            up: this.gameButtons.isPressed("up"),
            down: this.gameButtons.isPressed("down"),
            left: this.gameButtons.isPressed("left"),
            right: this.gameButtons.isPressed("right"),
            a: this.gameButtons.isPressed("a"),
            b: this.gameButtons.isPressed("b"),
            menu: this.gameButtons.isPressed("menu"),
            mute: this.buttonMuteUnmute.isPressed,
            fullscreen: this.buttonFullScreen.isPressed,
        });
        return events.size > 0;
    }
    mostRecentInputMethods() {
        return __classPrivateFieldGet(this, _GameInput_mostRecentInputMethods, "f");
    }
    connectedGamepadTypes() {
        return this.gameInputGamepad.connectedGamepadTypes();
    }
    __internal__capturedEvents() {
        return __classPrivateFieldGet(this, _GameInput_eventsCapturesInLastUpdate, "f");
    }
}
exports.GameInput = GameInput;
_GameInput_eventsCapturesInLastUpdate = new WeakMap(), _GameInput_mostRecentInputMethods = new WeakMap();
