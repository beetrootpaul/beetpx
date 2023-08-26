export interface FpsLogger {
  get mostRecentAverageFps(): number;

  track(fps: number): void;
}

export class FpsLoggerNoop implements FpsLogger {
  // TODO: rework to *always* count average FPS and only decided whether to *log* it to the console.
  //       Probably there will be no need for FpsLoggerNoop vs FpsLoggerAverage.
  //       Or maybe even just make logging dependent on *debug* flag.
  get mostRecentAverageFps(): number {
    return 1;
  }

  track(_fps: number): void {}
}

// TODO: does it even still work?
export class FpsLoggerAverage implements FpsLogger {
  readonly #samples: number[] = Array.from({ length: 60 });
  #nextIndex: number = 0;
  #averageFps = 1;

  get mostRecentAverageFps(): number {
    return this.#averageFps;
  }

  // TODO: consider creation of a generic logger which could be used in a game in order to avoid spamming with `console.log`s every frame
  track(fps: number): void {
    this.#samples[this.#nextIndex++] = fps;
    this.#nextIndex = this.#nextIndex % this.#samples.length;
    if (this.#nextIndex === 0) {
      const s = this.#samples.reduce((sum, nextFps) => sum + nextFps, 0);
      this.#averageFps = Math.floor(s / this.#samples.length);
      // TODO: commenting this out for now, since it's pretty annoying to see constant logs in the console, especially since the game can log it by itself when needed
      // console.info("FPS: ", this.#averageFps);
    }
  }
}
