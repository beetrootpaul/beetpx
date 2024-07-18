
export class GamepadMappingFirefoxDualSenseWindows {
    static #stickAxisThreshold = 0.6;
    eventForButton(buttonIndex, button) {
        if (!button.pressed)
            return null;
        switch (buttonIndex) {
            case 1: 
            case 3: 
                return "button_a";
            case 0: 
            case 2: 
                return "button_b";
            case 9: 
                return "button_menu";
        }
        return null;
    }
    eventsForAxisValue(axisIndex, axisValue) {
        switch (axisIndex) {
            case 0: 
            case 2: 
                return ((axisValue >
                    GamepadMappingFirefoxDualSenseWindows.#stickAxisThreshold) ?
                    ["button_right"]
                    : (axisValue <
                        -GamepadMappingFirefoxDualSenseWindows.#stickAxisThreshold) ?
                        ["button_left"]
                        : []);
            case 1: 
            case 5: 
                return ((axisValue >
                    GamepadMappingFirefoxDualSenseWindows.#stickAxisThreshold) ?
                    ["button_down"]
                    : (axisValue <
                        -GamepadMappingFirefoxDualSenseWindows.#stickAxisThreshold) ?
                        ["button_up"]
                        : []);
            default:
                return [];
        }
    }
}
