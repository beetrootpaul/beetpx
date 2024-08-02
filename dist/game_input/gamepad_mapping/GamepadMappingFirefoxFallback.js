export class GamepadMappingFirefoxFallback {
    static #stickAxisThreshold = 0.6;
    eventForButton(buttonIndex, button) {
        if (!button.pressed)
            return null;
        switch (buttonIndex) {
            case 1:
            case 5:
            case 4:
            case 7:
                return "button_O";
            case 2:
            case 3:
            case 0:
            case 6:
                return "button_X";
            case 12:
                return "button_up";
            case 13:
                return "button_down";
            case 14:
                return "button_left";
            case 15:
                return "button_right";
            case 16:
            case 8:
            case 9:
            case 10:
            case 11:
            case 17:
                return "button_menu";
        }
        return null;
    }
    eventsForAxisValue(axisIndex, axisValue) {
        switch (axisIndex) {
            case 0:
            case 2:
                return (axisValue > GamepadMappingFirefoxFallback.#stickAxisThreshold ?
                    ["button_right"]
                    : axisValue < -GamepadMappingFirefoxFallback.#stickAxisThreshold ?
                        ["button_left"]
                        : []);
            case 1:
            case 3:
                return (axisValue > GamepadMappingFirefoxFallback.#stickAxisThreshold ?
                    ["button_down"]
                    : axisValue < -GamepadMappingFirefoxFallback.#stickAxisThreshold ?
                        ["button_up"]
                        : []);
            default:
                return [];
        }
    }
}
//# sourceMappingURL=GamepadMappingFirefoxFallback.js.map