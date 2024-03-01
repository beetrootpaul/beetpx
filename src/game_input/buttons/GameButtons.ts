import { BpxVector2d, v_ } from "../../misc/Vector2d";
import { BpxGameInputEvent } from "../GameInput";
import { Button } from "./Button";

export type BpxGameButtonName =
  | "left"
  | "right"
  | "up"
  | "down"
  | "a"
  | "b"
  | "menu";

export class GameButtons {
  readonly #left: Button = new Button();
  readonly #right: Button = new Button();
  readonly #up: Button = new Button();
  readonly #down: Button = new Button();
  readonly #a: Button = new Button();
  readonly #b: Button = new Button();
  readonly #menu: Button = new Button();

  // TODO: ???
  #repeatingLeft: boolean = true;
  #repeatingRight: boolean = true;
  #repeatingUp: boolean = true;
  #repeatingDown: boolean = true;
  #repeatingA: boolean = true;
  #repeatingB: boolean = true;
  #repeatingMenu: boolean = false;

  update(events: Set<BpxGameInputEvent>): void {
    this.#left.update(events.has("button_left"));
    this.#right.update(events.has("button_right"));
    this.#up.update(events.has("button_up"));
    this.#down.update(events.has("button_down"));
    this.#a.update(events.has("button_a"));
    this.#b.update(events.has("button_b"));
    this.#menu.update(events.has("button_menu"));
  }

  isPressed(button: BpxGameButtonName): boolean {
    switch (button) {
      case "left":
        return this.#left.isPressed;
      case "right":
        return this.#right.isPressed;
      case "up":
        return this.#up.isPressed;
      case "down":
        return this.#down.isPressed;
      case "a":
        return this.#a.isPressed;
      case "b":
        return this.#b.isPressed;
      case "menu":
        return this.#menu.isPressed;
    }
  }

  getPressedDirection(): BpxVector2d {
    return v_(
      (this.#left.isPressed ? -1 : 0) + (this.#right.isPressed ? 1 : 0),
      (this.#up.isPressed ? -1 : 0) + (this.#down.isPressed ? 1 : 0),
    );
  }

  setRepeating(button: BpxGameButtonName, repeating: boolean): void {
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
      case "a":
        this.#repeatingA = repeating;
        return;
      case "b":
        this.#repeatingB = repeating;
        return;
      case "menu":
        this.#repeatingMenu = repeating;
        return;
    }
  }

  wasAnyJustPressed(): boolean {
    return (
      this.#left.wasJustPressed ||
      this.#right.wasJustPressed ||
      this.#up.wasJustPressed ||
      this.#down.wasJustPressed ||
      this.#a.wasJustPressed ||
      this.#b.wasJustPressed ||
      this.#menu.wasJustPressed
    );
  }

  wasJustPressed(button: BpxGameButtonName): boolean {
    switch (button) {
      case "left":
        return this.#left.wasJustPressed;
      case "right":
        return this.#right.wasJustPressed;
      case "up":
        return this.#up.wasJustPressed;
      case "down":
        return this.#down.wasJustPressed;
      case "a":
        return this.#a.wasJustPressed;
      case "b":
        return this.#b.wasJustPressed;
      case "menu":
        return this.#menu.wasJustPressed;
    }
  }

  wasJustReleased(button: BpxGameButtonName): boolean {
    switch (button) {
      case "left":
        return this.#left.wasJustReleased;
      case "right":
        return this.#right.wasJustReleased;
      case "up":
        return this.#up.wasJustReleased;
      case "down":
        return this.#down.wasJustReleased;
      case "a":
        return this.#a.wasJustReleased;
      case "b":
        return this.#b.wasJustReleased;
      case "menu":
        return this.#menu.wasJustReleased;
    }
  }
}
