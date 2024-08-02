import { BeetPx } from "../";
import { clamp } from "../utils/clamp";
import { mod } from "../utils/mod";

/**
 * TODO: docs
 */
export class BpxTimer {
  /**
   * TODO: docs
   */
  static of(opts: {
    frames: number;
    loop: boolean;
    paused: boolean;
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
    paused: boolean;
    delayFrames: number;
    onGamePause: "pause" | "ignore";
  }) {
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

  get #fn(): number {
    return this.#ignoreGamePause ?
        BeetPx.frameNumber
      : BeetPx.frameNumberOutsidePause;
  }

  get #tRaw(): number {
    return (this.#pausedFrame ?? this.#fn) - this.#offsetFrame;
  }

  /**
   * TODO: docs
   */
  get t(): number {
    return (
      this.#loop ?
        this.#tRaw >= 0 ?
          mod(this.#tRaw, this.#frames)
        : 0
      : clamp(0, this.#tRaw, this.#frames)
    );
  }

  /**
   * TODO: docs
   */
  get framesLeft(): number {
    return this.#frames - this.t;
  }

  /**
   * TODO: docs
   */
  get progress(): number {
    return this.#frames > 0 ? this.t / this.#frames : 1;
  }

  /**
   * TODO: docs
   */
  get hasFinished(): boolean {
    return this.#tRaw >= this.#frames;
  }

  /**
   * TODO: docs
   */
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

  /**
   * TODO: docs
   */
  pause(): void {
    if (this.#isPaused) return;
    this.#isPaused = true;

    this.#pausedFrame = this.#fn;
  }

  /**
   * TODO: docs
   */
  resume(): void {
    if (!this.#isPaused) return;
    this.#isPaused = false;

    this.#offsetFrame += this.#fn - (this.#pausedFrame ?? 0);
    this.#pausedFrame = null;
  }

  /**
   * TODO: docs
   */
  restart(): void {
    this.#offsetFrame = this.#fn;
    this.#pausedFrame = null;

    this.#isPaused = false;
  }
}
