import { BpxGameInputEvent } from "../GameInput";
import { GamepadMapping } from "./GamepadMapping";

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
                 down        0.14
                 down-left   0.43
                 left        0.71
                 up-left     1.00
                 idle        1.29
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
                 down        0.14
                 down-left   0.43
                 left        0.71
                 up-left     1.00
                 idle        1.29
              )

 */

export class GamepadMappingFirefoxDualSense implements GamepadMapping {
  eventForButton(
    buttonIndex: number,
    button: GamepadButton,
  ): BpxGameInputEvent | null {
    if (!button.pressed) return null;

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

  eventForAxisValue(
    axisIndex: number,
    axisValue: number,
  ): BpxGameInputEvent | null {
    return null;
  }
}
