import { BeetPx } from "../BeetPx";
import { clamp } from "../utils/clamp";
import { mod } from "../utils/mod";

export type TimerControlledByEngined = {
  __internal__pauseByEngine: () => void;
  __internal__resumeByEngine: () => void;
};

export class BpxTimer {
  static timersToPauseOnGamePause: WeakRef<TimerControlledByEngined>[] = [];

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

  #isPausedByEngine: boolean;
  #isPausedByGame: boolean;

  #offsetFrame: number;
  #pausedFrame: number | null;

  private constructor(opts: {
    frames: number;
    loop: boolean;
    pause: boolean;
    delayFrames: number;
    onGamePause: "pause" | "ignore";
  }) {
    if (opts.onGamePause === "pause") {
      const controlledByEngined: TimerControlledByEngined = this as any;
      controlledByEngined.__internal__pauseByEngine =
        this.#pauseByEngine.bind(controlledByEngined);
      controlledByEngined.__internal__resumeByEngine =
        this.#resumeByEngine.bind(controlledByEngined);
      BpxTimer.timersToPauseOnGamePause.push(new WeakRef(controlledByEngined));
    }

    this.#frames = Math.max(0, Math.round(opts.frames));
    this.#loop = opts.loop;

    this.#offsetFrame = BeetPx.frameNumber + opts.delayFrames;

    this.#isPausedByEngine = false;
    this.#isPausedByGame = false;
    this.#pausedFrame = null;
    if (opts.pause) {
      this.pause();
    }
  }

  get #tRaw(): number {
    return (this.#pausedFrame ?? BeetPx.frameNumber) - this.#offsetFrame;
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
    if (this.#isPausedByGame) return;
    this.#isPausedByGame = true;

    if (this.#isPausedByEngine) return;

    this.#pausedFrame = BeetPx.frameNumber;
  }

  #pauseByEngine(): void {
    if (this.#isPausedByEngine) return;
    this.#isPausedByEngine = true;

    if (this.#isPausedByGame) return;

    this.#pausedFrame = BeetPx.frameNumber;
  }

  resume(): void {
    if (!this.#isPausedByGame) return;
    this.#isPausedByGame = false;

    if (this.#isPausedByEngine) return;

    this.#offsetFrame += BeetPx.frameNumber - (this.#pausedFrame ?? 0);
    this.#pausedFrame = null;
  }

  #resumeByEngine(): void {
    if (!this.#isPausedByEngine) return;
    this.#isPausedByEngine = false;

    if (this.#isPausedByGame) return;

    this.#offsetFrame += BeetPx.frameNumber - (this.#pausedFrame ?? 0);
    this.#pausedFrame = null;
  }

  restart(): void {
    this.#offsetFrame = BeetPx.frameNumber;
    this.#pausedFrame = null;

    this.#isPausedByGame = false;
    this.#isPausedByEngine = false;
  }
}
