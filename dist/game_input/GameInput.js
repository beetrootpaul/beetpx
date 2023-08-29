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
var _GameInput_specializedGameInputs;
import { Button } from "./Button";
import { Buttons } from "./Buttons";
import { GamepadGameInput } from "./GamepadGameInput";
import { KeyboardGameInput } from "./KeyboardGameInput";
import { MouseGameInput } from "./MouseGameInput";
import { TouchGameInput } from "./TouchGameInput";
export class GameInput {
    constructor(params) {
        _GameInput_specializedGameInputs.set(this, void 0);
        __classPrivateFieldSet(this, _GameInput_specializedGameInputs, [
            new MouseGameInput({
                muteButtonsSelector: params.muteButtonsSelector,
                fullScreenButtonsSelector: params.fullScreenButtonsSelector,
            }),
            new KeyboardGameInput({
                debugToggleKey: params.debugToggleKey,
                debugFrameByFrameActivateKey: params.debugFrameByFrameActivateKey,
                debugFrameByFrameStepKey: params.debugFrameByFrameStepKey,
            }),
            new TouchGameInput({
                visibleButtons: params.visibleTouchButtons,
            }),
            new GamepadGameInput(),
        ], "f");
        this.gameButtons = new Buttons();
        this.buttonFullScreen = new Button();
        this.buttonMuteUnmute = new Button();
        this.buttonDebugToggle = new Button();
        this.buttonFrameByFrameToggle = new Button();
        this.buttonFrameByFrameStep = new Button();
    }
    startListening() {
        for (const sgi of __classPrivateFieldGet(this, _GameInput_specializedGameInputs, "f")) {
            sgi.startListening();
        }
    }
    update(params) {
        const events = new Set();
        for (const sgi of __classPrivateFieldGet(this, _GameInput_specializedGameInputs, "f")) {
            sgi.update(events);
        }
        if (!params.skipGameButtons) {
            this.gameButtons.update(events);
        }
        this.buttonFullScreen.update(events.has("full_screen"));
        this.buttonMuteUnmute.update(events.has("mute_unmute_toggle"));
        this.buttonDebugToggle.update(events.has("debug_toggle"));
        this.buttonFrameByFrameToggle.update(events.has("frame_by_frame_toggle"));
        this.buttonFrameByFrameStep.update(events.has("frame_by_frame_step"));
    }
    wasAnyButtonPressed() {
        return (this.gameButtons.wasAnyJustPressed() ||
            this.buttonFullScreen.wasJustPressed(false) ||
            this.buttonMuteUnmute.wasJustPressed(false) ||
            this.buttonDebugToggle.wasJustPressed(false) ||
            this.buttonFrameByFrameToggle.wasJustPressed(false) ||
            this.buttonFrameByFrameStep.wasJustPressed(false));
    }
}
_GameInput_specializedGameInputs = new WeakMap();
