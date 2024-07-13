import { BeetPx } from "../BeetPx";
import { clamp } from "../utils/clamp";
import { mod } from "../utils/mod";

export type TimerWithExposedInternals = BpxTimer & {
  __internal__pauseDueToGamePause: () => void;
  __internal__resumeDueToGameResume: () => void;
};

export class BpxTimer {
  static timersControlledByGamePause: WeakRef<TimerWithExposedInternals>[] = [];

  static for(opts: {
    frames: number;
    loop: boolean;
    pause: boolean;
    delayFrames: number;
    // TODO: consider `onGamePause: "pause" | "ignore", then for audio: "pause" | "mute" | "ignore"
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
      const withInternals: TimerWithExposedInternals = this as any;
      withInternals.__internal__pauseDueToGamePause =
        withInternals.#pauseDueToGamePause.bind(withInternals);
      withInternals.__internal__resumeDueToGameResume =
        withInternals.#resumeDueToGameResume.bind(withInternals);
      BpxTimer.timersControlledByGamePause.push(new WeakRef(withInternals));
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

  // TODO: tests for it vs regular pause/resume
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

  // TODO: tests for it vs regular resume/pause
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

    this.#pausedDirectly = false;
    this.#pausedWithGame = false;
  }
}
