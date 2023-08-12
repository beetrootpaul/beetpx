import { GameInputEvent } from "./GameInput";

// TODO: implement support for gameInputEventBehavior[gameInputEvent]?.fireOnce

// TODO: implement X and O

export class GamepadGameInput {
  readonly buttonMapping: Map<number, GameInputEvent> = new Map<
    number,
    GameInputEvent
  >([
    [14, "button_left"],
    [15, "button_right"],
    [12, "button_up"],
    [13, "button_down"],
  ]);

  readonly axisThreshold: number = 0.6;

  readonly #axisMapping: Map<number, GameInputEvent> = new Map<
    number,
    GameInputEvent
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

  getCurrentContinuousEvents(): Set<GameInputEvent> {
    const events = new Set<GameInputEvent>();

    navigator.getGamepads().forEach((gamepad) => {
      if (gamepad) {
        gamepad.buttons.forEach((button, buttonIndex) => {
          if (button.pressed || button.touched) {
            const gameInputEvent = this.buttonMapping.get(buttonIndex);
            if (gameInputEvent) {
              events.add(gameInputEvent);
            }
          }
        });
        gamepad.axes.forEach((axis, axisIndex) => {
          if (Math.abs(axis) > this.axisThreshold) {
            const gameInputEvent = this.#axisMapping.get(
              100 * axisIndex + Math.sign(axis),
            );
            if (gameInputEvent) {
              events.add(gameInputEvent);
            }
          }
        });
      }
    });

    return events;
  }
}
