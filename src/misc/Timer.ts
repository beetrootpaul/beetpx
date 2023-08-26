// TODO: update to be based on passed time and not on frame numbers

export class Timer {
  static readonly #zeroThreshold = 1e-8;

  readonly #secondsTotal: number;
  #secondsLeft: number;

  constructor(seconds: number) {
    this.#secondsTotal = Math.max(0, seconds);
    this.#secondsLeft = this.#secondsTotal;
  }

  /**
   * How many seconds has left until the timer ends.
   */
  get left(): number {
    return this.#secondsLeft;
  }

  get progress(): number {
    return this.#secondsTotal > 0
      ? 1 - this.#secondsLeft / this.#secondsTotal
      : 1;
  }

  get hasFinished(): boolean {
    return this.#secondsLeft <= 0 || this.#secondsTotal <= 0;
  }

  update(secondsPassed: number): void {
    this.#secondsLeft = Math.max(0, this.#secondsLeft - secondsPassed);
    if (this.#secondsLeft <= Timer.#zeroThreshold) {
      this.#secondsLeft = 0;
    }
  }
}
