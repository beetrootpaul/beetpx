import { BpxTimerSequence, timerSeq_ } from "../../timer/TimerSequence";
import { throwError } from "../../utils/throwError";

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
          : throwError(`Unsupported desiredUpdateFps: ${updateFps}`);
    Button.#repeatingFramesInterval =
      updateFps === 30
        ? 4
        : updateFps === 60
          ? 8
          : throwError(`Unsupported desiredUpdateFps: ${updateFps}`);
  }

  #isPressed = false;
  #wasJustToggled = false;

  #repeatingTimer: BpxTimerSequence<"start" | "interval"> | null = null;

  get isPressed(): boolean {
    return this.#isPressed;
  }

  wasJustPressed(repeating: boolean): boolean {
    return (
      (this.#wasJustToggled && this.#isPressed) ||
      (repeating && this.#repeatingTimer?.justFinishedPhase != null)
    );
  }

  wasJustReleased(repeating: boolean): boolean {
    return (
      (this.#wasJustToggled && !this.#isPressed) ||
      (repeating && this.#repeatingTimer?.justFinishedPhase != null)
    );
  }

  update(isPressed: boolean): void {
    if (isPressed) {
      if (this.#wasJustToggled) {
        this.#repeatingTimer = timerSeq_({
          intro: [["start", Button.repeatingFramesStart]],
          loop: [["interval", Button.repeatingFramesInterval]],
        });
      }
    } else {
      this.#repeatingTimer = null;
    }

    this.#wasJustToggled = this.#isPressed !== isPressed;
    this.#isPressed = isPressed;
  }
}
