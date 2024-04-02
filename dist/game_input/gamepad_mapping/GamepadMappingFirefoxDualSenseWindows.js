var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _GamepadMappingFirefoxDualSenseWindows_stickAxisThreshold;

export class GamepadMappingFirefoxDualSenseWindows {
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
                    __classPrivateFieldGet(_a, _a, "f", _GamepadMappingFirefoxDualSenseWindows_stickAxisThreshold)) ?
                    ["button_right"]
                    : (axisValue <
                        -__classPrivateFieldGet(_a, _a, "f", _GamepadMappingFirefoxDualSenseWindows_stickAxisThreshold)) ?
                        ["button_left"]
                        : []);
            case 1: 
            case 5: 
                return ((axisValue >
                    __classPrivateFieldGet(_a, _a, "f", _GamepadMappingFirefoxDualSenseWindows_stickAxisThreshold)) ?
                    ["button_down"]
                    : (axisValue <
                        -__classPrivateFieldGet(_a, _a, "f", _GamepadMappingFirefoxDualSenseWindows_stickAxisThreshold)) ?
                        ["button_up"]
                        : []);
            default:
                return [];
        }
    }
}
_a = GamepadMappingFirefoxDualSenseWindows;
_GamepadMappingFirefoxDualSenseWindows_stickAxisThreshold = { value: 0.6 };
