import { BpxGameInputEvent } from "./GameInput";
import { SpecializedGameInput } from "./SpecializedGameInput";

export class GamepadGameInput implements SpecializedGameInput {
  readonly buttonMapping: Map<number, BpxGameInputEvent> = new Map<
    number,
    BpxGameInputEvent
  >([
    [14, "button_left"],
    [15, "button_right"],
    [12, "button_up"],
    [13, "button_down"],
    //
    [2, "button_a"],
    [3, "button_a"],
    [1, "button_b"],
    [5, "button_b"],
    //
    [8, "button_menu"],
    [16, "button_menu"],
  ]);

  readonly axisThreshold: number = 0.6;

  readonly #axisMapping: Map<number, BpxGameInputEvent> = new Map<
    number,
    BpxGameInputEvent
  >([
    // keys here are: 100 * axis index + sign(axis value)
    [-1, "button_left"],
    [1, "button_right"],
    [99, "button_up"],
    [101, "button_down"],
    [199, "button_left"],
    [201, "button_right"],
    [299, "button_up"],
    [301, "button_down"],
  ]);

  startListening(): void {
    // nothing to be done here
  }

  update(eventsCollector: Set<BpxGameInputEvent>): void {
    navigator.getGamepads().forEach((gamepad) => {
      if (gamepad) {
        gamepad.buttons.forEach((button, buttonIndex) => {
          if (button.pressed || button.touched) {
            const gameInputEvent = this.buttonMapping.get(buttonIndex);
            if (gameInputEvent) {
              eventsCollector.add(gameInputEvent);
            }
          }
        });
        gamepad.axes.forEach((axis, axisIndex) => {
          if (Math.abs(axis) > this.axisThreshold) {
            const gameInputEvent = this.#axisMapping.get(
              100 * axisIndex + Math.sign(axis),
            );
            if (gameInputEvent) {
              eventsCollector.add(gameInputEvent);
            }
          }
        });
      }
    });
  }
}
