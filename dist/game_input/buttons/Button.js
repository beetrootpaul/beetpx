import { $timerSeq } from "../../shorthands";
export class Button {
    #isPressed = false;
    #wasJustToggled = false;
    #firstRepeatFrames = null;
    #loopedRepeatFrames = null;
    #repeatingTimer = null;
    setRepeating(params) {
        this.#firstRepeatFrames = params.firstRepeatFrames;
        this.#loopedRepeatFrames = params.loopedRepeatFrames;
    }
    get #isRepeatingEnabled() {
        return this.#firstRepeatFrames != null || this.#loopedRepeatFrames != null;
    }
    get isPressed() {
        return this.#isPressed;
    }
    get wasJustPressed() {
        return ((this.#wasJustToggled && this.#isPressed) ||
            (this.#isRepeatingEnabled &&
                this.#repeatingTimer?.justFinishedPhase != null));
    }
    get wasJustReleased() {
        return ((this.#wasJustToggled && !this.#isPressed) ||
            (this.#isRepeatingEnabled &&
                this.#repeatingTimer?.justFinishedPhase != null));
    }
    update(isPressed) {
        if (isPressed) {
            if (this.#wasJustToggled && this.#isRepeatingEnabled) {
                this.#repeatingTimer = $timerSeq({
                    intro: this.#firstRepeatFrames
                        ? [["first", this.#firstRepeatFrames]]
                        : undefined,
                    loop: this.#loopedRepeatFrames
                        ? [["looped", this.#loopedRepeatFrames]]
                        : undefined,
                }, { onGamePause: "ignore" });
            }
        }
        else {
            this.#repeatingTimer = null;
        }
        this.#wasJustToggled = this.#isPressed !== isPressed;
        this.#isPressed = isPressed;
    }
}
//# sourceMappingURL=Button.js.map