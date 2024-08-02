import { BpxVector2d } from "../../misc/Vector2d";
import { $v } from "../../shorthands";
import { BpxGameInputEvent } from "../GameInput";
import { Button } from "./Button";

/**
 * TODO: docs
 *
 * @categoryTODO Game input
 */
export type BpxGameButtonName =
  /**
   * TODO: docs
   */
  | "left"
  /**
   * TODO: docs
   */
  | "right"
  /**
   * TODO: docs
   */
  | "up"
  /**
   * TODO: docs
   */
  | "down"
  /**
   * TODO: docs
   *
   * Japanese "Maru" sign, kind of a "Yes", good for a primary/accept/next button
   */
  | "O"
  /**
   * TODO: docs
   */
  | "o"
  /**
   * TODO: docs
   *
   * Japanese "Batsu" sign, kind of a "No", good for a secondary/cancel/back button
   */
  | "X"
  /**
   * TODO: docs
   */
  | "x"
  /**
   * TODO: docs
   */
  | "menu";

export class GameButtons {
  readonly #left: Button = new Button();
  readonly #right: Button = new Button();
  readonly #up: Button = new Button();
  readonly #down: Button = new Button();
  readonly #O: Button = new Button();
  readonly #X: Button = new Button();
  readonly #menu: Button = new Button();

  update(events: Set<BpxGameInputEvent>): void {
    this.#left.update(events.has("button_left"));
    this.#right.update(events.has("button_right"));
    this.#up.update(events.has("button_up"));
    this.#down.update(events.has("button_down"));
    this.#O.update(events.has("button_O"));
    this.#X.update(events.has("button_X"));
    this.#menu.update(events.has("button_menu"));
  }

  isAnyPressed(): boolean {
    return (
      this.#left.isPressed ||
      this.#right.isPressed ||
      this.#up.isPressed ||
      this.#down.isPressed ||
      this.#O.isPressed ||
      this.#X.isPressed ||
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
      case "O":
      case "o":
        return this.#O.isPressed;
      case "X":
      case "x":
        return this.#X.isPressed;
      case "menu":
        return this.#menu.isPressed;
    }
  }

  getPressedDirection(): BpxVector2d {
    return $v(
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
      case "O":
      case "o":
        this.#O.setRepeating(repeating);
        return;
      case "X":
      case "x":
        this.#X.setRepeating(repeating);
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
      this.#O.wasJustPressed ||
      this.#X.wasJustPressed ||
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
      case "O":
      case "o":
        return this.#O.wasJustPressed;
      case "X":
      case "x":
        return this.#X.wasJustPressed;
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
      case "O":
      case "o":
        return this.#O.wasJustReleased;
      case "X":
      case "x":
        return this.#X.wasJustReleased;
      case "menu":
        return this.#menu.wasJustReleased;
    }
  }
}
