import { BpxTimer } from "../../misc/Timer";
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
      (repeating && !!this.#repeatingTimer?.hasFinished)
    );
  }

  wasJustReleased(repeating: boolean): boolean {
    return (
      (this.#wasJustToggled && !this.#isPressed) ||
      (repeating && !!this.#repeatingTimer?.hasFinished)
    );
  }

  update(isPressed: boolean): void {
    this.#wasJustToggled = this.#isPressed !== isPressed;
    this.#isPressed = isPressed;

    if (isPressed && this.#repeatingTimer?.hasFinished) {
      this.#repeatingTimer = BpxTimer.for({
        frames: Button.repeatingFramesInterval,
      });
    }

    this.#repeatingTimer?.update();

    if (isPressed && this.#wasJustToggled) {
      this.#repeatingTimer = BpxTimer.for({
        frames: Button.repeatingFramesStart,
      });
    }

    if (!isPressed && this.#repeatingTimer) {
      this.#repeatingTimer = null;
    }
  }
}
