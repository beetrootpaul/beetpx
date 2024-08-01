import { HtmlTemplate } from "../HtmlTemplate";
import { Button } from "./buttons/Button";
import { GameButtons } from "./buttons/GameButtons";
import { GameInputGamepad } from "./GameInputGamepad";
import { GameInputKeyboard } from "./GameInputKeyboard";
import { GameInputMouse } from "./GameInputMouse";
import { GameInputTouch } from "./GameInputTouch";
export class GameInput {
    gameInputsSpecialized;
    gameInputGamepad;
    gameButtons;
    buttonFullScreen;
    buttonMuteUnmute;
    buttonTakeScreenshot;
    buttonBrowseScreenshots;
    buttonDebugToggle;
    buttonFrameByFrameToggle;
    buttonFrameByFrameStep;
    #eventsCapturedInLastUpdate = new Set();
    #mostRecentInputMethods = new Set();
    constructor(params) {
        this.gameInputGamepad = new GameInputGamepad({
            browserType: params.browserType,
        });
        this.gameInputsSpecialized = [
            new GameInputMouse(),
            new GameInputKeyboard({
                enableScreenshots: params.enableScreenshots,
                enableDebugToggle: params.enableDebugToggle,
                enableFrameByFrameControls: params.enableFrameByFrameControls,
            }),
            new GameInputTouch(),
            this.gameInputGamepad,
        ];
        this.gameButtons = new GameButtons();
        this.buttonFullScreen = new Button();
        this.buttonMuteUnmute = new Button();
        this.buttonTakeScreenshot = new Button();
        this.buttonBrowseScreenshots = new Button();
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
        this.#mostRecentInputMethods.clear();
        const events = new Set();
        for (const sgi of this.gameInputsSpecialized) {
            if (sgi.update(events)) {
                
                
                this.#mostRecentInputMethods.add(sgi.inputMethod);
            }
        }
        this.#eventsCapturedInLastUpdate = events;
        if (!params.skipGameButtons) {
            this.gameButtons.update(events);
        }
        this.buttonFullScreen.update(events.has("full_screen"));
        this.buttonMuteUnmute.update(events.has("mute_unmute_toggle"));
        this.buttonTakeScreenshot.update(events.has("take_screenshot"));
        this.buttonBrowseScreenshots.update(events.has("browse_screenshots_toggle"));
        this.buttonDebugToggle.update(events.has("debug_toggle"));
        this.buttonFrameByFrameToggle.update(events.has("frame_by_frame_toggle"));
        this.buttonFrameByFrameStep.update(events.has("frame_by_frame_step"));
        HtmlTemplate.updatePressedClasses({
            up: this.gameButtons.isPressed("up"),
            down: this.gameButtons.isPressed("down"),
            left: this.gameButtons.isPressed("left"),
            right: this.gameButtons.isPressed("right"),
            O: this.gameButtons.isPressed("O"),
            X: this.gameButtons.isPressed("X"),
            menu: this.gameButtons.isPressed("menu"),
            mute: this.buttonMuteUnmute.isPressed,
            fullscreen: this.buttonFullScreen.isPressed,
        });
        return events.size > 0;
    }
    getRecentInputMethods() {
        return this.#mostRecentInputMethods;
    }
    getConnectedGamepadTypes() {
        return this.gameInputGamepad.connectedGamepadTypes();
    }
    getEventsCapturedInLastUpdate() {
        return this.#eventsCapturedInLastUpdate;
    }
}
