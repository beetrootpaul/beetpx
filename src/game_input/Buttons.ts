import { Button } from "./Button";
import { BpxGameInputEvent } from "./GameInput";

// TODO: consider a bit mask approach for buttons
// TODO: consider moving towards Z/X instead of O/X. Or some other keys?
export type BpxButtonName =
  | "left"
  | "right"
  | "up"
  | "down"
  | "o"
  | "x"
  | "menu";

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

  update(events: Set<BpxGameInputEvent>): void {
    this.#left.update(events.has("button_left"));
    this.#right.update(events.has("button_right"));
    this.#up.update(events.has("button_up"));
    this.#down.update(events.has("button_down"));
    this.#o.update(events.has("button_o"));
    this.#x.update(events.has("button_x"));
    this.#menu.update(events.has("button_menu"));
  }

  isPressed(button: BpxButtonName): boolean {
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

  setRepeating(button: BpxButtonName, repeating: boolean): void {
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

  wasAnyJustPressed(): boolean {
    return (
      this.#left.wasJustPressed(this.#repeatingLeft) ||
      this.#right.wasJustPressed(this.#repeatingRight) ||
      this.#up.wasJustPressed(this.#repeatingUp) ||
      this.#down.wasJustPressed(this.#repeatingDown) ||
      this.#o.wasJustPressed(this.#repeatingO) ||
      this.#x.wasJustPressed(this.#repeatingX) ||
      this.#menu.wasJustPressed(this.#repeatingMenu)
    );
  }

  wasJustPressed(button: BpxButtonName): boolean {
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

  wasJustReleased(button: BpxButtonName): boolean {
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
}
