import { BeetPx } from "../BeetPx";
import { BpxTimer } from "./Timer";

type Phase<TPhaseName extends string> = {
  name: TPhaseName;
  frames: number;
};

type Now<TPhaseName extends string> = {
  recentlyFinishedPhase: TPhaseName | null;
  phase: Phase<TPhaseName> | null;
  t: number;
};

export class BpxTimerSequence<TPhaseName extends string> {
  static of<TPhaseName extends string>(
    params: {
      intro: Array<[phase: TPhaseName, frames: number]>;
      loop: Array<[phase: TPhaseName, frames: number]>;
    },
    opts: {
      pause: boolean;
      delayFrames: number;
      onGamePause: "pause" | "ignore";
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
  #firstIterationOffset: number;

  readonly #ignoreGlobalPause: boolean;
  readonly #onGamePause: "pause" | "ignore";
  #isPaused: boolean;

  #pausedFrame: number | null;

  readonly #firstIterationTimer: BpxTimer;
  #loopTimer: BpxTimer | null;

  #recentlyComputedNow:
    | { frameNumber: number; value: Now<TPhaseName> }
    | undefined;

  private constructor(
    params: {
      intro: Array<[phase: TPhaseName, frames: number]>;
      loop: Array<[phase: TPhaseName, frames: number]>;
    },
    opts: {
      pause: boolean;
      delayFrames: number;
      onGamePause: "pause" | "ignore";
    },
  ) {
    this.#ignoreGlobalPause = opts.onGamePause === "ignore";
    this.#onGamePause = opts.onGamePause;

    this.#firstIterationPhases = [...params.intro, ...params.loop].map(
      entry => ({
        name: entry[0],
        frames: Math.max(0, Math.round(entry[1])),
      }),
    );
    this.#loopPhases = params.loop.map(entry => ({
      name: entry[0],
      frames: Math.max(0, Math.round(entry[1])),
    }));

    this.#firstIterationFrames = this.#firstIterationPhases.reduce(
      (acc, p) => acc + p.frames,
      0,
    );
    this.#loopFrames = this.#loopPhases.reduce((acc, p) => acc + p.frames, 0);

    this.#firstIterationOffset = this.#fn + opts.delayFrames;

    this.#firstIterationTimer = BpxTimer.for({
      frames: this.#firstIterationFrames,
      loop: false,
      pause: opts.pause,
      delayFrames: opts.delayFrames,
      onGamePause: this.#onGamePause,
    });
    this.#loopTimer =
      this.#loopPhases.length > 0 ?
        BpxTimer.for({
          frames: this.#loopFrames,
          loop: true,
          pause: opts.pause,
          delayFrames: opts.delayFrames + this.#firstIterationFrames,
          onGamePause: this.#onGamePause,
        })
      : null;

    this.#isPaused = false;
    this.#pausedFrame = null;
    if (opts.pause) {
      this.pause();
    }
  }

  get #now(): Now<TPhaseName> {
    if (
      this.#recentlyComputedNow?.frameNumber === (this.#pausedFrame ?? this.#fn)
    ) {
      return this.#recentlyComputedNow.value;
    }

    //
    // If we are still within the first iteration (intro + first a iteration of the loop) …
    //

    if (
      !this.#loopTimer ||
      (this.#pausedFrame ?? this.#fn) <
        this.#firstIterationOffset + this.#firstIterationFrames
    ) {
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
        recentlyFinishedPhase:
          this.#firstIterationTimer.hasJustFinished ?
            curr?.name ?? null
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
    return this.hasJustFinishedOverall || this.#now.t === 0 ?
        this.#now.recentlyFinishedPhase
      : null;
  }

  get currentPhase(): TPhaseName | null {
    return this.#now.phase?.name ?? null;
  }

  get #fn(): number {
    return this.#ignoreGlobalPause ?
        BeetPx.frameNumber
      : BeetPx.frameNumberOutsidePause;
  }

  get t(): number {
    return this.#now.t;
  }

  get progress(): number {
    return this.#now.phase && this.#now.phase.frames > 0 ?
        this.#now.t / this.#now.phase.frames
      : 1;
  }

  get framesLeft(): number {
    return this.#now.phase ? this.#now.phase.frames - this.#now.t : 0;
  }

  get tOverall(): number {
    return this.#firstIterationTimer.hasFinished ?
        this.#loopTimer?.t ?? this.#firstIterationTimer.t
      : this.#firstIterationTimer.t;
  }

  get framesLeftOverall(): number {
    return this.#firstIterationTimer.hasFinished ?
        this.#loopTimer?.framesLeft ?? this.#firstIterationTimer.framesLeft
      : this.#firstIterationTimer.framesLeft;
  }

  get progressOverall(): number {
    return this.#firstIterationTimer.hasFinished ?
        this.#loopTimer?.progress ?? this.#firstIterationTimer.progress
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

  pause(): void {
    if (this.#isPaused) return;
    this.#isPaused = true;

    this.#pausedFrame = this.#fn;

    this.#firstIterationTimer.pause();
    this.#loopTimer?.pause();
  }

  resume(): void {
    if (!this.#isPaused) return;
    this.#isPaused = false;

    this.#firstIterationOffset += this.#fn - (this.#pausedFrame ?? 0);
    this.#pausedFrame = null;

    this.#firstIterationTimer.resume();
    this.#loopTimer?.resume();
  }

  restart(): void {
    this.#firstIterationOffset = this.#fn;

    this.#isPaused = false;
    this.#pausedFrame = null;

    this.#firstIterationTimer.restart();
    if (this.#loopTimer) {
      this.#loopTimer = BpxTimer.for({
        frames: this.#loopFrames,
        loop: true,
        pause: false,
        delayFrames: this.#firstIterationFrames,
        onGamePause: this.#onGamePause,
      });
    }
  }
}
