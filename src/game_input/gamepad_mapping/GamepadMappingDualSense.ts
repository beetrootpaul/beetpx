import { BpxGameInputEvent } from "../GameInput";
import { GamepadMapping } from "./GamepadMapping";

/*

env:
  macOS Ventura 13.5.2 (Apple M1 Max), Safari 16.6 (18615.3.12.11.2)
gamepad:
  DualSense
gamepad ID:
  "54c-ce6-DualSense Wireless Controller"
buttons:
  - cross    -> 0
  - circle   -> 1
  - square   -> 2
  - triangle -> 3
  - L1 -> 4
  - R1 -> 5
  - L2 -> 6
  - R2 -> 7
  - dpad up    -> 12
  - dpad down  -> 13
  - dpad left  -> 14
  - dpad right -> 15
  - touch panel press     -> -
  - PS logo               -> 16
  - microphone            ->  -
  - create (center left ) ->  8
  - menu   (center right) ->  9
  - left  stick pressed   -> 10
  - right stick pressed   -> 11
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 3 (  up -1.00 : 1.00 down )
  - L2                      -> -
  - R2                      -> -
  - dpad -> -

env:
  macOS Ventura 13.5.2 (Apple M1 Max), Arc 1.13.1 (42579), Chromium Framework Version 118.0.5993.88
  macOS Ventura 13.5.2 (Apple M1 Max), Brave 1.59.122 Chromium: 118.0.5993.96 (Official Build) (arm64)
  macOS Ventura 13.5.2 (Apple M1 Max), Chrome 118.0.5993.88 (Official Build) (arm64)
  macOS Ventura 13.5.2 (Apple M1 Max), Edge 118.0.2088.61 (Official build) (arm64)
  macOS Ventura 13.5.2 (Apple M1 Max), Opera One (version: 103.0.4928.34) (arm64)
  macOS Ventura 13.5.2 (Apple M1 Max), Vivaldi 6.2.3105.58 (Stable channel) (arm64)
gamepad:
  DualSense
gamepad ID:
  "DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)"
buttons:
  - cross    -> 0
  - circle   -> 1
  - square   -> 2
  - triangle -> 3
  - L1 -> 4
  - R1 -> 5
  - L2 -> 6  ("touched: true" if half-pressed, "value": from 0 to 1)
  - R2 -> 7  ("touched: true" if half-pressed, "value": from 0 to 1)
  - dpad up    -> 12
  - dpad down  -> 13
  - dpad left  -> 14
  - dpad right -> 15
  - touch panel press     -> 17
  - PS logo               -> 16
  - microphone            ->  -
  - create (center left ) ->  8
  - menu   (center right) ->  9
  - left  stick pressed   -> 10
  - right stick pressed   -> 11
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 3 (  up -1.00 : 1.00 down )
  - L2                      -> -
  - R2                      -> -
  - dpad -> -
  - dpad -> -

env:
  Windows 10 Home 22H2 (Intel Core i7-3517U), Brave 1.59.120 Chromium: 118.0.5993.88 (Official Build) (64-bit)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Chrome 118.0.5993.89 (Official Build) (64-bit)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Edge 118.0.2088.57 (Official build) (64-bit)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Opera One (version: 103.0.4928.34)
  Windows 10 Home 22H2 (Intel Core i7-3517U), Vivaldi 6.2.3105.58 (Stable channel) (64-bit)
gamepad:
  DualSense
gamepad ID:
  "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)"
buttons:
  - cross    -> 0
  - circle   -> 1
  - square   -> 2
  - triangle -> 3
  - L1 -> 4
  - R1 -> 5
  - L2 -> 6 ("touched: true" if half-pressed, "value": from 0 to 1)
  - R2 -> 7 ("touched: true" if half-pressed, "value": from 0 to 1)
  - dpad up    -> 12
  - dpad down  -> 13
  - dpad left  -> 14
  - dpad right -> 15
  - touch panel press     -> 17
  - PS logo               -> 16
  - microphone            ->  -
  - create (center left ) ->  8
  - menu   (center right) ->  9
  - left  stick pressed   -> 10
  - right stick pressed   -> 11
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 3 (  up -1.00 : 1.00 down )
  - L2                      -> -
  - R2                      -> -
  - dpad -> -

 */

export class GamepadMappingDualSense implements GamepadMapping {
  static readonly #stickAxisThreshold: number = 0.6;

  eventForButton(
    buttonIndex: number,
    button: GamepadButton,
  ): BpxGameInputEvent | null {
    if (!button.pressed) return null;

    switch (buttonIndex) {
      case 1: // circle
      case 2: // square
        return "button_O";
      case 0: // cross
      case 3: // triangle
        return "button_X";
      case 12: // d-pad up
        return "button_up";
      case 13: // d-pad down
        return "button_down";
      case 14: // d-pad left
        return "button_left";
      case 15: // d-pad right
        return "button_right";
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
        return axisValue > GamepadMappingDualSense.#stickAxisThreshold
          ? ["button_right"]
          : axisValue < -GamepadMappingDualSense.#stickAxisThreshold
            ? ["button_left"]
            : [];
      case 1: // left stick, vertical
      case 3: // right stick, vertical
        return axisValue > GamepadMappingDualSense.#stickAxisThreshold
          ? ["button_down"]
          : axisValue < -GamepadMappingDualSense.#stickAxisThreshold
            ? ["button_up"]
            : [];
      default:
        return [];
    }
  }
}
