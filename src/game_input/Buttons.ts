import { Button } from "./Button";
import { GameInputEvent } from "./GameInput";

// TODO: consider moving towards Z/X instead of O/X
export type ButtonName = "left" | "right" | "up" | "down" | "o" | "x" | "menu";

export class Buttons {
  readonly #left: Button = new Button();
  readonly #right: Button = new Button();
  readonly #up: Button = new Button();
  readonly #down: Button = new Button();
  readonly #o: Button = new Button();
  readonly #x: Button = new Button();
  readonly #menu: Button = new Button();

  #repeatingLeft: boolean = true;
  #repeatingRight: boolean = true;
  #repeatingUp: boolean = true;
  #repeatingDown: boolean = true;
  #repeatingO: boolean = true;
  #repeatingX: boolean = true;

  #repeatingMenu: boolean = false;

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
      case "menu":
        return this.#menu.isPressed;
    }
  }

  setRepeating(button: ButtonName, repeating: boolean): void {
    switch (button) {
      case "left":
        this.#repeatingLeft = repeating;
        return;
      case "right":
        this.#repeatingRight = repeating;
        return;
      case "up":
        this.#repeatingUp = repeating;
        return;
      case "down":
        this.#repeatingDown = repeating;
        return;
      case "o":
        this.#repeatingO = repeating;
        return;
      case "x":
        this.#repeatingX = repeating;
        return;
      case "menu":
        this.#repeatingMenu = repeating;
        return;
    }
  }

  wasJustPressed(button: ButtonName): boolean {
    switch (button) {
      case "left":
        return this.#left.wasJustPressed(this.#repeatingLeft);
      case "right":
        return this.#right.wasJustPressed(this.#repeatingRight);
      case "up":
        return this.#up.wasJustPressed(this.#repeatingUp);
      case "down":
        return this.#down.wasJustPressed(this.#repeatingDown);
      case "o":
        return this.#o.wasJustPressed(this.#repeatingO);
      case "x":
        return this.#x.wasJustPressed(this.#repeatingX);
      case "menu":
        return this.#menu.wasJustPressed(this.#repeatingMenu);
    }
  }

  wasJustReleased(button: ButtonName): boolean {
    switch (button) {
      case "left":
        return this.#left.wasJustReleased(this.#repeatingLeft);
      case "right":
        return this.#right.wasJustReleased(this.#repeatingRight);
      case "up":
        return this.#up.wasJustReleased(this.#repeatingUp);
      case "down":
        return this.#down.wasJustReleased(this.#repeatingDown);
      case "o":
        return this.#o.wasJustReleased(this.#repeatingO);
      case "x":
        return this.#x.wasJustReleased(this.#repeatingX);
      case "menu":
        return this.#menu.wasJustReleased(this.#repeatingMenu);
    }
  }

  update(continuousInputEvents: Set<GameInputEvent>): void {
    this.#left.update(continuousInputEvents.has("button_left"));
    this.#right.update(continuousInputEvents.has("button_right"));
    this.#up.update(continuousInputEvents.has("button_up"));
    this.#down.update(continuousInputEvents.has("button_down"));
    this.#o.update(continuousInputEvents.has("button_o"));
    this.#x.update(continuousInputEvents.has("button_x"));
    this.#menu.update(continuousInputEvents.has("button_menu"));
  }
}
