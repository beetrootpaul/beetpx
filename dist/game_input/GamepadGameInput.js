"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GamepadGameInput_axisMapping;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamepadGameInput = void 0;
class GamepadGameInput {
    constructor() {
        this.buttonMapping = new Map([
            [14, "button_left"],
            [15, "button_right"],
            [12, "button_up"],
            [13, "button_down"],
            //
            [1, "button_o"],
            [5, "button_o"],
            [2, "button_x"],
            [3, "button_x"],
            //
            [8, "button_menu"],
            [16, "button_menu"],
        ]);
        this.axisThreshold = 0.6;
        _GamepadGameInput_axisMapping.set(this, new Map([
            // keys here are: 100 * axis index + sign(axis value)
            [-1, "button_left"],
            [1, "button_right"],
            [99, "button_up"],
            [101, "button_down"],
            [199, "button_left"],
            [201, "button_right"],
            [299, "button_up"],
            [301, "button_down"],
        ]));
    }
    startListening() {
        // nothing to be done here
    }
    update(eventsCollector) {
        navigator.getGamepads().forEach((gamepad) => {
            if (gamepad) {
                gamepad.buttons.forEach((button, buttonIndex) => {
                    if (button.pressed || button.touched) {
                        const gameInputEvent = this.buttonMapping.get(buttonIndex);
                        if (gameInputEvent) {
                            eventsCollector.add(gameInputEvent);
                        }
                    }
                });
                gamepad.axes.forEach((axis, axisIndex) => {
                    if (Math.abs(axis) > this.axisThreshold) {
                        const gameInputEvent = __classPrivateFieldGet(this, _GamepadGameInput_axisMapping, "f").get(100 * axisIndex + Math.sign(axis));
                        if (gameInputEvent) {
                            eventsCollector.add(gameInputEvent);
                        }
                    }
                });
            }
        });
    }
}
exports.GamepadGameInput = GamepadGameInput;
_GamepadGameInput_axisMapping = new WeakMap();
