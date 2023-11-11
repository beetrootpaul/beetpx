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
var _GamepadGameInput_instances, _GamepadGameInput_browserType, _GamepadGameInput_mappings, _GamepadGameInput_mappingFor;
import { u_ } from "../Utils";
import { GamepadMappingFallback } from "./gamepad_mapping/GamepadMappingFallback";
import { GamepadMappingFirefoxDualSenseOther } from "./gamepad_mapping/GamepadMappingFirefoxDualSenseOther";
import { GamepadMappingFirefoxDualSenseWindows } from "./gamepad_mapping/GamepadMappingFirefoxDualSenseWindows";
import { GamepadMappingFirefoxFallback } from "./gamepad_mapping/GamepadMappingFirefoxFallback";
import { GamepadMappingStandard } from "./gamepad_mapping/GamepadMappingStandard";
import { GamepadTypeDetector } from "./GamepadTypeDetector";
export const supportedGamepadTypes = ["xbox", "dualsense", "other"];
export class GamepadGameInput {
    constructor(params) {
        _GamepadGameInput_instances.add(this);
        this.inputMethod = "gamepad";
        _GamepadGameInput_browserType.set(this, void 0);
        _GamepadGameInput_mappings.set(this, {
            standard: new GamepadMappingStandard(),
            firefoxDualSenseWindows: new GamepadMappingFirefoxDualSenseWindows(),
            firefoxDualSenseOther: new GamepadMappingFirefoxDualSenseOther(),
            firefoxOther: new GamepadMappingFirefoxFallback(),
            other: new GamepadMappingFallback(),
        });
        __classPrivateFieldSet(this, _GamepadGameInput_browserType, params.browserType, "f");
    }
    startListening() {
        
    }
    update(eventsCollector) {
        let wasAnyEventDetected = false;
        for (const gamepad of navigator.getGamepads()) {
            if (!gamepad)
                continue;
            const mapping = __classPrivateFieldGet(this, _GamepadGameInput_instances, "m", _GamepadGameInput_mappingFor).call(this, gamepad);
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
_GamepadGameInput_browserType = new WeakMap(), _GamepadGameInput_mappings = new WeakMap(), _GamepadGameInput_instances = new WeakSet(), _GamepadGameInput_mappingFor = function _GamepadGameInput_mappingFor(gamepad) {
    if (__classPrivateFieldGet(this, _GamepadGameInput_browserType, "f") === "firefox_windows" ||
        __classPrivateFieldGet(this, _GamepadGameInput_browserType, "f") === "firefox_other") {
        if (GamepadTypeDetector.detect(gamepad) === "dualsense") {
            return __classPrivateFieldGet(this, _GamepadGameInput_browserType, "f") === "firefox_windows"
                ? __classPrivateFieldGet(this, _GamepadGameInput_mappings, "f").firefoxDualSenseWindows
                : __classPrivateFieldGet(this, _GamepadGameInput_mappings, "f").firefoxDualSenseOther;
        }
        else {
            return __classPrivateFieldGet(this, _GamepadGameInput_mappings, "f").firefoxOther;
        }
    }
    
    
    
    if (gamepad.mapping === "standard") {
        return __classPrivateFieldGet(this, _GamepadGameInput_mappings, "f").standard;
    }
    else {
        return __classPrivateFieldGet(this, _GamepadGameInput_mappings, "f").other;
    }
};
