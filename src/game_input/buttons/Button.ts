import { timerSeq_ } from "../../shorthands";
import { BpxTimerSequence } from "../../timer/TimerSequence";

export class Button {
  #isPressed = false;
  #wasJustToggled = false;

  #firstRepeatFrames: number | null = null;
  #loopedRepeatFrames: number | null = null;
  #repeatingTimer: BpxTimerSequence<"first" | "looped"> | null = null;

  setRepeating(params: {
    firstRepeatFrames: number | null;
    loopedRepeatFrames: number | null;
  }): void {
    this.#firstRepeatFrames = params.firstRepeatFrames;
    this.#loopedRepeatFrames = params.loopedRepeatFrames;
  }

  get #isRepeatingEnabled(): boolean {
    return this.#firstRepeatFrames != null || this.#loopedRepeatFrames != null;
  }

  get isPressed(): boolean {
    return this.#isPressed;
  }

  get wasJustPressed(): boolean {
    return (
      (this.#wasJustToggled && this.#isPressed) ||
      (this.#isRepeatingEnabled &&
        this.#repeatingTimer?.justFinishedPhase != null)
    );
  }

  get wasJustReleased(): boolean {
    return (
      (this.#wasJustToggled && !this.#isPressed) ||
      (this.#isRepeatingEnabled &&
        this.#repeatingTimer?.justFinishedPhase != null)
    );
  }

  update(isPressed: boolean): void {
    if (isPressed) {
      if (this.#wasJustToggled && this.#isRepeatingEnabled) {
        this.#repeatingTimer = timerSeq_({
          intro:
            this.#firstRepeatFrames ?
              [["first", this.#firstRepeatFrames]]
            : undefined,
          loop:
            this.#loopedRepeatFrames ?
              [["looped", this.#loopedRepeatFrames]]
            : undefined,
        });
      }
    } else {
      this.#repeatingTimer = null;
    }

    this.#wasJustToggled = this.#isPressed !== isPressed;
    this.#isPressed = isPressed;
  }
}
