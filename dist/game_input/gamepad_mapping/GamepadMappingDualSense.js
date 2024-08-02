export class GamepadMappingDualSense {
    static #stickAxisThreshold = 0.6;
    eventForButton(buttonIndex, button) {
        if (!button.pressed)
            return null;
        switch (buttonIndex) {
            case 1:
            case 2:
                return "button_O";
            case 0:
            case 3:
                return "button_X";
            case 12:
                return "button_up";
            case 13:
                return "button_down";
            case 14:
                return "button_left";
            case 15:
                return "button_right";
            case 9:
                return "button_menu";
        }
        return null;
    }
    eventsForAxisValue(axisIndex, axisValue) {
        switch (axisIndex) {
            case 0:
            case 2:
                return (axisValue > GamepadMappingDualSense.#stickAxisThreshold ?
                    ["button_right"]
                    : axisValue < -GamepadMappingDualSense.#stickAxisThreshold ?
                        ["button_left"]
                        : []);
            case 1:
            case 3:
                return (axisValue > GamepadMappingDualSense.#stickAxisThreshold ?
                    ["button_down"]
                    : axisValue < -GamepadMappingDualSense.#stickAxisThreshold ?
                        ["button_up"]
                        : []);
            default:
                return [];
        }
    }
}
//# sourceMappingURL=GamepadMappingDualSense.js.map