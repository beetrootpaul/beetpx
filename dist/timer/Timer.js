import { BeetPx } from "../";
import { clamp } from "../utils/clamp";
import { mod } from "../utils/mod";
export class BpxTimer {
    static of(opts) {
        return new BpxTimer(opts);
    }
    #frames;
    #loop;
    #ignoreGamePause;
    #isPaused;
    #offsetFrame;
    #pausedFrame;
    constructor(opts) {
        this.#ignoreGamePause = opts.onGamePause === "ignore";
        this.#frames = Math.max(0, Math.round(opts.frames));
        this.#loop = opts.loop;
        this.#offsetFrame = this.#fn + opts.delayFrames;
        this.#isPaused = false;
        this.#pausedFrame = null;
        if (opts.paused) {
            this.pause();
        }
    }
    get #fn() {
        return this.#ignoreGamePause
            ? BeetPx.frameNumber
            : BeetPx.frameNumberOutsidePause;
    }
    get #tRaw() {
        return (this.#pausedFrame ?? this.#fn) - this.#offsetFrame;
    }
    get t() {
        return this.#loop
            ? this.#tRaw >= 0
                ? mod(this.#tRaw, this.#frames)
                : 0
            : clamp(0, this.#tRaw, this.#frames);
    }
    get framesLeft() {
        return this.#frames - this.t;
    }
    get progress() {
        return this.#frames > 0 ? this.t / this.#frames : 1;
    }
    get hasFinished() {
        return this.#tRaw >= this.#frames;
    }
    get hasJustFinished() {
        return this.#frames > 0
            ? this.#loop
                ? this.#tRaw > 0 && this.t === 0
                : this.#tRaw === this.#frames
            : this.#loop
                ? true
                : this.#tRaw === 0;
    }
    get isPaused() {
        return this.#isPaused;
    }
    pause() {
        if (this.#isPaused)
            return;
        this.#isPaused = true;
        this.#pausedFrame = this.#fn;
    }
    resume() {
        if (!this.#isPaused)
            return;
        this.#isPaused = false;
        this.#offsetFrame += this.#fn - (this.#pausedFrame ?? 0);
        this.#pausedFrame = null;
    }
    restart() {
        this.#offsetFrame = this.#fn;
        this.#pausedFrame = null;
        this.#isPaused = false;
    }
}
//# sourceMappingURL=Timer.js.map