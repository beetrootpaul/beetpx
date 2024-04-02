import { BpxGameInputEvent } from "../GameInput";
import { GamepadMapping } from "./GamepadMapping";

/*

env:
  Windows 10 Home 22H2 (Intel Core i7-3517U), Firefox 121.0 (64 bity)
gamepad:
  8BitDo Lite 2
gamepad ID:
  "2dc8-5112-Bluetooth Wireless Controller   "
buttons:
  - A -> 0
  - B -> 1
  - X -> 3
  - Y -> 4
  - L  -> 6
  - R  -> 7
  - L2 -> 8
  - R2 -> 9
  - dpad up    -> -
  - dpad down  -> -
  - dpad left  -> -
  - dpad right -> -
  - 8BitDo logo -> 12
  - star        ->  -
  - minus       -> 10
  - plus        -> 11
  - left  stick pressed -> 13
  - right stick pressed -> 14
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 5 (  up -1.00 : 1.00 down )
  - dpad -> 9 (from -1.00 +2/7 for each 1/8 turn clockwise:
                 up         -1.00
                 up-right   -0.71
                 right      -0.43
                 down-right -0.14
                 -           0.00 (there is no 0.00)
                 down        0.14
                 down-left   0.43
                 left        0.71
                 up-left     1.00
                 IDLE        1.29
              )

 */

export class GamepadMappingFirefox8BitDoWindows implements GamepadMapping {
  static readonly #stickAxisThreshold: number = 0.6;

  eventForButton(
    buttonIndex: number,
    button: GamepadButton,
  ): BpxGameInputEvent | null {
    if (!button.pressed) return null;

    switch (buttonIndex) {
      case 0: // A
      case 4: // Y
        return "button_a";
      case 1: // B
      case 3: // X
        return "button_b";
      case 10: // minus
      case 11: // plus
        return "button_menu";
    }

    return null;
  }

  eventsForAxisValue(
    axisIndex: number,
    axisValue: number,
  ): BpxGameInputEvent[] {
    // Let's handle d-pad first:
    if (axisIndex === 9) {
      // Transform
      //      up | up-right | right | down-right |    - | down | down-left | left | up-left | IDLE
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
      if (
        normalizedValue < 0.5 ||
        normalizedValue > 15.5 ||
        (normalizedValue > 7.5 && normalizedValue < 8.5)
      ) {
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
        return (
          axisValue > GamepadMappingFirefox8BitDoWindows.#stickAxisThreshold ?
            ["button_right"]
          : (
            axisValue < -GamepadMappingFirefox8BitDoWindows.#stickAxisThreshold
          ) ?
            ["button_left"]
          : []
        );
      case 1: // left stick, vertical
      case 5: // right stick, vertical
        return (
          axisValue > GamepadMappingFirefox8BitDoWindows.#stickAxisThreshold ?
            ["button_down"]
          : (
            axisValue < -GamepadMappingFirefox8BitDoWindows.#stickAxisThreshold
          ) ?
            ["button_up"]
          : []
        );
      default:
        return [];
    }
  }
}
