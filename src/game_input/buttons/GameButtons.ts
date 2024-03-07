import { BpxVector2d } from "../../misc/Vector2d";
import { v_ } from "../../shorthands";
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

  isAnyPressed(): boolean {
    return (
      this.#left.isPressed ||
      this.#right.isPressed ||
      this.#up.isPressed ||
      this.#down.isPressed ||
      this.#a.isPressed ||
      this.#b.isPressed ||
      this.#menu.isPressed
    );
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
      this.#left.wasJustPressed(this.#repeatingLeft) ||
      this.#right.wasJustPressed(this.#repeatingRight) ||
      this.#up.wasJustPressed(this.#repeatingUp) ||
      this.#down.wasJustPressed(this.#repeatingDown) ||
      this.#a.wasJustPressed(this.#repeatingA) ||
      this.#b.wasJustPressed(this.#repeatingB) ||
      this.#menu.wasJustPressed(this.#repeatingMenu)
    );
  }

  wasJustPressed(button: BpxGameButtonName): boolean {
    switch (button) {
      case "left":
        return this.#left.wasJustPressed(this.#repeatingLeft);
      case "right":
        return this.#right.wasJustPressed(this.#repeatingRight);
      case "up":
        return this.#up.wasJustPressed(this.#repeatingUp);
      case "down":
        return this.#down.wasJustPressed(this.#repeatingDown);
      case "a":
        return this.#a.wasJustPressed(this.#repeatingA);
      case "b":
        return this.#b.wasJustPressed(this.#repeatingB);
      case "menu":
        return this.#menu.wasJustPressed(this.#repeatingMenu);
    }
  }

  wasJustReleased(button: BpxGameButtonName): boolean {
    switch (button) {
      case "left":
        return this.#left.wasJustReleased(this.#repeatingLeft);
      case "right":
        return this.#right.wasJustReleased(this.#repeatingRight);
      case "up":
        return this.#up.wasJustReleased(this.#repeatingUp);
      case "down":
        return this.#down.wasJustReleased(this.#repeatingDown);
      case "a":
        return this.#a.wasJustReleased(this.#repeatingA);
      case "b":
        return this.#b.wasJustReleased(this.#repeatingB);
      case "menu":
        return this.#menu.wasJustReleased(this.#repeatingMenu);
    }
  }
}
