var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _GamepadMappingFirefoxXbox_stickAxisThreshold;
/*

env:
  macOS Ventura 13.5.2 (Apple M1 Max), Firefox 118.0.2 (64-bit)
gamepad:
  Xbox One
gamepad ID:
  "45e-2fd-Xbox Wireless Controller"
buttons:
  - A -> 1
  - B -> 2
  - X -> 3
  - Y -> 5
  - LB -> 5
  - RB -> 8
  - LT -> -
  - RT -> -
  - dpad up    -> 12
  - dpad down  -> 13
  - dpad left  -> 14
  - dpad right -> 15
  - Xbox logo           ->  0
  - view (center left ) ->  8
  - menu (center right) -> 16
  - left  stick pressed -> 11
  - right stick pressed -> 16
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 3 (  up -1.00 : 1.00 down )


env:
  Windows 10 Home 22H2 (Intel Core i7-3517U), Firefox 118.0.2 (64-bit)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Firefox 119.0 (64-bit)
gamepad:
  Xbox One
gamepad ID:
  "xinput"
buttons:
  unresponsive
 axes and their ranges:
  unresponsive

 */
export class GamepadMappingFirefoxXbox {
    eventForButton(buttonIndex, button) {
        if (!button.pressed)
            return null;
        switch (buttonIndex) {
            case 1: // A
            case 5: // Y
                return "button_a";
            case 2: // B
            case 3: // X
                return "button_b";
            case 12: // d-pad up
                return "button_up";
            case 13: // d-pad down
                return "button_down";
            case 14: // d-pad left
                return "button_left";
            case 15: // d-pad right
                return "button_right";
            case 16: // menu (tiny in the center-right)
                return "button_menu";
        }
        return null;
    }
    eventsForAxisValue(axisIndex, axisValue) {
        switch (axisIndex) {
            case 0: // left stick, horizontal
            case 2: // right stick, horizontal
                return axisValue > __classPrivateFieldGet(GamepadMappingFirefoxXbox, _a, "f", _GamepadMappingFirefoxXbox_stickAxisThreshold)
                    ? ["button_right"]
                    : axisValue < -__classPrivateFieldGet(GamepadMappingFirefoxXbox, _a, "f", _GamepadMappingFirefoxXbox_stickAxisThreshold)
                        ? ["button_left"]
                        : [];
            case 1: // left stick, vertical
            case 3: // right stick, vertical
                return axisValue > __classPrivateFieldGet(GamepadMappingFirefoxXbox, _a, "f", _GamepadMappingFirefoxXbox_stickAxisThreshold)
                    ? ["button_down"]
                    : axisValue < -__classPrivateFieldGet(GamepadMappingFirefoxXbox, _a, "f", _GamepadMappingFirefoxXbox_stickAxisThreshold)
                        ? ["button_up"]
                        : [];
            default:
                return [];
        }
    }
}
_a = GamepadMappingFirefoxXbox;
_GamepadMappingFirefoxXbox_stickAxisThreshold = { value: 0.6 };
