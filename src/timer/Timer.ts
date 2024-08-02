import { BeetPx } from "../";
import { clamp } from "../utils/clamp";
import { mod } from "../utils/mod";

/**
 * A timer implementation, tightly integrated with the game loop.
 * It automatically counts frames – an amount of update calls.
 *
 * Used as a basis for {@link BpxAnimatedSprite}.
 *
 * @see {@link $timer}
 *
 * @category Core
 */
export class BpxTimer {
  /**
   * @see {@link $timer}
   *
   * @group Static factories
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
   * A current counted frame number, incrementing from 0.
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
   * A an amount of frames left to be counted, decrementing down to 0.
   */
  get framesLeft(): number {
    return this.#frames - this.t;
  }

  /**
   * A progress of the counting, gradually incrementing from 0 to 1.
   */
  get progress(): number {
    return this.#frames > 0 ? this.t / this.#frames : 1;
  }

  /**
   * Whether this timer has finished already.
   * For looped timers this becomes `true` forever after the first pass.
   */
  get hasFinished(): boolean {
    return this.#tRaw >= this.#frames;
  }

  /**
   * Whether this timer has finished in the most recent game loop iteration.
   * For looped timers this becomes `true` at the end of each pass.
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
   * Pauses the timer.
   */
  pause(): void {
    if (this.#isPaused) return;
    this.#isPaused = true;

    this.#pausedFrame = this.#fn;
  }

  /**
   * Resumes the timer.
   */
  resume(): void {
    if (!this.#isPaused) return;
    this.#isPaused = false;

    this.#offsetFrame += this.#fn - (this.#pausedFrame ?? 0);
    this.#pausedFrame = null;
  }

  /**
   * Restarts the timer from 0.
   */
  restart(): void {
    this.#offsetFrame = this.#fn;
    this.#pausedFrame = null;

    this.#isPaused = false;
  }
}
