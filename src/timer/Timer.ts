import { BeetPx } from "../BeetPx";
import { clamp } from "../utils/clamp";
import { mod } from "../utils/mod";

export class BpxTimer {
  static for(params: {
    frames: number;
    loop: boolean;
    pause: boolean;
    delayFrames: number;
  }): BpxTimer {
    return new BpxTimer(params);
  }

  readonly #frames: number;
  readonly #loop: boolean;

  #offsetFrame: number;
  #pausedFrame: number | null;

  private constructor(params: {
    frames: number;
    loop: boolean;
    pause: boolean;
    delayFrames: number;
  }) {
    this.#frames = Math.max(0, Math.round(params.frames));
    this.#loop = params.loop;

    this.#offsetFrame = BeetPx.frameNumber + params.delayFrames;

    this.#pausedFrame = null;
    if (params.pause) {
      this.pause();
    }
  }

  get #tRaw(): number {
    return (this.#pausedFrame ?? BeetPx.frameNumber) - this.#offsetFrame;
  }

  get t(): number {
    return this.#loop
      ? this.#tRaw >= 0
        ? mod(this.#tRaw, this.#frames)
        : 0
      : clamp(0, this.#tRaw, this.#frames);
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
    return this.#frames > 0
      ? this.#loop
        ? this.#tRaw > 0 && this.t === 0
        : this.#tRaw === this.#frames
      : this.#loop
        ? true
        : this.#tRaw === 0;
  }

  pause(): void {
    if (this.#pausedFrame) {
      return;
    }
    this.#pausedFrame = BeetPx.frameNumber;
  }

  resume(): void {
    if (!this.#pausedFrame) {
      return;
    }
    this.#offsetFrame += BeetPx.frameNumber - this.#pausedFrame;
    this.#pausedFrame = null;
  }

  restart(): void {
    this.#offsetFrame = BeetPx.frameNumber;
    this.#pausedFrame = null;
  }
}
