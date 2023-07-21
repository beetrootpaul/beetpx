import { PocTsBGFramework } from "../PocTsBGFramework";

export interface FpsLogger {
  track(fps: number): void;
}

export class FpsLoggerNoop implements FpsLogger {
  track(_fps: number): void {}
}

export class FpsLoggerAverage implements FpsLogger {
  readonly #samples: number[] = Array.from({ length: 60 });
  #nextIndex: number = 0;

  // TODO: consider creation of a generic logger which could be used in a game in order to avoid spamming with `console.log`s every frame
  track(fps: number): void {
    this.#samples[this.#nextIndex++] = fps;
    this.#nextIndex = this.#nextIndex % this.#samples.length;
    if (this.#nextIndex === 0) {
      const s = this.#samples.reduce((sum, nextFps) => sum + nextFps, 0);
      const averageFps = Math.floor(s / this.#samples.length);
      console.info("FPS: ", averageFps);
      PocTsBGFramework.averageFps = averageFps;
    }
  }
}

// TODO: expose FPS to the game so it can print it on screen if needed
