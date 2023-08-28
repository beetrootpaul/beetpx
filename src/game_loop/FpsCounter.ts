// TODO: cover this with tests
export class FpsCounter {
  readonly #samples: number[];
  #nextSampleIndex: number = 0;
  #millisTotal: number = 0;

  constructor(params: { historySize: number }) {
    this.#samples = Array.from({ length: params.historySize }, () => 0);
  }

  get averageFps(): number {
    return Math.floor(this.#samples.length * (1000 / (this.#millisTotal || 1)));
  }

  track(deltaTime: number): void {
    this.#millisTotal -= this.#samples[this.#nextSampleIndex]!;
    this.#samples[this.#nextSampleIndex] = deltaTime;
    this.#millisTotal += deltaTime;
    this.#nextSampleIndex = (this.#nextSampleIndex + 1) % this.#samples.length;
  }
}
