import { BeetPx } from "../";
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

/**
 * A timer sequence, which is a more advanced version of the {@link BpxTimer}.
 * It allows to define a complex set of intervals and looping with use
 * of multiple `intro` and `loop` phases.
 *
 * @see {@link $timerSeq}
 *
 * @category Core
 */
export class BpxTimerSequence<TPhaseName extends string> {
  /**
   * @see {@link $timerSeq}
   *
   * @group Static factories
   */
  static of<TPhaseName extends string>(
    params: {
      intro: Array<[phase: TPhaseName, frames: number]>;
      loop: Array<[phase: TPhaseName, frames: number]>;
    },
    opts: {
      paused: boolean;
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

  readonly #ignoreGamePause: boolean;
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
      paused: boolean;
      delayFrames: number;
      onGamePause: "pause" | "ignore";
    },
  ) {
    this.#ignoreGamePause = opts.onGamePause === "ignore";
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

    this.#firstIterationTimer = BpxTimer.of({
      frames: this.#firstIterationFrames,
      loop: false,
      paused: opts.paused,
      delayFrames: opts.delayFrames,
      onGamePause: this.#onGamePause,
    });
    this.#loopTimer =
      this.#loopPhases.length > 0 ?
        BpxTimer.of({
          frames: this.#loopFrames,
          loop: true,
          paused: opts.paused,
          delayFrames: opts.delayFrames + this.#firstIterationFrames,
          onGamePause: this.#onGamePause,
        })
      : null;

    this.#isPaused = false;
    this.#pausedFrame = null;
    if (opts.paused) {
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
            (curr?.name ?? null)
          : (prev?.name ?? null),
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

  /**
   * The name of the phase which has finished in the recent game loop iteration.
   */
  get justFinishedPhase(): TPhaseName | null {
    return this.hasJustFinishedOverall || this.#now.t === 0 ?
        this.#now.recentlyFinishedPhase
      : null;
  }

  /**
   * The name of the currently counted phase.
   */
  get currentPhase(): TPhaseName | null {
    return this.#now.phase?.name ?? null;
  }

  // frame number
  get #fn(): number {
    return this.#ignoreGamePause ?
        BeetPx.frameNumber
      : BeetPx.frameNumberOutsidePause;
  }

  /**
   * A current counted frame number within the current phase, incrementing from 0.
   */
  get t(): number {
    return this.#now.t;
  }

  /**
   * A progress of the counting for the current phase, gradually incrementing from 0 to 1.
   */
  get progress(): number {
    return this.#now.phase && this.#now.phase.frames > 0 ?
        this.#now.t / this.#now.phase.frames
      : 1;
  }

  /**
   * A an amount of frames left to be counted in the current phase, decrementing down to 0.
   */
  get framesLeft(): number {
    return this.#now.phase ? this.#now.phase.frames - this.#now.t : 0;
  }

  /**
   * A current counted frame number for the entire sequence (intro + 1 loop pass),
   * incrementing from 0.
   * After the first loop pass, the intro is no longer taken into account in the calculation.
   */
  get tOverall(): number {
    return this.#firstIterationTimer.hasFinished ?
        (this.#loopTimer?.t ?? this.#firstIterationTimer.t)
      : this.#firstIterationTimer.t;
  }

  /**
   * A an amount of frames left to be counted for the entire sequence (intro + 1 loop pass),
   * decrementing down to 0.
   * After the first loop pass, the intro is no longer taken into account in the calculation.
   */
  get framesLeftOverall(): number {
    return this.#firstIterationTimer.hasFinished ?
        (this.#loopTimer?.framesLeft ?? this.#firstIterationTimer.framesLeft)
      : this.#firstIterationTimer.framesLeft;
  }

  /**
   * A progress of the counting for the entire sequence (intro + 1 loop pass),
   * gradually incrementing from 0 to 1.
   * After the first loop pass, the intro is no longer taken into account in the calculation.
   */
  get progressOverall(): number {
    return this.#firstIterationTimer.hasFinished ?
        (this.#loopTimer?.progress ?? this.#firstIterationTimer.progress)
      : this.#firstIterationTimer.progress;
  }

  /**
   * Whether this timer has finished already the entire sequence (intro + 1 loop pass).
   * This becomes `true` forever afterwards.
   */
  get hasFinishedOverall(): boolean {
    return this.#firstIterationTimer.hasFinished;
  }

  /**
   * Whether this timer has finished the entire sequence (intro + 1 loop pass)
   * in the most recent game loop iteration.
   * After the first loop pass, the intro is no longer taken into account.
   */
  get hasJustFinishedOverall(): boolean {
    return (
      this.#loopTimer?.hasJustFinished ||
      this.#firstIterationTimer.hasJustFinished
    );
  }

  /**
   * Pauses the timer.
   */
  pause(): void {
    if (this.#isPaused) return;
    this.#isPaused = true;

    this.#pausedFrame = this.#fn;

    this.#firstIterationTimer.pause();
    this.#loopTimer?.pause();
  }

  /**
   * Resumes the timer.
   */
  resume(): void {
    if (!this.#isPaused) return;
    this.#isPaused = false;

    this.#firstIterationOffset += this.#fn - (this.#pausedFrame ?? 0);
    this.#pausedFrame = null;

    this.#firstIterationTimer.resume();
    this.#loopTimer?.resume();
  }

  /**
   * Restarts the timer from 0.
   */
  restart(): void {
    this.#firstIterationOffset = this.#fn;

    this.#isPaused = false;
    this.#pausedFrame = null;

    this.#firstIterationTimer.restart();
    if (this.#loopTimer) {
      this.#loopTimer = BpxTimer.of({
        frames: this.#loopFrames,
        loop: true,
        paused: false,
        delayFrames: this.#firstIterationFrames,
        onGamePause: this.#onGamePause,
      });
    }
  }
}
