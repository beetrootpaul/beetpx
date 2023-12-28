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
var _GameInputGamepad_instances, _GameInputGamepad_browserType, _GameInputGamepad_mappings, _GameInputGamepad_mappingFor;
import { u_ } from "../Utils";
import { GamepadMapping8BitDo } from "./gamepad_mapping/GamepadMapping8BitDo";
import { GamepadMappingFallback } from "./gamepad_mapping/GamepadMappingFallback";
import { GamepadMappingFirefox8BitDoOther } from "./gamepad_mapping/GamepadMappingFirefox8BitDoOther";
import { GamepadMappingFirefox8BitDoWindows } from "./gamepad_mapping/GamepadMappingFirefox8BitDoWindows";
import { GamepadMappingFirefoxDualSenseOther } from "./gamepad_mapping/GamepadMappingFirefoxDualSenseOther";
import { GamepadMappingFirefoxDualSenseWindows } from "./gamepad_mapping/GamepadMappingFirefoxDualSenseWindows";
import { GamepadMappingFirefoxFallback } from "./gamepad_mapping/GamepadMappingFirefoxFallback";
import { GamepadMappingSafari8BitDo } from "./gamepad_mapping/GamepadMappingSafari8BitDo";
import { GamepadMappingStandard } from "./gamepad_mapping/GamepadMappingStandard";
import { GamepadTypeDetector } from "./GamepadTypeDetector";
export const supportedGamepadTypes = [
    "xbox",
    "dualsense",
    "8bitdo",
    "other",
];
export class GameInputGamepad {
    constructor(params) {
        _GameInputGamepad_instances.add(this);
        this.inputMethod = "gamepad";
        _GameInputGamepad_browserType.set(this, void 0);
        _GameInputGamepad_mappings.set(this, {
            standard: new GamepadMappingStandard(),
            firefoxDualSenseWindows: new GamepadMappingFirefoxDualSenseWindows(),
            firefoxDualSenseOther: new GamepadMappingFirefoxDualSenseOther(),
            firefox8bitdoWindows: new GamepadMappingFirefox8BitDoWindows(),
            firefox8bitdoOther: new GamepadMappingFirefox8BitDoOther(),
            firefoxOther: new GamepadMappingFirefoxFallback(),
            safari8bitdo: new GamepadMappingSafari8BitDo(),
            "8bitdo": new GamepadMapping8BitDo(),
            other: new GamepadMappingFallback(),
        });
        __classPrivateFieldSet(this, _GameInputGamepad_browserType, params.browserType, "f");
    }
    startListening() {
        
    }
    update(eventsCollector) {
        let wasAnyEventDetected = false;
        for (const gamepad of navigator.getGamepads()) {
            if (!gamepad)
                continue;
            const mapping = __classPrivateFieldGet(this, _GameInputGamepad_instances, "m", _GameInputGamepad_mappingFor).call(this, gamepad);
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
                    .forEach((event) => {
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
            .filter(u_.isDefined)
            .map((gamepad) => GamepadTypeDetector.detect(gamepad)));
    }
}
_GameInputGamepad_browserType = new WeakMap(), _GameInputGamepad_mappings = new WeakMap(), _GameInputGamepad_instances = new WeakSet(), _GameInputGamepad_mappingFor = function _GameInputGamepad_mappingFor(gamepad) {
    const gamepadType = GamepadTypeDetector.detect(gamepad);
    if (__classPrivateFieldGet(this, _GameInputGamepad_browserType, "f") === "firefox_windows" ||
        __classPrivateFieldGet(this, _GameInputGamepad_browserType, "f") === "firefox_other") {
        if (gamepadType === "dualsense") {
            return __classPrivateFieldGet(this, _GameInputGamepad_browserType, "f") === "firefox_windows"
                ? __classPrivateFieldGet(this, _GameInputGamepad_mappings, "f").firefoxDualSenseWindows
                : __classPrivateFieldGet(this, _GameInputGamepad_mappings, "f").firefoxDualSenseOther;
        }
        else if (gamepadType === "8bitdo") {
            return __classPrivateFieldGet(this, _GameInputGamepad_browserType, "f") === "firefox_windows"
                ? __classPrivateFieldGet(this, _GameInputGamepad_mappings, "f").firefox8bitdoWindows
                : __classPrivateFieldGet(this, _GameInputGamepad_mappings, "f").firefox8bitdoOther;
        }
        else {
            return __classPrivateFieldGet(this, _GameInputGamepad_mappings, "f").firefoxOther;
        }
    }
    if (gamepadType === "8bitdo") {
        return __classPrivateFieldGet(this, _GameInputGamepad_browserType, "f") === "safari"
            ? __classPrivateFieldGet(this, _GameInputGamepad_mappings, "f").safari8bitdo
            : __classPrivateFieldGet(this, _GameInputGamepad_mappings, "f")["8bitdo"];
    }
    
    
    
    if (gamepad.mapping === "standard") {
        return __classPrivateFieldGet(this, _GameInputGamepad_mappings, "f").standard;
    }
    else {
        return __classPrivateFieldGet(this, _GameInputGamepad_mappings, "f").other;
    }
};
