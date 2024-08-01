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

/**
 * Here we use Xbox as a default one for all other gamepad types in Firefox,
 *   since my gut feeling is the way `GamepadTypeDetector` detects
 *   DualSense would work for DualShock as well, therefore better assume
 *   there will be more cases of Xbox controller not detected as such.
 */
export class GamepadMappingFirefoxFallback implements GamepadMapping {
  static readonly #stickAxisThreshold: number = 0.6;

  eventForButton(
    buttonIndex: number,
    button: GamepadButton,
  ): BpxGameInputEvent | null {
    if (!button.pressed) return null;

    switch (buttonIndex) {
      case 1: // Xbox One controller: A
      case 5: // Xbox One controller: Y
      case 4:
      case 7:
        return "button_O";
      case 2: // Xbox One controller: B
      case 3: // Xbox One controller: X
      case 0:
      case 6:
        return "button_X";
      case 12: // Xbox One controller: d-pad up
        return "button_up";
      case 13: // Xbox One controller: d-pad down
        return "button_down";
      case 14: // Xbox One controller: d-pad left
        return "button_left";
      case 15: // Xbox One controller: d-pad right
        return "button_right";
      case 16: // Xbox One controller: menu (tiny in the center-right)
      case 8:
      case 9:
      case 10:
      case 11:
      case 17:
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
        return (
          axisValue > GamepadMappingFirefoxFallback.#stickAxisThreshold ?
            ["button_right"]
          : axisValue < -GamepadMappingFirefoxFallback.#stickAxisThreshold ?
            ["button_left"]
          : []
        );
      case 1: // left stick, vertical
      case 3: // right stick, vertical
        return (
          axisValue > GamepadMappingFirefoxFallback.#stickAxisThreshold ?
            ["button_down"]
          : axisValue < -GamepadMappingFirefoxFallback.#stickAxisThreshold ?
            ["button_up"]
          : []
        );
      default:
        return [];
    }
  }
}
