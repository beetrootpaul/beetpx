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
  // name: TPhaseName;
  frames: number;
  // timer: BpxTimer;
};

// type Now<TPhaseName extends string> = {
// offsetCurr: number;
// offsetNext: number;
// phase: TPhaseName;
// recentlyFinished: TPhaseName | null;
// };

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

  readonly #introPhases: Phase<TPhaseName>[];
  readonly #loopPhases: Phase<TPhaseName>[];

  readonly #introFrames: number;
  readonly #loopFrames: number;

  readonly #firstIterationTimer: BpxTimer;
  readonly #loopTimer: BpxTimer | null;

  // readonly #offsetFrame: number = 0;
  //
  // #recentlyComputedNow:
  //   | { frameNumber: number; value: Now<TPhaseName> }
  //   | undefined;
  //
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
    this.#introPhases = params.intro.map((entry) => ({
      // name: entry[0],
      frames: entry[1],
      // timer: BpxTimer.for({
      //   frames: entry[1],
      //   loop: false,
      //   pause: false,
      //   delayFrames: 0,
      // }),
    }));
    this.#loopPhases = params.loop.map((entry) => ({
      // name: entry[0],
      frames: entry[1],
      // timer: BpxTimer.for({
      //   frames: entry[1],
      //   loop: false,
      //   pause: false,
      //   delayFrames: 0,
      // }),
    }));

    this.#introFrames = this.#introPhases.reduce((acc, p) => acc + p.frames, 0);
    this.#loopFrames = this.#loopPhases.reduce((acc, p) => acc + p.frames, 0);

    this.#firstIterationTimer = BpxTimer.for({
      frames: this.#introFrames + this.#loopFrames,
      loop: false,
      pause: false,
      delayFrames: 0,
    });
    this.#loopTimer =
      this.#loopPhases.length > 0
        ? BpxTimer.for({
            frames: this.#loopFrames,
            loop: true,
            pause: false,
            delayFrames: this.#introFrames + this.#loopFrames,
          })
        : null;

    // this.#offsetFrame = BeetPx.frameNumber;
  }

  // get #now(): Now<TPhaseName> {
  //   if (this.#recentlyComputedNow?.frameNumber === BeetPx.frameNumber) {
  //     return this.#recentlyComputedNow.value;
  //   }
  //
  //   let offset = this.#offsetFrame;
  //   let prev: Phase<TPhaseName> | undefined = undefined;
  //   let curr: Phase<TPhaseName> | undefined =
  //     this.#loopPhases.length > 0
  //       ? this.#loopPhases[this.#loopPhases.length - 1]
  //       : undefined;
  //
  //   let i = 0;
  //   while (i < this.#introPhases.length) {
  //     prev = curr;
  //     curr = this.#introPhases[i];
  //     if (!curr) break;
  //     if (curr.frames > BeetPx.frameNumber - offset) {
  //       return {
  //         phase: curr.name,
  //         offsetCurr: offset,
  //         offsetNext: offset + curr.frames,
  //         recentlyFinished: prev?.name ?? null,
  //       };
  //     }
  //     offset += curr.frames;
  //     i += 1;
  //   }
  //
  //   i = 0;
  //   while (i < this.#loopPhases.length) {
  //     prev = curr;
  //     curr = this.#loopPhases[i];
  //     if (!curr) break;
  //     if (curr.frames > BeetPx.frameNumber - offset) {
  //       return {
  //         phase: curr.name,
  //         offsetCurr: offset,
  //         offsetNext: offset + curr.frames,
  //         recentlyFinished: prev?.name ?? null,
  //       };
  //     }
  //     offset += curr.frames;
  //     i += 1;
  //   }
  //
  //   i = 0;
  //   while (i < this.#loopPhases.length) {
  //     prev = curr;
  //     curr = this.#loopPhases[i];
  //     if (!curr) break;
  //     if (
  //       curr.frames >
  //       BpxUtils.mod(BeetPx.frameNumber - offset, this.#loopFrames)
  //     ) {
  //       return {
  //         phase: curr.name,
  //         offsetCurr: offset,
  //         offsetNext: offset + curr.frames,
  //         recentlyFinished: prev?.name ?? null,
  //       };
  //     }
  //     offset += curr.frames;
  //     i += 1;
  //   }
  //
  //   if (curr) {
  //     offset -= curr.frames;
  //   }
  //
  //   return {
  // TODO: get rid of "!"
  // phase: curr!.name,
  // offsetCurr: offset,
  // TODO: get rid of "!"
  // offsetNext: offset + curr!.frames,
  // recentlyFinished: curr?.name ?? null,
  // TODO: REMOVE
  // };
  // }

  // TODO: REMOVE
  // get tmpTRaw() {
  //   return this.#tRaw;
  // }

  // TODO: REMOVE
  // get tmpNow() {
  //   return this.#now;
  // }

  get justFinishedPhase(): TPhaseName | null {
    return null;
    // return this.#loopTimer
    //   ? this.#tOverallRaw > 0 && this.t === 0
    //     ? this.#now.recentlyFinished
    //     : null
    //   : this.#tRaw === 0 || this.#tRaw === this.#frames
    //     ? this.#now.recentlyFinished
    //     : null;
  }

  get currentPhase(): TPhaseName {
    return "aaa" as TPhaseName;
    // return this.#now.phase;
  }

  get #frames(): number {
    return 123;
    // const ctx = this.#now;
    // return ctx.offsetNext - ctx.offsetCurr;
  }

  get #tRaw(): number {
    return 123;
    // return BeetPx.frameNumber - this.#now.offsetCurr;
  }

  get t(): number {
    return 123;
    // return this.#loopTimer
    //   ? this.#tOverallRaw < this.#introFrames + this.#loopFrames
    //     ? BpxUtils.mod(this.#tRaw, this.#introFrames + this.#loopFrames)
    //     : BpxUtils.mod(this.#tRaw - this.#introFrames, this.#loopFrames)
    //   : Math.min(this.#tRaw, this.#frames);
  }

  get progress(): number {
    return 123;
    // const f = this.#frames;
    // return this.t / f;
  }

  get framesLeft(): number {
    return 123;
    // return this.#frames - this.t;
  }

  get #tOverallRaw(): number {
    return 123;
    // return BeetPx.frameNumber - this.#offsetFrame;
  }

  get tOverall(): number {
    return this.#loopTimer
      ? this.#firstIterationTimer.hasFinished
        ? this.#loopTimer.t
        : this.#firstIterationTimer.t
      : this.#firstIterationTimer.t;
  }

  get framesLeftOverall(): number {
    return 123;
    // return this.#loopTimer
    //   ? this.#firstIterationTimer.hasFinished
    //     ? this.#loopTimer.framesLeft
    //     : this.#firstIterationTimer.framesLeft
    //   : this.#firstIterationTimer.framesLeft;
  }

  get progressOverall(): number {
    return 123;
    // return this.#loopTimer
    //   ? this.#firstIterationTimer.hasFinished
    //     ? this.#loopTimer.progress
    //     : this.#firstIterationTimer.progress
    //   : this.#firstIterationTimer.progress;
  }

  get hasFinishedOverall(): boolean {
    return true;
    // return this.#firstIterationTimer.hasFinished;
  }

  get hasJustFinishedOverall(): boolean {
    return true;
    // return (
    //   this.#firstIterationTimer.hasJustFinished ||
    //   (this.#loopTimer?.hasJustFinished ?? false)
    // );
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
