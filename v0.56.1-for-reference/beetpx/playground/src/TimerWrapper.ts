import { $timer, BpxTimer } from "../../src";

export class TimerWrapper {
  #timer: BpxTimer;

  constructor(frames: number) {
    this.#timer = $timer(frames);
  }

  get t(): number {
    return this.#timer.t;
  }
}
