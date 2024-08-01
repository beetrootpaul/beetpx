import { GamepadMapping8BitDo } from "./gamepad_mapping/GamepadMapping8BitDo";
import { GamepadMappingDualSense } from "./gamepad_mapping/GamepadMappingDualSense";
import { GamepadMappingFallback } from "./gamepad_mapping/GamepadMappingFallback";
import { GamepadMappingFirefox8BitDoOther } from "./gamepad_mapping/GamepadMappingFirefox8BitDoOther";
import { GamepadMappingFirefox8BitDoWindows } from "./gamepad_mapping/GamepadMappingFirefox8BitDoWindows";
import { GamepadMappingFirefoxDualSenseOther } from "./gamepad_mapping/GamepadMappingFirefoxDualSenseOther";
import { GamepadMappingFirefoxDualSenseWindows } from "./gamepad_mapping/GamepadMappingFirefoxDualSenseWindows";
import { GamepadMappingFirefoxFallback } from "./gamepad_mapping/GamepadMappingFirefoxFallback";
import { GamepadMappingSafari8BitDo } from "./gamepad_mapping/GamepadMappingSafari8BitDo";
import { GamepadMappingStandard } from "./gamepad_mapping/GamepadMappingStandard";
import { BpxGamepadTypeDetector } from "./GamepadTypeDetector";
export const supportedGamepadTypes = [
    "xbox",
    "dualsense",
    "8bitdo",
    "other",
];
export class GameInputGamepad {
    inputMethod = "gamepad";
    #browserType;
    #mappings = {
        standard: new GamepadMappingStandard(),
        dualSense: new GamepadMappingDualSense(),
        firefoxDualSenseWindows: new GamepadMappingFirefoxDualSenseWindows(),
        firefoxDualSenseOther: new GamepadMappingFirefoxDualSenseOther(),
        firefox8bitdoWindows: new GamepadMappingFirefox8BitDoWindows(),
        firefox8bitdoOther: new GamepadMappingFirefox8BitDoOther(),
        firefoxOther: new GamepadMappingFirefoxFallback(),
        safari8bitdo: new GamepadMappingSafari8BitDo(),
        "8bitdo": new GamepadMapping8BitDo(),
        other: new GamepadMappingFallback(),
    };
    constructor(params) {
        this.#browserType = params.browserType;
    }
    startListening() {
        
    }
    update(eventsCollector) {
        let wasAnyEventDetected = false;
        for (const gamepad of navigator.getGamepads()) {
            if (!gamepad)
                continue;
            const mapping = this.#mappingFor(gamepad);
            for (let buttonIndex = 0; buttonIndex < gamepad.buttons.length; ++buttonIndex) {
                const event = mapping.eventForButton(buttonIndex, gamepad.buttons[buttonIndex]);
                if (event) {
                    eventsCollector.add(event);
                    wasAnyEventDetected = true;
                }
            }
            for (let axisIndex = 0; axisIndex < gamepad.axes.length; ++axisIndex) {
                mapping
                    .eventsForAxisValue(axisIndex, gamepad.axes[axisIndex])
                    .forEach(event => {
                    eventsCollector.add(event);
                    wasAnyEventDetected = true;
                });
            }
        }
        return wasAnyEventDetected;
    }
    connectedGamepadTypes() {
        return new Set(navigator
            .getGamepads()
            .filter(gamepad => gamepad != null)
            .map(gamepad => BpxGamepadTypeDetector.detect(gamepad)));
    }
    #mappingFor(gamepad) {
        const gamepadType = BpxGamepadTypeDetector.detect(gamepad);
        if (this.#browserType === "firefox_windows" ||
            this.#browserType === "firefox_other") {
            if (gamepadType === "dualsense") {
                return this.#browserType === "firefox_windows" ?
                    this.#mappings.firefoxDualSenseWindows
                    : this.#mappings.firefoxDualSenseOther;
            }
            else if (gamepadType === "8bitdo") {
                return this.#browserType === "firefox_windows" ?
                    this.#mappings.firefox8bitdoWindows
                    : this.#mappings.firefox8bitdoOther;
            }
            else {
                return this.#mappings.firefoxOther;
            }
        }
        if (gamepadType === "8bitdo") {
            return this.#browserType === "safari" ?
                this.#mappings.safari8bitdo
                : this.#mappings["8bitdo"];
        }
        
        
        
        if (gamepad.mapping === "standard") {
            return gamepadType === "dualsense" ?
                this.#mappings.dualSense
                : this.#mappings.standard;
        }
        else {
            return this.#mappings.other;
        }
    }
}
