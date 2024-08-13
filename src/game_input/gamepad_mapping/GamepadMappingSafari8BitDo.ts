import { BpxGameInputEvent } from "../GameInput";
import { GamepadMapping } from "./GamepadMapping";

/*

env:
  macOS Sonoma 14.1.1 (Apple M1 Max), Safari 17.1 (19616.2.9.11.7)
gamepad:
  8BitDo Lite 2
gamepad ID:
  "8BitDo Lite 2 Extended Gamepad"
buttons:
  - A -> 0
  - B -> 1
  - X -> 2
  - Y -> 3
  - L  -> 4
  - R  -> 5
  - L2 -> 6
  - R2 -> 7
  - dpad up    -> 12
  - dpad down  -> 13
  - dpad left  -> 14
  - dpad right -> 15
  - 8BitDo logo -> 16
  - star        ->  -
  - minus       ->  8
  - plus        ->  9
  - left  stick pressed -> 10
  - right stick pressed -> 11
 axes and their ranges:
  - left  stick, horizontal -> 0 (left -1.00 : 1.00 right)
  - left  stick, vertical   -> 1 (  up -1.00 : 1.00 down )
  - right stick, horizontal -> 2 (left -1.00 : 1.00 right)
  - right stick, vertical   -> 3 (  up -1.00 : 1.00 down )
 */

export class GamepadMappingSafari8BitDo implements GamepadMapping {
  static readonly #stickAxisThreshold: number = 0.6;

  eventForButton(
    buttonIndex: number,
    button: GamepadButton,
  ): BpxGameInputEvent | null {
    if (!button.pressed) return null;

    switch (buttonIndex) {
      case 0: // A
      case 3: // Y
        return "button_O";
      case 1: // B
      case 2: // X
        return "button_X";
      case 12: // d-pad up
        return "button_up";
      case 13: // d-pad down
        return "button_down";
      case 14: // d-pad left
        return "button_left";
      case 15: // d-pad right
        return "button_right";
      case 8: // minus
      case 9: // plus
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
        return axisValue > GamepadMappingSafari8BitDo.#stickAxisThreshold
          ? ["button_right"]
          : axisValue < -GamepadMappingSafari8BitDo.#stickAxisThreshold
            ? ["button_left"]
            : [];
      case 1: // left stick, vertical
      case 3: // right stick, vertical
        return axisValue > GamepadMappingSafari8BitDo.#stickAxisThreshold
          ? ["button_down"]
          : axisValue < -GamepadMappingSafari8BitDo.#stickAxisThreshold
            ? ["button_up"]
            : [];
      default:
        return [];
    }
  }
}
