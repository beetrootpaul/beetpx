import { BpxTimer, timer_ } from "./Timer";

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

  // TODO: ???
  // readonly #phases: Array<{ name: TPhase; frames: number; timer: BpxTimer }>;
  // readonly #framesTotal: number;
  // readonly #loop: boolean;
  // #current: number;

  private constructor(params: {
    // TODO: test
    intro: Array<[phase: TPhase, frames: number]>;
    // TODO: test
    loop: Array<[phase: TPhase, frames: number]>;
  }) {
    // TODO: ???
    //   this.#phases = Object.entries<number>(params.phases).map(
    //     ([phase, frames]) => ({
    //       name: phase as TPhase,
    //       frames: frames,
    //       timer: new BpxTimer({ frames, loop: false }),
    //     }),
    //   );
    //   this.#framesTotal = this.#phases.reduce((acc, p) => acc + p.frames, 0);
    //   this.#loop = params.loop;
    //   this.#current = 0;
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
    // TODO: ???
    return timer_(8);
  }

  // TODO: test
  get t(): number {
    // TODO: ???
    return 0;
  }

  // TODO: test
  get framesLeft(): number {
    // TODO: ???
    return 10;
  }

  // TODO: test
  get progress(): number {
    // TODO: ???
    return 0;
  }

  // TODO: test
  get hasFinished(): boolean {
    // TODO: ???
    return false;
  }

  // TODO: test
  get hasJustFinished(): boolean {
    // TODO: ???
    return false;
  }

  // TODO: test
  pause(): void {
    // TODO: ???
  }

  // TODO: test
  resume(): void {
    // TODO: ???
  }

  // TODO: test
  restart(): void {
    // TODO: ???
  }
}
