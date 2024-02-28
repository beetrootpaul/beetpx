import { BeetPx } from "../BeetPx";
import { BpxTimer } from "./Timer";

export function timerSeq_<TPhaseName extends string>(
  params: {
    intro?: Array<[phase: TPhaseName, frames: number]>;
    loop?: Array<[phase: TPhaseName, frames: number]>;
  },
  opts?: {
    pause?: boolean;
  },
): BpxTimerSequence<TPhaseName> {
  return BpxTimerSequence.of<TPhaseName>(
    {
      intro: params.intro ?? [],
      loop: params.loop ?? [],
    },
    {
      pause: opts?.pause ?? false,
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

export class BpxTimerSequence<TPhaseName extends string> {
  static of<TPhaseName extends string>(
    params: {
      intro: Array<[phase: TPhaseName, frames: number]>;
      loop: Array<[phase: TPhaseName, frames: number]>;
    },
    opts: {
      pause: boolean;
    },
  ): BpxTimerSequence<TPhaseName> {
    return new BpxTimerSequence(params, opts);
  }

  readonly #framesOverall: number;
  readonly #globalTimer: BpxTimer;

  readonly #phases: Phase<TPhaseName>[];

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
    },
  ) {
    // TODO: rounding? clamping?

    this.#phases = params.intro.map((entry) => ({
      name: entry[0],
      frames: entry[1],
      timer: BpxTimer.for({ frames: entry[1], loop: false, pause: false }),
    }));
    this.#framesOverall = this.#phases.reduce((acc, p) => acc + p.frames, 0);
    this.#globalTimer = BpxTimer.for({
      frames: this.#framesOverall,
      loop: false,
      pause: false,
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
    let prev: Phase<TPhaseName> | undefined;
    let curr: Phase<TPhaseName> | undefined;

    while (i < this.#phases.length) {
      prev = this.#phases[i - 1];
      curr = this.#phases[i];

      if (!curr) {
        break;
      }

      if (offset + curr.frames > BeetPx.frameNumber) {
        return {
          // prev: this.#phases[i - 1]!.name,
          // curr: curr.name,
          phase: curr.name,
          offsetCurr: offset,
          offsetNext: offset + curr.frames,
          recentlyFinished: prev?.name ?? null,
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
    };
  }

  get justFinishedPhase(): TPhaseName | null {
    return this.#tRaw === 0 || this.#tRaw === this.#frames
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
    return Math.min(BeetPx.frameNumber - this.#now.offsetCurr, this.#frames);
  }

  get progress(): number {
    const f = this.#frames;
    return this.t / f;
  }

  get framesLeft(): number {
    return this.#frames - this.t;
  }

  get tOverall(): number {
    // TODO: clamp this on the bottom as well
    return Math.min(
      BeetPx.frameNumber - this.#offsetFrame,
      this.#framesOverall,
    );

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
