var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GamepadGameInput_mappings;
import { u_ } from "../Utils";
import { gamepadMappingFor, } from "./gamepad_mapping/GamepadMapping";
import { GamepadTypeDetector } from "./GamepadTypeDetector";
export const supportedGamepadTypes = ["xbox", "dualsense", "other"];
export class GamepadGameInput {
    constructor(params) {
        this.inputMethod = "gamepad";
        _GamepadGameInput_mappings.set(this, new Map());
        supportedGamepadTypes.forEach((gamepadType) => {
            __classPrivateFieldGet(this, _GamepadGameInput_mappings, "f").set(gamepadType, gamepadMappingFor(gamepadType, params.browserType));
        });
    }
    startListening() {
        // do nothing
    }
    update(eventsCollector) {
        let wasAnyEventDetected = false;
        for (const gamepad of navigator.getGamepads()) {
            if (!gamepad)
                continue;
            const mapping = __classPrivateFieldGet(this, _GamepadGameInput_mappings, "f").get(GamepadTypeDetector.detect(gamepad));
            if (!mapping)
                continue;
            console.group(GamepadTypeDetector.detect(gamepad));
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
                    console.log(event);
                    wasAnyEventDetected = true;
                });
            });
            console.groupEnd();
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
_GamepadGameInput_mappings = new WeakMap();
