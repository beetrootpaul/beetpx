var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _GamepadMappingFirefoxDualSenseWindows_stickAxisThreshold;
/*

env:
  Windows 10 Home 22H2 (Intel Core i7-3517U), Firefox 118.0.2 (64-bit)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Firefox 119.0 (64-bit)
gamepad:
  DualSense
gamepad ID:
  "054c-0ce6-Wireless Controller"
buttons:
  - cross    -> 1
  - circle   -> 2
  - square   -> 0
  - triangle -> 3
  - L1 -> 4
  - R1 -> 5
  - L2 -> 6
  - R2 -> 7
  - dpad up    -> -
  - dpad down  -> -
  - dpad left  -> -
  - dpad right -> -
  - touch panel press -> 13
  - PS logo               -> 12
  - microphone            ->  -
  - create (center left ) ->  8
  - menu   (center right) ->  9
  - left  stick pressed -> 10
  - right stick pressed -> 11
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 5 (  up -1.00 : 1.00 down )
  - L2                      -> 3 (idle -1.00 : 1.00 pushed)
  - R2                      -> 4 (idle -1.00 : 1.00 pushed)
  - dpad -> -

 */
export class GamepadMappingFirefoxDualSenseWindows {
    eventForButton(buttonIndex, button) {
        if (!button.pressed)
            return null;
        switch (buttonIndex) {
            case 1: // cross
            case 3: // triangle
                return "button_a";
            case 0: // square
            case 2: // circle
                return "button_b";
            case 9: // menu (tiny in the center-right)
                return "button_menu";
        }
        return null;
    }
    eventsForAxisValue(axisIndex, axisValue) {
        switch (axisIndex) {
            case 0: // left stick, horizontal
            case 2: // right stick, horizontal
                return axisValue >
                    __classPrivateFieldGet(GamepadMappingFirefoxDualSenseWindows, _a, "f", _GamepadMappingFirefoxDualSenseWindows_stickAxisThreshold)
                    ? ["button_right"]
                    : axisValue <
                        -__classPrivateFieldGet(GamepadMappingFirefoxDualSenseWindows, _a, "f", _GamepadMappingFirefoxDualSenseWindows_stickAxisThreshold)
                        ? ["button_left"]
                        : [];
            case 1: // left stick, vertical
            case 5: // right stick, vertical
                return axisValue >
                    __classPrivateFieldGet(GamepadMappingFirefoxDualSenseWindows, _a, "f", _GamepadMappingFirefoxDualSenseWindows_stickAxisThreshold)
                    ? ["button_down"]
                    : axisValue <
                        -__classPrivateFieldGet(GamepadMappingFirefoxDualSenseWindows, _a, "f", _GamepadMappingFirefoxDualSenseWindows_stickAxisThreshold)
                        ? ["button_up"]
                        : [];
            default:
                return [];
        }
    }
}
_a = GamepadMappingFirefoxDualSenseWindows;
_GamepadMappingFirefoxDualSenseWindows_stickAxisThreshold = { value: 0.6 };
