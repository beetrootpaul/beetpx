import { BeetPx } from "../BeetPx";
import { BpxUtils } from "../Utils";

export function timer_(
  frames: number,
  opts?: { loop?: boolean; pause?: boolean },
): BpxTimer {
  return BpxTimer.for({
    frames,
    loop: opts?.loop ?? false,
    pause: opts?.pause ?? false,
  });
}

export class BpxTimer {
  static for(params: {
    frames: number;
    loop: boolean;
    pause: boolean;
  }): BpxTimer {
    return new BpxTimer(params);
  }

  readonly #frames: number;
  readonly #loop: boolean;

  #offsetFrame: number = 0;
  #pausedFrame: number | null = null;

  private constructor(params: {
    frames: number;
    loop: boolean;
    pause: boolean;
  }) {
    this.#frames = Math.max(0, Math.round(params.frames));
    this.#loop = params.loop;

    this.restart();

    if (params.pause) {
      this.pause();
    }
  }

  get #tRaw(): number {
    return (this.#pausedFrame ?? BeetPx.frameNumber) - this.#offsetFrame;
  }

  get t(): number {
    return this.#loop
      ? BpxUtils.mod(this.#tRaw, this.#frames)
      : BpxUtils.clamp(0, this.#tRaw, this.#frames);
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
    this.#offsetFrame += BeetPx.frameNumber - this.#pausedFrame!;
    this.#pausedFrame = null;
  }

  restart(): void {
    this.#offsetFrame = BeetPx.frameNumber;
    this.#pausedFrame = null;
  }
}
