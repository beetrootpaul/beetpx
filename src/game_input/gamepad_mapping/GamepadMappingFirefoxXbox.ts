import { BpxGameInputEvent } from "../GameInput";
import { GamepadMapping } from "./GamepadMapping";

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

export class GamepadMappingFirefoxXbox implements GamepadMapping {
  eventForButton(
    buttonIndex: number,
    button: GamepadButton,
  ): BpxGameInputEvent | null {
    if (!button.pressed) return null;

    switch (buttonIndex) {
      case 1: // A
        return "button_a";
      case 2: // B
        return "button_b";
      case 3: // X
        return "button_b";
      case 5: // Y
        return "button_a";
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

  eventForAxisValue(
    axisIndex: number,
    axisValue: number,
  ): BpxGameInputEvent | null {
    return null;
  }
}
