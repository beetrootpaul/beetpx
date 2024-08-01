import { BpxGameInputEvent } from "../GameInput";
import { GamepadMapping } from "./GamepadMapping";

/**
 * A mapping which tries to map all the available buttons just in case
 *   any of them will work for the user. Based on the Standard mapping.
 */
export class GamepadMappingFallback implements GamepadMapping {
  static readonly #stickAxisThreshold: number = 0.6;

  eventForButton(
    buttonIndex: number,
    button: GamepadButton,
  ): BpxGameInputEvent | null {
    if (!button.pressed) return null;

    switch (buttonIndex) {
      case 0:
      case 3:
      case 4:
      case 7:
        return "button_O";
      case 1:
      case 2:
      case 5:
      case 6:
        return "button_X";
      case 12:
        return "button_up";
      case 13:
        return "button_down";
      case 14:
        return "button_left";
      case 15:
        return "button_right";
      case 8:
      case 9:
      case 10:
      case 11:
      case 16:
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
      case 0:
      case 2:
        return (
          axisValue > GamepadMappingFallback.#stickAxisThreshold ?
            ["button_right"]
          : axisValue < -GamepadMappingFallback.#stickAxisThreshold ?
            ["button_left"]
          : []
        );
      case 1:
      case 3:
        return (
          axisValue > GamepadMappingFallback.#stickAxisThreshold ?
            ["button_down"]
          : axisValue < -GamepadMappingFallback.#stickAxisThreshold ?
            ["button_up"]
          : []
        );
      default:
        return [];
    }
  }
}
