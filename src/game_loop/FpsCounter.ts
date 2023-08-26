export class FpsCounter {
  static readonly #fallbackFps = 1;

  readonly #samples: number[];
  #nextIndex: number;
  #averageFps: number;

  constructor(params: { bufferSize: number }) {
    this.#samples = Array.from(
      { length: params.bufferSize },
      () => FpsCounter.#fallbackFps,
    );
    this.#nextIndex = 0;
    this.#averageFps = FpsCounter.#fallbackFps;
  }

  get averageFps(): number {
    return this.#averageFps;
  }

  track(fps: number): void {
    this.#samples[this.#nextIndex++] = fps;
    this.#nextIndex = this.#nextIndex % this.#samples.length;

    this.#averageFps = Math.floor(
      this.#samples.reduce((sum, nextSample) => sum + nextSample, 0) /
        this.#samples.length,
    );
  }
}
