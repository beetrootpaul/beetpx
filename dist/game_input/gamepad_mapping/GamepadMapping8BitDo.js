
export class GamepadMapping8BitDo {
    static #stickAxisThreshold = 0.6;
    eventForButton(buttonIndex, button) {
        if (!button.pressed)
            return null;
        switch (buttonIndex) {
            case 0: 
            case 4: 
                return "button_a";
            case 1: 
            case 3: 
                return "button_b";
            case 10: 
            case 11: 
                return "button_menu";
        }
        return null;
    }
    eventsForAxisValue(axisIndex, axisValue) {
        
        if (axisIndex === 9) {
            
            
            
            
            
            
            
            
            const normalizedValue = axisValue * (14 / 2) + 8;
            
            
            
            
            
            if (normalizedValue < 0.5 ||
                normalizedValue > 15.5 ||
                (normalizedValue > 7.5 && normalizedValue < 8.5)) {
                return [];
            }
            const whichOneEight = Math.round(normalizedValue);
            switch (whichOneEight) {
                case 1:
                    return ["button_up"];
                case 3:
                    return ["button_up", "button_right"];
                case 5:
                    return ["button_right"];
                case 7:
                    return ["button_down", "button_right"];
                case 9:
                    return ["button_down"];
                case 11:
                    return ["button_down", "button_left"];
                case 13:
                    return ["button_left"];
                case 15:
                    return ["button_up", "button_left"];
                default:
                    return [];
            }
        }
        switch (axisIndex) {
            case 0: 
            case 2: 
                return (axisValue > GamepadMapping8BitDo.#stickAxisThreshold ?
                    ["button_right"]
                    : axisValue < -GamepadMapping8BitDo.#stickAxisThreshold ?
                        ["button_left"]
                        : []);
            case 1: 
            case 5: 
                return (axisValue > GamepadMapping8BitDo.#stickAxisThreshold ? ["button_down"]
                    : axisValue < -GamepadMapping8BitDo.#stickAxisThreshold ?
                        ["button_up"]
                        : []);
            default:
                return [];
        }
    }
}
