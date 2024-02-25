export function timer_(frames: number): BpxTimer {
  return BpxTimer.for({ frames });
}

export class BpxTimer {
  static for(params: { frames: number }): BpxTimer {
    return new BpxTimer(params);
  }

  readonly #frames: number;

  #t: number = 0;

  private constructor(params: { frames: number }) {
    this.#frames = Math.floor(params.frames);
    this.restart();
  }

  get framesLeft(): number {
    return Math.max(0, this.#t);
  }

  get progress(): number {
    return this.#frames > 0 ? 1 - this.framesLeft / this.#frames : 1;
  }

  get hasFinished(): boolean {
    return this.#t <= 0;
  }

  get hasJustFinished(): boolean {
    return this.#t == 0;
  }

  update(): void {
    this.#t = Math.max(-1, this.#t - 1);
  }

  restart(): void {
    this.#t = Math.max(0, this.#frames);
  }
}
