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
import { GamepadMappingFirefoxDualSense } from "./gamepad_mapping/GamepadMappingFirefoxDualSense";
import { GamepadMappingFirefoxXbox } from "./gamepad_mapping/GamepadMappingFirefoxXbox";
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
            firefoxDualSense: new GamepadMappingFirefoxDualSense(),
            firefoxOther: new GamepadMappingFirefoxXbox(),
            other: new GamepadMappingFallback(),
        });
        __classPrivateFieldSet(this, _GamepadGameInput_browserType, params.browserType, "f");
    }
    startListening() {
        // do nothing
    }
    update(eventsCollector) {
        let wasAnyEventDetected = false;
        for (const gamepad of navigator.getGamepads()) {
            if (!gamepad)
                continue;
            const mapping = __classPrivateFieldGet(this, _GamepadGameInput_instances, "m", _GamepadGameInput_mappingFor).call(this, gamepad);
            gamepad.buttons.forEach((button, buttonIndex) => {
                const event = mapping.eventForButton(buttonIndex, button);
                if (event) {
                    eventsCollector.add(event);
                    wasAnyEventDetected = true;
                }
            });
            gamepad.axes.forEach((axisValue, axisIndex) => {
                mapping.eventsForAxisValue(axisIndex, axisValue).forEach((event) => {
                    eventsCollector.add(event);
                    wasAnyEventDetected = true;
                });
            });
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
    if (gamepad.mapping === "standard") {
        return new GamepadMappingStandard();
    }
    if (__classPrivateFieldGet(this, _GamepadGameInput_browserType, "f") === "firefox") {
        if (GamepadTypeDetector.detect(gamepad) === "dualsense") {
            return new GamepadMappingFirefoxDualSense();
        }
        else {
            // Let's use Xbox as a default one for all other gamepad types in Firefox,
            //   since my gut feeling is the way `GamepadTypeDetector` detects
            //   DualSense would work for DualShock as well.
            return new GamepadMappingFirefoxXbox();
        }
    }
    return new GamepadMappingFallback();
};
