var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _GamepadMappingFirefoxDualSense_stickAxisThreshold;
/*

env:
  macOS Ventura 13.5.2 (Apple M1 Max), Firefox 118.0.2 (64-bit)
gamepad:
  DualSense
gamepad ID:
  "54c-ce6-DualSense Wireless Controller"
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
  - menu (center right) ->  9
  - left  stick pressed -> 10
  - right stick pressed -> 11
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 3 (  up -1.00 : 1.00 down )
  - L2                      -> 5 (idle -1.00 : 1.00 pushed)
  - R2                      -> 6 (idle -1.00 : 1.00 pushed)
  - dpad -> 4 (from -1.00 +2/7 for each 1/8 turn clockwise:
                 up         -1.00
                 up-right   -0.71
                 right      -0.43
                 down-right -0.14
                 IDLE        0.00 (before pressing any d-pad button)
                 down        0.14
                 down-left   0.43
                 left        0.71
                 up-left     1.00
                 IDLE        1.29 (after pressing any d-pad button)
              )


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
  - menu (center right) ->  9
  - left  stick pressed -> 10
  - right stick pressed -> 11
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 5 (  up -1.00 : 1.00 down )
  - L2                      -> 3 (idle -1.00 : 1.00 pushed)
  - R2                      -> 4 (idle -1.00 : 1.00 pushed)
  - dpad -> 4 (from -1.00 +2/7 for each 1/8 turn clockwise:
                 up         -1.00
                 up-right   -0.71
                 right      -0.43
                 down-right -0.14
                 IDLE        0.00 (before pressing any d-pad button)
                 down        0.14
                 down-left   0.43
                 left        0.71
                 up-left     1.00
                 IDLE        1.29 (after pressing any d-pad button)
              )

 */
export class GamepadMappingFirefoxDualSense {
    eventForButton(buttonIndex, button) {
        if (!button.pressed)
            return null;
        switch (buttonIndex) {
            case 0: // square
                return "button_b";
            case 1: // cross
                return "button_a";
            case 2: // circle
                return "button_b";
            case 3: // triangle
                return "button_a";
            case 9: // menu (tiny in the center-right)
                return "button_menu";
        }
        return null;
    }
    eventsForAxisValue(axisIndex, axisValue) {
        // Let's handle d-pad first:
        if (axisIndex === 4) {
            // Transform
            //      up | up-right | right | down-right | IDLE | down | down-left | left | up-left | IDLE
            // from
            //   -1.00 |    -0.71 | -0.43 |      -0.14 | 0.00 | 0.14 |      0.43 | 0.71 |    1.00 | 1.29
            // to
            //       1 |        3 |     5 |          7 |    8 |    9 |        11 |   13 |      15 |   17
            // where 0.5 means a half of 1/8 turn, which we can use as a simple threshold
            // to detect values close to a given 1/8 turn direction.
            const normalizedValue = axisValue * (14 / 2) + 8;
            // Now, 0.5 is a maximum allowed offset to prevent overlap between
            //   down-right (7 -> 6.5-7.5),
            //   IDLE (8 -> 7.5-8.5),
            //   and down-left (9 -> 8.5-9.5).
            // Let's use it to detect values we do not care about.
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
            case 0: // left stick, horizontal
            case 2: // right stick, horizontal
                return axisValue > __classPrivateFieldGet(GamepadMappingFirefoxDualSense, _a, "f", _GamepadMappingFirefoxDualSense_stickAxisThreshold)
                    ? ["button_right"]
                    : axisValue < -__classPrivateFieldGet(GamepadMappingFirefoxDualSense, _a, "f", _GamepadMappingFirefoxDualSense_stickAxisThreshold)
                        ? ["button_left"]
                        : [];
            case 1: // left stick, vertical
            case 3: // right stick, vertical
                return axisValue > __classPrivateFieldGet(GamepadMappingFirefoxDualSense, _a, "f", _GamepadMappingFirefoxDualSense_stickAxisThreshold)
                    ? ["button_down"]
                    : axisValue < -__classPrivateFieldGet(GamepadMappingFirefoxDualSense, _a, "f", _GamepadMappingFirefoxDualSense_stickAxisThreshold)
                        ? ["button_up"]
                        : [];
            default:
                return [];
        }
    }
}
_a = GamepadMappingFirefoxDualSense;
_GamepadMappingFirefoxDualSense_stickAxisThreshold = { value: 0.6 };
