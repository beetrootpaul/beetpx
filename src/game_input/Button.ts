import { Timer } from "../misc/Timer";

export class Button {
  static readonly repeatingStartSeconds = 0.5; // equivalent of 30 frames in 60 FPS
  static readonly repeatingIntervalSeconds = 0.1334; // equivalent of 8 frames in 60 FPS

  #isPressed = false;
  #wasJustToggled = false;

  #repeatingTimer: Timer | null = null;

  get isPressed(): boolean {
    return this.#isPressed;
  }

  wasJustPressed(repeating: boolean): boolean {
    return (
      (this.#wasJustToggled && this.#isPressed) ||
      (repeating && !!this.#repeatingTimer?.hasFinished)
    );
  }

  wasJustReleased(repeating: boolean): boolean {
    return (
      (this.#wasJustToggled && !this.#isPressed) ||
      (repeating && !!this.#repeatingTimer?.hasFinished)
    );
  }

  update(isPressed: boolean, secondsPassed: number): void {
    this.#wasJustToggled = this.#isPressed !== isPressed;
    this.#isPressed = isPressed;

    if (isPressed && this.#repeatingTimer?.hasFinished) {
      this.#repeatingTimer = new Timer(Button.repeatingIntervalSeconds);
    }

    this.#repeatingTimer?.update(secondsPassed);

    if (isPressed && this.#wasJustToggled) {
      this.#repeatingTimer = new Timer(Button.repeatingStartSeconds);
    }

    if (!isPressed && this.#repeatingTimer) {
      this.#repeatingTimer = null;
    }
  }
}
