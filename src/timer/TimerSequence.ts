import { BeetPx } from "../BeetPx";
import { BpxTimer } from "./Timer";

export function timerSeq_<TPhase extends string>(params: {
  intro?: Array<[phase: TPhase, frames: number]>;
  loop?: Array<[phase: TPhase, frames: number]>;
}): BpxTimerSequence<TPhase> {
  return BpxTimerSequence.of<TPhase>({
    intro: params.intro ?? [],
    loop: params.loop ?? [],
  });
}

export class BpxTimerSequence<TPhase extends string> {
  static of<TPhase extends string>(params: {
    intro: Array<[phase: TPhase, frames: number]>;
    loop: Array<[phase: TPhase, frames: number]>;
  }): BpxTimerSequence<TPhase> {
    return new BpxTimerSequence(params);
  }

  readonly #phases: Array<{ name: TPhase; frames: number; timer: BpxTimer }>;
  readonly #frames: number;

  readonly #offsetFrame: number = 0;

  private constructor(params: {
    // TODO: test
    intro: Array<[phase: TPhase, frames: number]>;
    // TODO: test
    loop: Array<[phase: TPhase, frames: number]>;
  }) {
    // TODO: rounding? clamping?

    this.#phases = params.intro.map((entry) => ({
      name: entry[0],
      frames: entry[1],
      timer: BpxTimer.for({ frames: entry[1], loop: false }),
    }));
    this.#frames = this.#phases.reduce((acc, p) => acc + p.frames, 0);

    // TODO: move to restart?
    this.#offsetFrame = BeetPx.frameNumber;
  }

  // TODO: test
  get justFinishedPhase(): TPhase | null {
    // TODO: ???
    return null;
  }

  // TODO: test
  get phase(): TPhase {
    // TODO: ???
    return "aaa" as TPhase;
  }

  // TODO: test
  get phaseTimer(): BpxTimer {
    let tmp = this.t;
    let idx = 0;

    // TODO: ???
    // while (idx < this.#phases.length && tmp > this.#phases[idx]!.frames) {
    while (tmp > this.#phases[idx]!.frames) {
      tmp -= this.#phases[idx]!.frames;
      idx += 1;
    }

    return this.#phases[idx]!.timer;
  }

  // TODO: test
  get t(): number {
    return BeetPx.frameNumber - this.#offsetFrame;

    // TODO: ???
    // return this.#loop
    //   ? BpxUtils.mod(this.#tRaw, this.#frames)
    //   : BpxUtils.clamp(0, this.#tRaw, this.#frames);
    // TODO: tRaw ???
    // return (this.#pausedFrame ?? BeetPx.frameNumber) - this.#offsetFrame;
  }

  // TODO: test
  get framesLeft(): number {
    return this.#frames - this.t;
  }

  // TODO: test
  get progress(): number {
    return this.t / this.#frames;

    // TODO: ???
    // return this.#frames > 0 ? this.t / this.#frames : 1;
  }

  // TODO: test
  get hasFinished(): boolean {
    // TODO: ???
    return false;

    // TODO: ???
    // return return this.#loop ? false : this.#tRaw >= this.#frames;
  }

  // TODO: test
  get hasJustFinished(): boolean {
    // TODO: ???
    return false;

    // TODO: ???
    // return this.#frames > 0
    //   ? this.#loop
    //     ? this.#tRaw > 0 && this.t === 0
    //     : this.#tRaw === this.#frames
    //   : this.#loop
    //     ? true
    //     : this.#tRaw === 0;
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
