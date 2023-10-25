var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _GamepadMappingFallback_stickAxisThreshold;
/**
 * A mapping which tries to map all the available buttons just in case
 *   any of them will work for the user. Based on the Standard mapping.
 */
export class GamepadMappingFallback {
    eventForButton(buttonIndex, button) {
        if (!button.pressed)
            return null;
        switch (buttonIndex) {
            case 0:
            case 3:
            case 4:
            case 7:
                return "button_a";
            case 1:
            case 2:
            case 5:
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
            case 8:
            case 9:
            case 10:
            case 11:
            case 16:
            case 17:
                return "button_menu";
        }
        return null;
    }
    eventsForAxisValue(axisIndex, axisValue) {
        switch (axisIndex) {
            case 0:
            case 2:
                return axisValue > __classPrivateFieldGet(GamepadMappingFallback, _a, "f", _GamepadMappingFallback_stickAxisThreshold)
                    ? ["button_right"]
                    : axisValue < -__classPrivateFieldGet(GamepadMappingFallback, _a, "f", _GamepadMappingFallback_stickAxisThreshold)
                        ? ["button_left"]
                        : [];
            case 1:
            case 3:
                return axisValue > __classPrivateFieldGet(GamepadMappingFallback, _a, "f", _GamepadMappingFallback_stickAxisThreshold)
                    ? ["button_down"]
                    : axisValue < -__classPrivateFieldGet(GamepadMappingFallback, _a, "f", _GamepadMappingFallback_stickAxisThreshold)
                        ? ["button_up"]
                        : [];
            default:
                return [];
        }
    }
}
_a = GamepadMappingFallback;
_GamepadMappingFallback_stickAxisThreshold = { value: 0.6 };
