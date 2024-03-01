import { BeetPx } from "../BeetPx";
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
  // timer: BpxTimer;
};

type Now<TPhaseName extends string> = {
  // offsetCurr: number;
  // offsetNext: number;
  phase: Phase<TPhaseName>;
  t: number;
  recentlyFinishedPhase: TPhaseName | null;
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

  // first iteration = intro + 1 iteration of a loop
  readonly #firstIterationPhases: Phase<TPhaseName>[];
  readonly #loopPhases: Phase<TPhaseName>[];

  readonly #firstIterationFrames: number;
  readonly #loopFrames: number;

  // the frame the counting should start at
  readonly #firstIterationOffset: number;
  readonly #loopOffset: number;

  readonly #firstIterationTimer: BpxTimer;
  readonly #loopTimer: BpxTimer | null;

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
    this.#firstIterationPhases = [...params.intro, ...params.loop].map(
      (entry) => ({
        name: entry[0],
        frames: entry[1],
        // timer: BpxTimer.for({
        //   frames: entry[1],
        //   loop: false,
        //   pause: false,
        //   delayFrames: 0,
        // }),
      }),
    );
    this.#loopPhases = params.loop.map((entry) => ({
      name: entry[0],
      frames: entry[1],
      // timer: BpxTimer.for({
      //   frames: entry[1],
      //   loop: false,
      //   pause: false,
      //   delayFrames: 0,
      // }),
    }));

    this.#firstIterationFrames = this.#firstIterationPhases.reduce(
      (acc, p) => acc + p.frames,
      0,
    );
    this.#loopFrames = this.#loopPhases.reduce((acc, p) => acc + p.frames, 0);

    this.#firstIterationOffset = BeetPx.frameNumber;
    this.#loopOffset = this.#firstIterationOffset + this.#firstIterationFrames;

    this.#firstIterationTimer = BpxTimer.for({
      frames: this.#loopOffset - this.#firstIterationOffset,
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
            delayFrames: this.#loopOffset - this.#firstIterationOffset,
          })
        : null;
  }

  get #now(): Now<TPhaseName> {
    if (this.#recentlyComputedNow?.frameNumber === BeetPx.frameNumber) {
      return this.#recentlyComputedNow.value;
    }

    //
    // If we are still within the first iteration (intro + first a iteration of the loop) …
    //

    if (!this.#loopTimer || BeetPx.frameNumber < this.#loopOffset) {
      const firstIterationT = this.#firstIterationTimer.t;

      let offset = 0;
      let prev: Phase<TPhaseName> | null = null;
      let i = 0;
      while (i < this.#firstIterationPhases.length - 1) {
        let curr = this.#firstIterationPhases[i]!;
        if (firstIterationT < offset + curr.frames) {
          return {
            phase: curr,
            t: firstIterationT - offset,
            recentlyFinishedPhase: prev?.name ?? null,
          };
        }
        offset += curr.frames;
        prev = curr;
        i += 1;
      }
      let curr = this.#firstIterationPhases[i]!;

      return {
        phase: curr,
        t: firstIterationT - offset,
        recentlyFinishedPhase: this.#firstIterationTimer.hasJustFinished
          ? curr.name
          : prev?.name ?? null,
      };
    }

    //
    // … or we are already in the loop (2nd+ iteration of the loop).
    //

    const loopT = this.#loopTimer.t;

    let offset = 0;
    let prev: Phase<TPhaseName> | null =
      this.#firstIterationPhases[this.#firstIterationPhases.length - 1]!;
    let i = 0;
    while (i < this.#loopPhases.length - 1) {
      let curr = this.#loopPhases[i]!;
      if (loopT < offset + curr.frames) {
        return {
          phase: curr,
          t: loopT - offset,
          recentlyFinishedPhase: prev?.name ?? null,
        };
      }
      offset += curr.frames;
      prev = curr;
      i += 1;
    }
    let curr = this.#loopPhases[i]!;

    return {
      phase: curr,
      t: loopT - offset,
      recentlyFinishedPhase: prev?.name ?? null,
    };

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
  }

  // TODO: REMOVE
  // get tmpTRaw() {
  //   return this.#tRaw;
  // }

  // TODO: REMOVE
  // get tmpNow() {
  //   return this.#now;
  // }

  get justFinishedPhase(): TPhaseName | null {
    return this.hasJustFinishedOverall || this.#now.t === 0
      ? this.#now.recentlyFinishedPhase
      : null;
  }

  get currentPhase(): TPhaseName {
    return this.#now.phase.name;
  }

  get #frames(): number {
    return 123;
    // const ctx = this.#now;
    // return ctx.offsetNext - ctx.offsetCurr;
  }

  // get #tRaw(): number {
  //   return 123;
  // return BeetPx.frameNumber - this.#now.offsetCurr;
  // }

  get t(): number {
    return this.#now.t;
  }

  get progress(): number {
    return this.#now.t / this.#now.phase.frames;
  }

  get framesLeft(): number {
    return this.#now.phase.frames - this.#now.t;
  }

  // get #tOverallRaw(): number {
  //   return 123;
  // return BeetPx.frameNumber - this.#offsetFrame;
  // }

  get tOverall(): number {
    return this.#firstIterationTimer.hasFinished
      ? this.#loopTimer?.t ?? this.#firstIterationTimer.t
      : this.#firstIterationTimer.t;
  }

  get framesLeftOverall(): number {
    return this.#firstIterationTimer.hasFinished
      ? this.#loopTimer?.framesLeft ?? this.#firstIterationTimer.framesLeft
      : this.#firstIterationTimer.framesLeft;
  }

  get progressOverall(): number {
    return this.#firstIterationTimer.hasFinished
      ? this.#loopTimer?.progress ?? this.#firstIterationTimer.progress
      : this.#firstIterationTimer.progress;
  }

  get hasFinishedOverall(): boolean {
    return this.#firstIterationTimer.hasFinished;
  }

  get hasJustFinishedOverall(): boolean {
    return (
      this.#loopTimer?.hasJustFinished ||
      this.#firstIterationTimer.hasJustFinished
    );
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
