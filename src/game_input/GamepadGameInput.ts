import { GameInputEvent } from "./GameInput";

// TODO: implement support for gameInputEventBehavior[gameInputEvent]?.fireOnce

export class GamepadGameInput {
  readonly buttonMapping: Map<number, GameInputEvent> = new Map<
    number,
    GameInputEvent
  >([
    [14, "left"],
    [15, "right"],
    [12, "up"],
    [13, "down"],
  ]);

  readonly axisThreshold: number = 0.6;

  readonly #axisMapping: Map<number, GameInputEvent> = new Map<
    number,
    GameInputEvent
  >([
    // keys here are: 100 * axis index + sign(axis value)
    [-1, "left"],
    [1, "right"],
    [99, "up"],
    [101, "down"],
    [199, "left"],
    [201, "right"],
    [299, "up"],
    [301, "down"],
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
