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

  setButtonRepeating(
    button: BpxGameButtonName,
    repeating: {
      firstRepeatFrames: number | null;
      loopedRepeatFrames: number | null;
    },
  ): void {
    switch (button) {
      case "left":
        this.#left.setRepeating(repeating);
        return;
      case "right":
        this.#right.setRepeating(repeating);
        return;
      case "up":
        this.#up.setRepeating(repeating);
        return;
      case "down":
        this.#down.setRepeating(repeating);
        return;
      case "a":
        this.#a.setRepeating(repeating);
        return;
      case "b":
        this.#b.setRepeating(repeating);
        return;
      case "menu":
        this.#menu.setRepeating(repeating);
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
