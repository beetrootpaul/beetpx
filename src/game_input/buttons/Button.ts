import { BpxTimerSequence, timerSeq_ } from "../../timer/TimerSequence";
import { BpxUtils } from "../../Utils";

export class Button {
  // TODO: ???
  static #repeatingFramesStart = 30;
  static #repeatingFramesInterval = 8;

  // TODO: ???
  static get repeatingFramesStart(): number {
    return Button.#repeatingFramesStart;
  }

  // TODO: ???
  static get repeatingFramesInterval(): number {
    return Button.#repeatingFramesInterval;
  }

  // TODO: ???
  static configureRepeatingParamsFor(updateFps: 30 | 60) {
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

  #repeatingTimer: BpxTimerSequence<"initial" | "interval"> | null = null;
  #nextRepeatingTimer: BpxTimerSequence<"initial" | "interval"> | null = null;

  #isPressed = false;
  #wasJustToggled = false;

  get isPressed(): boolean {
    return this.#isPressed;
  }

  get wasJustPressed(): boolean {
    return (
      (this.#wasJustToggled && this.#isPressed) ||
      !!this.#repeatingTimer?.justFinishedPhase
    );
  }

  get wasJustReleased(): boolean {
    return (
      (this.#wasJustToggled && !this.#isPressed) ||
      !!this.#repeatingTimer?.justFinishedPhase
    );
  }

  makeRepeating(initialFrames: number, intervalFrames: number): void {
    initialFrames = Math.round(initialFrames);
    intervalFrames = Math.round(intervalFrames);

    this.#nextRepeatingTimer = timerSeq_(
      {
        intro: initialFrames > 0 ? [["initial", initialFrames]] : undefined,
        loop: intervalFrames > 0 ? [["interval", intervalFrames]] : undefined,
      },
      { pause: true },
    );
  }

  makeNotRepeating(): void {
    this.#repeatingTimer = null;
    this.#nextRepeatingTimer = null;
  }

  update(isPressed: boolean): void {
    this.#wasJustToggled = this.#isPressed !== isPressed;
    this.#isPressed = isPressed;

    if (this.#wasJustToggled) {
      if (isPressed) {
        this.#repeatingTimer?.resume();
      } else if (!isPressed) {
        if (this.#nextRepeatingTimer) {
          this.#repeatingTimer = this.#nextRepeatingTimer;
          this.#nextRepeatingTimer = null;
        }
        this.#repeatingTimer?.restart();
        this.#repeatingTimer?.pause();
      }
    }
  }
}
