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
var _GameInput_eventsCapturedInLastUpdate, _GameInput_mostRecentInputMethods;
import { HtmlTemplate } from "../HtmlTemplate";
import { Button } from "./buttons/Button";
import { GameButtons } from "./buttons/GameButtons";
import { GameInputGamepad } from "./GameInputGamepad";
import { GameInputKeyboard } from "./GameInputKeyboard";
import { GameInputMouse } from "./GameInputMouse";
import { GameInputTouch } from "./GameInputTouch";
export class GameInput {
    constructor(params) {
        _GameInput_eventsCapturedInLastUpdate.set(this, new Set());
        _GameInput_mostRecentInputMethods.set(this, new Set());
        this.gameInputGamepad = new GameInputGamepad({
            browserType: params.browserType,
        });
        this.gameInputsSpecialized = [
            new GameInputMouse(),
            new GameInputKeyboard({
                enableDebugToggle: params.enableDebugToggle,
                enableFrameByFrameControls: params.enableFrameByFrameControls,
            }),
            new GameInputTouch(),
            this.gameInputGamepad,
        ];
        this.gameButtons = new GameButtons();
        this.buttonFullScreen = new Button();
        this.buttonMuteUnmute = new Button();
        this.buttonDebugToggle = new Button();
        this.buttonFrameByFrameToggle = new Button();
        this.buttonFrameByFrameStep = new Button();
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
        __classPrivateFieldSet(this, _GameInput_eventsCapturedInLastUpdate, events, "f");
        if (!params.skipGameButtons) {
            this.gameButtons.update(events);
        }
        this.buttonFullScreen.update(events.has("full_screen"));
        this.buttonMuteUnmute.update(events.has("mute_unmute_toggle"));
        this.buttonDebugToggle.update(events.has("debug_toggle"));
        this.buttonFrameByFrameToggle.update(events.has("frame_by_frame_toggle"));
        this.buttonFrameByFrameStep.update(events.has("frame_by_frame_step"));
        HtmlTemplate.updatePressedClasses({
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
    getRecentInputMethods() {
        return __classPrivateFieldGet(this, _GameInput_mostRecentInputMethods, "f");
    }
    getConnectedGamepadTypes() {
        return this.gameInputGamepad.connectedGamepadTypes();
    }
    getEventsCapturedInLastUpdate() {
        return __classPrivateFieldGet(this, _GameInput_eventsCapturedInLastUpdate, "f");
    }
}
_GameInput_eventsCapturedInLastUpdate = new WeakMap(), _GameInput_mostRecentInputMethods = new WeakMap();
