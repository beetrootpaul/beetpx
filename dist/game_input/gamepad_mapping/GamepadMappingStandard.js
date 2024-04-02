var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _GamepadMappingStandard_stickAxisThreshold;

/**
 * Used for the Standard mapping, as described on https:
 *   and indicated by `Gamepad.mapping === "standard"`.
 */
export class GamepadMappingStandard {
    eventForButton(buttonIndex, button) {
        if (!button.pressed)
            return null;
        switch (buttonIndex) {
            case 0: 
            case 3: 
                return "button_a";
            case 1: 
            case 2: 
                return "button_b";
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
                return (axisValue > __classPrivateFieldGet(_a, _a, "f", _GamepadMappingStandard_stickAxisThreshold) ?
                    ["button_right"]
                    : axisValue < -__classPrivateFieldGet(_a, _a, "f", _GamepadMappingStandard_stickAxisThreshold) ?
                        ["button_left"]
                        : []);
            case 1: 
            case 3: 
                return (axisValue > __classPrivateFieldGet(_a, _a, "f", _GamepadMappingStandard_stickAxisThreshold) ?
                    ["button_down"]
                    : axisValue < -__classPrivateFieldGet(_a, _a, "f", _GamepadMappingStandard_stickAxisThreshold) ?
                        ["button_up"]
                        : []);
            default:
                return [];
        }
    }
}
_a = GamepadMappingStandard;
_GamepadMappingStandard_stickAxisThreshold = { value: 0.6 };
