var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _GamepadMappingFirefoxDualSenseOther_stickAxisThreshold;

export class GamepadMappingFirefoxDualSenseOther {
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
        
        if (axisIndex === 4) {
            
            
            
            
            
            
            
            
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
                return axisValue >
                    __classPrivateFieldGet(GamepadMappingFirefoxDualSenseOther, _a, "f", _GamepadMappingFirefoxDualSenseOther_stickAxisThreshold)
                    ? ["button_right"]
                    : axisValue < -__classPrivateFieldGet(GamepadMappingFirefoxDualSenseOther, _a, "f", _GamepadMappingFirefoxDualSenseOther_stickAxisThreshold)
                        ? ["button_left"]
                        : [];
            case 1: 
            case 3: 
                return axisValue >
                    __classPrivateFieldGet(GamepadMappingFirefoxDualSenseOther, _a, "f", _GamepadMappingFirefoxDualSenseOther_stickAxisThreshold)
                    ? ["button_down"]
                    : axisValue < -__classPrivateFieldGet(GamepadMappingFirefoxDualSenseOther, _a, "f", _GamepadMappingFirefoxDualSenseOther_stickAxisThreshold)
                        ? ["button_up"]
                        : [];
            default:
                return [];
        }
    }
}
_a = GamepadMappingFirefoxDualSenseOther;
_GamepadMappingFirefoxDualSenseOther_stickAxisThreshold = { value: 0.6 };
