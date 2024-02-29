import { BeetPx } from "../BeetPx";
import { BpxUtils } from "../Utils";
import { BpxTimer } from "./Timer";

export function timerSeq_<TPhaseName extends string>(
  params: {
    intro?: Array<[phase: TPhaseName, frames: number]>;
    loop?: Array<[phase: TPhaseName, frames: number]>;
  },
  opts?: {
    pause?: boolean;
    delayFrames?: number;
  },
): BpxTimerSequence<TPhaseName> {
  return BpxTimerSequence.of<TPhaseName>(
    {
      intro: params.intro ?? [],
      loop: params.loop ?? [],
    },
    {
      pause: opts?.pause ?? false,
      delayFrames: opts?.delayFrames ?? 0,
    },
  );
}

type Phase<TPhaseName extends string> = {
  name: TPhaseName;
  frames: number;
  timer: BpxTimer;
};

type Now<TPhaseName extends string> = {
  offsetCurr: number;
  offsetNext: number;
  phase: TPhaseName;
  recentlyFinished: TPhaseName | null;
};

// TODO: tests for negative or 0-length frames
// TODO: tests for nothing defined
// TODO: tests for time moving backwards / before the timer's start

export class BpxTimerSequence<TPhaseName extends string> {
  static of<TPhaseName extends string>(
    params: {
      intro: Array<[phase: TPhaseName, frames: number]>;
      loop: Array<[phase: TPhaseName, frames: number]>;
    },
    opts: {
      pause: boolean;
      delayFrames: number;
    },
  ): BpxTimerSequence<TPhaseName> {
    return new BpxTimerSequence(params, opts);
  }

  readonly #framesOverall: number;
  readonly #globalTimer: BpxTimer;

  readonly #phases: Phase<TPhaseName>[];
  readonly #loop: boolean;

  readonly #offsetFrame: number = 0;

  #recentlyComputedNow:
    | { frameNumber: number; value: Now<TPhaseName> }
    | undefined;

  private constructor(
    params: {
      // TODO: test
      intro: Array<[phase: TPhaseName, frames: number]>;
      // TODO: test
      loop: Array<[phase: TPhaseName, frames: number]>;
    },
    opts: {
      // TODO: implement it + test
      pause: boolean;
      // TODO: implement it + test
      delayFrames: number;
    },
  ) {
    // TODO: rounding? clamping?

    this.#phases = [...params.intro, ...params.loop].map((entry) => ({
      name: entry[0],
      frames: entry[1],
      timer: BpxTimer.for({
        frames: entry[1],
        loop: false,
        pause: false,
        delayFrames: 0,
      }),
    }));

    this.#loop = params.loop.length > 0;

    this.#framesOverall = this.#phases.reduce((acc, p) => acc + p.frames, 0);

    this.#globalTimer = BpxTimer.for({
      frames: this.#framesOverall,
      loop: this.#loop,
      pause: false,
      delayFrames: 0,
    });

    // TODO: move to restart?
    this.#offsetFrame = BeetPx.frameNumber;
  }

  get #now(): Now<TPhaseName> {
    if (this.#recentlyComputedNow?.frameNumber === BeetPx.frameNumber) {
      return this.#recentlyComputedNow.value;
    }

    let offset = this.#offsetFrame;
    let i = 0;
    let prev: Phase<TPhaseName> | undefined = undefined;
    let curr: Phase<TPhaseName> | undefined = undefined;

    while (i < this.#phases.length) {
      prev =
        i > 0
          ? this.#phases[i - 1]
          : this.#loop
            ? this.#phases[this.#phases.length - 1]
            : undefined;
      curr = this.#phases[i];

      if (!curr) {
        break;
      }

      if (
        this.#loop
          ? curr.frames >
            BpxUtils.mod(BeetPx.frameNumber - offset, this.#framesOverall)
          : curr.frames > BeetPx.frameNumber - offset
      ) {
        return {
          phase: curr.name,
          offsetCurr: offset,
          offsetNext: offset + curr.frames,
          recentlyFinished: prev?.name ?? null,
          // TODO: REMOVE
          // @ts-ignore
          prev: prev,
          // TODO: REMOVE
          // @ts-ignore
          i: i,
        };
      }

      offset += curr.frames;
      i += 1;
    }

    if (curr) {
      offset -= curr.frames;
    }

    return {
      // TODO: get rid of "!"
      phase: curr!.name,
      offsetCurr: offset,
      // TODO: get rid of "!"
      offsetNext: offset + curr!.frames,
      recentlyFinished: curr?.name ?? null,
      // TODO: REMOVE
      // @ts-ignore
      prev2: prev,
    };
  }

  // TODO: REMOVE
  get tmpTRaw() {
    return this.#tRaw;
  }

  // TODO: REMOVE
  get tmpNow() {
    return this.#now;
  }

  get justFinishedPhase(): TPhaseName | null {
    return this.#loop
      ? this.#tOverallRaw > 0 && this.t === 0
        ? this.#now.recentlyFinished
        : null
      : this.#tRaw === 0 || this.#tRaw === this.#frames
        ? this.#now.recentlyFinished
        : null;
  }

  get currentPhase(): TPhaseName {
    return this.#now.phase;
  }

  get #frames(): number {
    const ctx = this.#now;
    return ctx.offsetNext - ctx.offsetCurr;
  }

  get #tRaw(): number {
    return BeetPx.frameNumber - this.#now.offsetCurr;
  }

  get t(): number {
    // TODO: clamp this on the bottom as well
    return this.#loop
      ? BpxUtils.mod(this.tmpTRaw, this.#framesOverall)
      : Math.min(this.#tRaw, this.#frames);
  }

  get progress(): number {
    const f = this.#frames;
    return this.t / f;
  }

  get framesLeft(): number {
    return this.#frames - this.t;
  }

  get #tOverallRaw(): number {
    return BeetPx.frameNumber - this.#offsetFrame;
  }

  get tOverall(): number {
    return this.#loop
      ? BpxUtils.mod(this.#tOverallRaw, this.#framesOverall)
      : // TODO: clamp this on the bottom as well
        Math.min(this.#tOverallRaw, this.#framesOverall);

    // TODO: ???
    // return this.#loop
    //   ? BpxUtils.mod(this.#tRaw, this.#getFrames)
    //   : BpxUtils.clamp(0, this.#tRaw, this.#getFrames);
    // TODO: tRaw ???
    // return (this.#pausedFrame ?? BeetPx.frameNumber) - this.#offsetFrame;
  }

  get framesLeftOverall(): number {
    return this.#globalTimer.framesLeft;
  }

  get progressOverall(): number {
    return this.#globalTimer.progress;
  }

  get hasFinishedOverall(): boolean {
    return this.#globalTimer.hasFinished;
  }

  get hasJustFinishedOverall(): boolean {
    return this.#globalTimer.hasJustFinished;
  }

  // TODO: test
  // pause(): void {
  // TODO: ???
  // TODO: ???
  // if (this.#pausedFrame) {
  //   return;
  // }
  // this.#pausedFrame = BeetPx.frameNumber;
  // }

  // TODO: test
  // resume(): void {
  // TODO: ???
  // TODO: ???
  // if (!this.#pausedFrame) {
  //   return;
  // }
  // this.#offsetFrame += BeetPx.frameNumber - this.#pausedFrame!;
  // this.#pausedFrame = null;
  // }

  // TODO: test
  // restart(): void {
  // TODO: ???
  // TODO: ???
  // this.#offsetFrame = BeetPx.frameNumber;
  // this.#pausedFrame = null;
  // }
}
