import { BeetPx } from "../";
import { clamp } from "../utils/clamp";
import { mod } from "../utils/mod";

export class BpxTimer {
  static for(opts: {
    frames: number;
    loop: boolean;
    pause: boolean;
    delayFrames: number;
    onGamePause: "pause" | "ignore";
  }): BpxTimer {
    return new BpxTimer(opts);
  }

  readonly #frames: number;
  readonly #loop: boolean;

  readonly #ignoreGamePause: boolean;
  #isPaused: boolean;

  #offsetFrame: number;
  #pausedFrame: number | null;

  private constructor(opts: {
    frames: number;
    loop: boolean;
    pause: boolean;
    delayFrames: number;
    onGamePause: "pause" | "ignore";
  }) {
    this.#ignoreGamePause = opts.onGamePause === "ignore";

    this.#frames = Math.max(0, Math.round(opts.frames));
    this.#loop = opts.loop;

    this.#offsetFrame = this.#fn + opts.delayFrames;

    this.#isPaused = false;
    this.#pausedFrame = null;
    if (opts.pause) {
      this.pause();
    }
  }

  get #fn(): number {
    return this.#ignoreGamePause ?
        BeetPx.frameNumber
      : BeetPx.frameNumberOutsidePause;
  }

  get #tRaw(): number {
    return (this.#pausedFrame ?? this.#fn) - this.#offsetFrame;
  }

  get t(): number {
    return (
      this.#loop ?
        this.#tRaw >= 0 ?
          mod(this.#tRaw, this.#frames)
        : 0
      : clamp(0, this.#tRaw, this.#frames)
    );
  }

  get framesLeft(): number {
    return this.#frames - this.t;
  }

  get progress(): number {
    return this.#frames > 0 ? this.t / this.#frames : 1;
  }

  get hasFinished(): boolean {
    return this.#tRaw >= this.#frames;
  }

  get hasJustFinished(): boolean {
    return (
      this.#frames > 0 ?
        this.#loop ?
          this.#tRaw > 0 && this.t === 0
        : this.#tRaw === this.#frames
      : this.#loop ? true
      : this.#tRaw === 0
    );
  }

  pause(): void {
    if (this.#isPaused) return;
    this.#isPaused = true;

    this.#pausedFrame = this.#fn;
  }

  resume(): void {
    if (!this.#isPaused) return;
    this.#isPaused = false;

    this.#offsetFrame += this.#fn - (this.#pausedFrame ?? 0);
    this.#pausedFrame = null;
  }

  restart(): void {
    this.#offsetFrame = this.#fn;
    this.#pausedFrame = null;

    this.#isPaused = false;
  }
}
