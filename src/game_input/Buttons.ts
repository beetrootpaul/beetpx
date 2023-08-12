import { Button } from "./Button";
import { GameInputEvent } from "./GameInput";

// TODO: consider moving towards Z/X instead of O/X
export type ButtonName = "left" | "right" | "up" | "down" | "o" | "x";

export class Buttons {
  readonly #left: Button = new Button();
  readonly #right: Button = new Button();
  readonly #up: Button = new Button();
  readonly #down: Button = new Button();
  readonly #o: Button = new Button();
  readonly #x: Button = new Button();

  wasJustPressed(button: ButtonName): boolean {
    switch (button) {
      case "left":
        return this.#left.wasJustPressed;
      case "right":
        return this.#right.wasJustPressed;
      case "up":
        return this.#up.wasJustPressed;
      case "down":
        return this.#down.wasJustPressed;
      case "o":
        return this.#o.wasJustPressed;
      case "x":
        return this.#x.wasJustPressed;
    }
  }

  wasJustReleased(button: ButtonName): boolean {
    switch (button) {
      case "left":
        return this.#left.wasJustReleased;
      case "right":
        return this.#right.wasJustReleased;
      case "up":
        return this.#up.wasJustReleased;
      case "down":
        return this.#down.wasJustReleased;
      case "o":
        return this.#o.wasJustReleased;
      case "x":
        return this.#x.wasJustReleased;
    }
  }

  isPressed(button: ButtonName): boolean {
    switch (button) {
      case "left":
        return this.#left.isPressed;
      case "right":
        return this.#right.isPressed;
      case "up":
        return this.#up.isPressed;
      case "down":
        return this.#down.isPressed;
      case "o":
        return this.#o.isPressed;
      case "x":
        return this.#x.isPressed;
    }
  }

  update(continuousInputEvents: Set<GameInputEvent>): void {
    this.#left.update(continuousInputEvents.has("button_left"));
    this.#right.update(continuousInputEvents.has("button_right"));
    this.#up.update(continuousInputEvents.has("button_up"));
    this.#down.update(continuousInputEvents.has("button_down"));
    this.#o.update(continuousInputEvents.has("button_o"));
    this.#x.update(continuousInputEvents.has("button_x"));
  }
}
