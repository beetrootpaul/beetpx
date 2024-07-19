import { BeetPx } from "../BeetPx";
import { clamp } from "../helpers/clamp";
import { mod } from "../helpers/mod";
export class BpxTimer {
    static for(opts) {
        return new BpxTimer(opts);
    }
    #frames;
    #loop;
    #ignoreGlobalPause;
    #isPaused;
    #offsetFrame;
    #pausedFrame;
    constructor(opts) {
        this.#ignoreGlobalPause = opts.onGamePause === "ignore";
        this.#frames = Math.max(0, Math.round(opts.frames));
        this.#loop = opts.loop;
        this.#offsetFrame = this.#fn + opts.delayFrames;
        this.#isPaused = false;
        this.#pausedFrame = null;
        if (opts.pause) {
            this.pause();
        }
    }
    get #fn() {
        return this.#ignoreGlobalPause ?
            BeetPx.frameNumber
            : BeetPx.frameNumberOutsidePause;
    }
    get #tRaw() {
        return (this.#pausedFrame ?? this.#fn) - this.#offsetFrame;
    }
    get t() {
        return (this.#loop ?
            this.#tRaw >= 0 ?
                mod(this.#tRaw, this.#frames)
                : 0
            : clamp(0, this.#tRaw, this.#frames));
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
        return (this.#frames > 0 ?
            this.#loop ?
                this.#tRaw > 0 && this.t === 0
                : this.#tRaw === this.#frames
            : this.#loop ? true
                : this.#tRaw === 0);
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
