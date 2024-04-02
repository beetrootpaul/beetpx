var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _GamepadMappingFirefoxFallback_stickAxisThreshold;

/**
 * Here we use Xbox as a default one for all other gamepad types in Firefox,
 *   since my gut feeling is the way `GamepadTypeDetector` detects
 *   DualSense would work for DualShock as well, therefore better assume
 *   there will be more cases of Xbox controller not detected as such.
 */
export class GamepadMappingFirefoxFallback {
    eventForButton(buttonIndex, button) {
        if (!button.pressed)
            return null;
        switch (buttonIndex) {
            case 1: 
            case 5: 
            case 4:
            case 7:
                return "button_a";
            case 2: 
            case 3: 
            case 0:
            case 6:
                return "button_b";
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
                return (axisValue > __classPrivateFieldGet(_a, _a, "f", _GamepadMappingFirefoxFallback_stickAxisThreshold) ?
                    ["button_right"]
                    : axisValue < -__classPrivateFieldGet(_a, _a, "f", _GamepadMappingFirefoxFallback_stickAxisThreshold) ?
                        ["button_left"]
                        : []);
            case 1: 
            case 3: 
                return (axisValue > __classPrivateFieldGet(_a, _a, "f", _GamepadMappingFirefoxFallback_stickAxisThreshold) ?
                    ["button_down"]
                    : axisValue < -__classPrivateFieldGet(_a, _a, "f", _GamepadMappingFirefoxFallback_stickAxisThreshold) ?
                        ["button_up"]
                        : []);
            default:
                return [];
        }
    }
}
_a = GamepadMappingFirefoxFallback;
_GamepadMappingFirefoxFallback_stickAxisThreshold = { value: 0.6 };
