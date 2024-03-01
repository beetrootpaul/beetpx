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
  recentlyFinishedPhase: TPhaseName | null;
  phase: Phase<TPhaseName> | null;
  t: number;
};

// TODO: simplify if possible (after implementing 100% of features)
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
        frames: Math.round(entry[1]),
      }),
    );
    this.#loopPhases = params.loop.map((entry) => ({
      name: entry[0],
      frames: Math.round(entry[1]),
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
            recentlyFinishedPhase: prev?.name ?? null,
            phase: curr,
            t: firstIterationT - offset,
          };
        }
        offset += curr.frames;
        prev = curr;
        i += 1;
      }
      let curr = this.#firstIterationPhases[i] ?? null;

      return {
        recentlyFinishedPhase: this.#firstIterationTimer.hasJustFinished
          ? curr?.name ?? null
          : prev?.name ?? null,
        phase: curr,
        t: firstIterationT - offset,
      };
    }

    //
    // … or we are already in the loop (2nd+ iteration of the loop).
    //

    const loopT = this.#loopTimer.t;

    let offset = 0;
    let prev: Phase<TPhaseName> | null =
      this.#firstIterationPhases[this.#firstIterationPhases.length - 1] ?? null;
    let i = 0;
    while (i < this.#loopPhases.length - 1) {
      let curr = this.#loopPhases[i]!;
      if (loopT < offset + curr.frames) {
        return {
          recentlyFinishedPhase: prev?.name ?? null,
          phase: curr,
          t: loopT - offset,
        };
      }
      offset += curr.frames;
      prev = curr;
      i += 1;
    }
    let curr = this.#loopPhases[i] ?? null;

    return {
      recentlyFinishedPhase: prev?.name ?? null,
      phase: curr,
      t: loopT - offset,
    };
  }

  get justFinishedPhase(): TPhaseName | null {
    return this.hasJustFinishedOverall || this.#now.t === 0
      ? this.#now.recentlyFinishedPhase
      : null;
  }

  get currentPhase(): TPhaseName | null {
    return this.#now.phase?.name ?? null;
  }

  get t(): number {
    return this.#now.t;
  }

  get progress(): number {
    return this.#now.phase && this.#now.phase.frames > 0
      ? this.#now.t / this.#now.phase.frames
      : 1;
  }

  get framesLeft(): number {
    return this.#now.phase ? this.#now.phase.frames - this.#now.t : 0;
  }

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
  pause(): void {
    // TODO: ???
    // TODO: ???
    // if (this.#pausedFrame) {
    //   return;
    // }
    // this.#pausedFrame = BeetPx.frameNumber;
  }

  // TODO: test
  resume(): void {
    // TODO: ???
    // TODO: ???
    // if (!this.#pausedFrame) {
    //   return;
    // }
    // this.#offsetFrame += BeetPx.frameNumber - this.#pausedFrame!;
    // this.#pausedFrame = null;
  }

  // TODO: test
  restart(): void {
    // TODO: ???
    // TODO: ???
    // this.#offsetFrame = BeetPx.frameNumber;
    // this.#pausedFrame = null;
  }
}
