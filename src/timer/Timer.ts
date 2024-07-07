import { BeetPx } from "../BeetPx";
import { clamp } from "../utils/clamp";
import { mod } from "../utils/mod";

type TimerControlledByGamePause = {
  timer: BpxTimer;
  pauseDueToGamePause: () => void;
  resumeDueToGameResume: () => void;
};

export class BpxTimer {
  static timersControlledByGamePause: WeakRef<TimerControlledByGamePause>[] =
    [];

  static for(opts: {
    frames: number;
    loop: boolean;
    pause: boolean;
    delayFrames: number;
    ignoreGamePause: boolean;
  }): BpxTimer {
    return new BpxTimer(opts);
  }

  readonly #frames: number;
  readonly #loop: boolean;

  #pausedWithGame: boolean;
  #pausedDirectly: boolean;

  #offsetFrame: number;
  #pausedFrame: number | null;

  private constructor(opts: {
    frames: number;
    loop: boolean;
    pause: boolean;
    delayFrames: number;
    ignoreGamePause: boolean;
  }) {
    if (!opts.ignoreGamePause) {
      BpxTimer.timersControlledByGamePause.push(
        new WeakRef({
          timer: this,
          pauseDueToGamePause: this.#pauseDueToGamePause.bind(this),
          resumeDueToGameResume: this.#resumeDueToGameResume.bind(this),
        }),
      );
    }

    this.#frames = Math.max(0, Math.round(opts.frames));
    this.#loop = opts.loop;

    this.#offsetFrame = BeetPx.frameNumber + opts.delayFrames;

    this.#pausedWithGame = false;

    this.#pausedDirectly = false;
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
    if (this.#pausedDirectly) {
      return;
    }
    this.#pausedDirectly = true;

    if (this.#pausedWithGame) {
      return;
    }

    this.#pausedFrame = BeetPx.frameNumber;
  }

  // TODO: test it vs regular pause/resume
  #pauseDueToGamePause(): void {
    if (this.#pausedWithGame) {
      return;
    }
    this.#pausedWithGame = true;

    if (this.#pausedDirectly) {
      return;
    }

    this.#pausedFrame = BeetPx.frameNumber;
  }

  resume(): void {
    if (!this.#pausedDirectly) {
      return;
    }
    this.#pausedDirectly = false;

    if (this.#pausedWithGame) {
      return;
    }

    this.#offsetFrame += BeetPx.frameNumber - (this.#pausedFrame ?? 0);
    this.#pausedFrame = null;
  }

  // TODO: test it vs regular resume/pause
  #resumeDueToGameResume(): void {
    if (!this.#pausedWithGame) {
      return;
    }
    this.#pausedWithGame = false;

    if (this.#pausedDirectly) {
      return;
    }

    this.#offsetFrame += BeetPx.frameNumber - (this.#pausedFrame ?? 0);
    this.#pausedFrame = null;
  }

  restart(): void {
    this.#offsetFrame = BeetPx.frameNumber;
    this.#pausedFrame = null;
  }
}
