import { BpxGameInputEvent } from "../GameInput";
import { GamepadMapping } from "./GamepadMapping";

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

export class GamepadMappingFirefoxDualSenseWindows implements GamepadMapping {
  static readonly #stickAxisThreshold: number = 0.6;

  eventForButton(
    buttonIndex: number,
    button: GamepadButton,
  ): BpxGameInputEvent | null {
    if (!button.pressed) return null;

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

  eventsForAxisValue(
    axisIndex: number,
    axisValue: number,
  ): BpxGameInputEvent[] {
    switch (axisIndex) {
      case 0: // left stick, horizontal
      case 2: // right stick, horizontal
        return axisValue >
          GamepadMappingFirefoxDualSenseWindows.#stickAxisThreshold
          ? ["button_right"]
          : axisValue <
              -GamepadMappingFirefoxDualSenseWindows.#stickAxisThreshold
            ? ["button_left"]
            : [];
      case 1: // left stick, vertical
      case 5: // right stick, vertical
        return axisValue >
          GamepadMappingFirefoxDualSenseWindows.#stickAxisThreshold
          ? ["button_down"]
          : axisValue <
              -GamepadMappingFirefoxDualSenseWindows.#stickAxisThreshold
            ? ["button_up"]
            : [];
      default:
        return [];
    }
  }
}
