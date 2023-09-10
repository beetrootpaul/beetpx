export class Timer {
  readonly #frames: number;

  #t: number;

  constructor(params: { frames: number }) {
    this.#frames = Math.floor(params.frames);
    this.#t = Math.max(0, this.#frames);
  }

  get framesLeft(): number {
    return this.#t;
  }

  get progress(): number {
    return this.#frames > 0 ? 1 - this.#t / this.#frames : 1;
  }

  get hasFinished(): boolean {
    return this.#t <= 0 || this.#frames <= 0;
  }

  update(): void {
    this.#t = Math.max(0, this.#t - 1);
  }

  // TODO: cover with tests
  restart(): void {
    this.#t = Math.max(0, this.#frames);
  }
}
