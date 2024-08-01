
export class GamepadMappingSafari8BitDo {
    static #stickAxisThreshold = 0.6;
    eventForButton(buttonIndex, button) {
        if (!button.pressed)
            return null;
        switch (buttonIndex) {
            case 0: 
            case 3: 
                return "button_O";
            case 1: 
            case 2: 
                return "button_X";
            case 12: 
                return "button_up";
            case 13: 
                return "button_down";
            case 14: 
                return "button_left";
            case 15: 
                return "button_right";
            case 8: 
            case 9: 
                return "button_menu";
        }
        return null;
    }
    eventsForAxisValue(axisIndex, axisValue) {
        switch (axisIndex) {
            case 0: 
            case 2: 
                return (axisValue > GamepadMappingSafari8BitDo.#stickAxisThreshold ?
                    ["button_right"]
                    : axisValue < -GamepadMappingSafari8BitDo.#stickAxisThreshold ?
                        ["button_left"]
                        : []);
            case 1: 
            case 3: 
                return (axisValue > GamepadMappingSafari8BitDo.#stickAxisThreshold ?
                    ["button_down"]
                    : axisValue < -GamepadMappingSafari8BitDo.#stickAxisThreshold ?
                        ["button_up"]
                        : []);
            default:
                return [];
        }
    }
}
