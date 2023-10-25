var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GamepadGameInput_axisThreshold, _GamepadGameInput_axisMapping, _GamepadGameInput_dualSenseDpadValueRanges, _GamepadGameInput_mappings;
import { u_ } from "../Utils";
import { gamepadMappingFor, } from "./gamepad_mapping/GamepadMapping";
import { GamepadTypeDetector } from "./GamepadTypeDetector";
// TODO: EXTRACT
// Constants for DualSense calculations. Not inside the class for sake of access brevity.
const ds = {
    dpadAxisIndex: 4,
    dpadStep: 2 / 7,
    dpadRangeThreshold: 0.25 * (2 / 7),
};
export const supportedGamepadTypes = ["xbox", "dualsense", "other"];
export class GamepadGameInput {
    constructor(params) {
        this.inputMethod = "gamepad";
        // TODO: EXTRACT
        this.buttonMapping = new Map([
            [0, "button_a"],
            [1, "button_a"],
            [2, "button_b"],
            [3, "button_b"],
            [5, "button_a"],
            [8, "button_menu"],
            [9, "button_menu"],
            [12, "button_up"],
            [13, "button_down"],
            [14, "button_left"],
            [15, "button_right"],
            [16, "button_menu"],
        ]);
        // TODO: EXTRACT
        _GamepadGameInput_axisThreshold.set(this, 0.6);
        // TODO: EXTRACT
        _GamepadGameInput_axisMapping.set(this, new Map([
            // keys here are: 100 * axis index + sign(axis value)
            [0 - 1, "button_left"],
            [0 + 1, "button_right"],
            [100 - 1, "button_up"],
            [100 + 1, "button_down"],
            [200 - 1, "button_left"],
            [200 + 1, "button_right"],
            [300 - 1, "button_up"],
            [300 + 1, "button_down"],
        ]));
        // TODO: EXTRACT
        // [min, max, event]
        _GamepadGameInput_dualSenseDpadValueRanges.set(this, [
            [-1, -1 + 2 / 7, "button_up"],
            [-1 + 2 / 7, -1 + 3 * (2 / 7), "button_right"],
            [-1 + 3 * (2 / 7), -1 + 5 * (2 / 7), "button_down"],
            [-1 + 5 * (2 / 7), -1 + 7 * (2 / 7), "button_left"],
            [-1 + 7 * (2 / 7), -1 + 7 * (2 / 7), "button_up"],
        ]);
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
            gamepad.buttons.forEach((button, buttonIndex) => {
                const event = mapping.eventForButton(buttonIndex, button);
                if (event) {
                    eventsCollector.add(event);
                    wasAnyEventDetected = true;
                }
            });
            gamepad.axes.forEach((axisValue, axisIndex) => {
                const event = mapping.eventForAxisValue(axisIndex, axisValue);
                if (event) {
                    eventsCollector.add(event);
                    wasAnyEventDetected = true;
                }
                // TODO
                // if (axisIndex === ds.dpadAxisIndex) {
                //           this.#dualSenseDpadValueRanges.forEach(
                //             ([min, max, gameInputEvent]) => {
                //               if (
                //                 axis > min - ds.dpadRangeThreshold &&
                //                 axis < max + ds.dpadRangeThreshold
                //               ) {
                //                 eventsCollector.add(gameInputEvent);
                //                 wasAnyEventDetected = true;
                //               }
                //             },
                //           );
                //         } else {
                //           if (Math.abs(axis) > this.#axisThreshold) {
                //             const gameInputEvent = this.#axisMapping.get(
                //               100 * axisIndex + Math.sign(axis),
                //             );
                //             if (gameInputEvent) {
                //               eventsCollector.add(gameInputEvent);
                //               wasAnyEventDetected = true;
                //             }
                //           }
                //         }
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
_GamepadGameInput_axisThreshold = new WeakMap(), _GamepadGameInput_axisMapping = new WeakMap(), _GamepadGameInput_dualSenseDpadValueRanges = new WeakMap(), _GamepadGameInput_mappings = new WeakMap();
