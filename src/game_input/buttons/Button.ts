import { timer_ } from "../../shorthands";
import { BpxTimer } from "../../timer/Timer";
import { BpxUtils } from "../../Utils";

export class Button {
  static #repeatingFramesStart = 30;
  static #repeatingFramesInterval = 8;

  static get repeatingFramesStart(): number {
    return Button.#repeatingFramesStart;
  }

  static get repeatingFramesInterval(): number {
    return Button.#repeatingFramesInterval;
  }

  static setRepeatingParamsFor(updateFps: 30 | 60) {
    Button.#repeatingFramesStart =
      updateFps === 30
        ? 15
        : updateFps === 60
          ? 30
          : BpxUtils.throwError(`Unsupported desiredUpdateFps: ${updateFps}`);
    Button.#repeatingFramesInterval =
      updateFps === 30
        ? 4
        : updateFps === 60
          ? 8
          : BpxUtils.throwError(`Unsupported desiredUpdateFps: ${updateFps}`);
  }

  #isPressed = false;
  #wasJustToggled = false;

  #repeatingTimer: BpxTimer | null = null;

  get isPressed(): boolean {
    return this.#isPressed;
  }

  wasJustPressed(repeating: boolean): boolean {
    return (
      (this.#wasJustToggled && this.#isPressed) ||
      (repeating && !!this.#repeatingTimer?.hasJustFinished)
    );
  }

  wasJustReleased(repeating: boolean): boolean {
    return (
      (this.#wasJustToggled && !this.#isPressed) ||
      (repeating && !!this.#repeatingTimer?.hasJustFinished)
    );
  }

  update(isPressed: boolean): void {
    if (isPressed) {
      if (this.#wasJustToggled) {
        this.#repeatingTimer = timer_(Button.repeatingFramesStart);
      } else if (this.#repeatingTimer?.hasFinished) {
        this.#repeatingTimer = timer_(Button.repeatingFramesInterval, {
          loop: true,
        });
      }
    } else {
      this.#repeatingTimer = null;
    }

    this.#wasJustToggled = this.#isPressed !== isPressed;
    this.#isPressed = isPressed;
  }
}
