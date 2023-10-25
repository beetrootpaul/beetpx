import { BpxGameInputEvent } from "../GameInput";

export interface GamepadMapping {
  eventForButton(
    buttonIndex: number,
    button: GamepadButton,
  ): BpxGameInputEvent | null;

  eventsForAxisValue(axisIndex: number, axisValue: number): BpxGameInputEvent[];
}
