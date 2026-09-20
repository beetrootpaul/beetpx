import {$timer, BpxTimer} from "@beetpx/beetpx";

export class Counter {
  #timer: BpxTimer;

  constructor(frames: number) {
    this.#timer = $timer(frames, {loop: true});
  }

  get left(): number {
    return this.#timer.framesLeft - 1;
  }
}
