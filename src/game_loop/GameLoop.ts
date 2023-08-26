import { Logger } from "../logger/Logger";
import { FpsCounter } from "./FpsCounter";

export type GameLoopCallbacks = {
  updateFn: (averageFps: number, deltaMillis: DOMHighResTimeStamp) => void;
  renderFn: () => void;
};

type GameLoopOptions = {
  desiredFps: number;
  logActualFps?: boolean;
  requestAnimationFrameFn: AnimationFrameProvider["requestAnimationFrame"];
};

// TODO: consider aggregating a total time from the very beginning and then adjusting FPS to match it in order to sync with audio

// TODO: consider using `requestIdleCallback` (not supported by Safari yet) as described in https://www.clicktorelease.com/blog/calculating-fps-with-requestIdleCallback/

export class GameLoop {
  readonly #desiredFps: number;
  #adjustedFps: number;

  readonly #requestAnimationFrameFn: AnimationFrameProvider["requestAnimationFrame"];

  readonly fpsCounter: FpsCounter;

  #previousTimeMillis?: DOMHighResTimeStamp;
  #expectedTimeStepMillis: number;
  readonly #safetyMaxTimeStep: number;
  #accumulatedTimeStepMillis: number;

  #accumulatedDeltaTimeMillis: number;

  #callbacks: GameLoopCallbacks;

  constructor(options: GameLoopOptions) {
    this.#desiredFps = options.desiredFps;
    this.#adjustedFps = options.desiredFps;
    this.#requestAnimationFrameFn = options.requestAnimationFrameFn;

    this.fpsCounter = new FpsCounter({ bufferSize: 3 * this.#desiredFps });

    this.#expectedTimeStepMillis = 1000 / this.#adjustedFps;
    this.#safetyMaxTimeStep = 5 * this.#expectedTimeStepMillis;
    this.#accumulatedTimeStepMillis = this.#expectedTimeStepMillis;

    this.#accumulatedDeltaTimeMillis = 0;

    this.#callbacks = {
      updateFn: () => {},
      renderFn: () => {},
    };
  }

  start(callbacks: GameLoopCallbacks): void {
    this.#callbacks = callbacks;

    this.#accumulatedDeltaTimeMillis = 0;
    this.#requestAnimationFrameFn(this.#tick);
  }

  // TODO: rework all of this. The variety of time-related state is confusing.
  // Keep this function as an arrow one in order to avoid issues with `this`.
  #tick = (currentTimeMillis: DOMHighResTimeStamp): void => {
    // In the 1st frame, we don't have this.#previousTimeMillis yet, therefore we take
    //   currentTimeMillis and remove 1 to avoid delta time of 0 and FPS of Infinity:
    const deltaTimeMillis =
      currentTimeMillis - (this.#previousTimeMillis ?? currentTimeMillis - 1);

    this.#accumulatedDeltaTimeMillis += deltaTimeMillis;
    // A safety net in case of a long time spent on another tab, letting delta accumulate a lot in this one:
    if (this.#accumulatedDeltaTimeMillis > this.#safetyMaxTimeStep) {
      Logger.warnBeetPx(
        `Accumulated delta time of ${this.#accumulatedDeltaTimeMillis.toFixed(
          2,
        )}ms was greater than safety max time step of ${this.#safetyMaxTimeStep.toFixed(
          2,
        )}ms.`,
      );
      this.#accumulatedDeltaTimeMillis = this.#safetyMaxTimeStep;
    }

    this.#previousTimeMillis = currentTimeMillis;
    this.#accumulatedTimeStepMillis += deltaTimeMillis;
    // A safety net in case of a long time spent on another tab, letting delta accumulate a lot in this one:
    if (this.#accumulatedTimeStepMillis > this.#safetyMaxTimeStep) {
      Logger.warnBeetPx(
        `Accumulated time step of ${this.#accumulatedTimeStepMillis.toFixed(
          2,
        )}ms was greater than safety max time step of ${this.#safetyMaxTimeStep.toFixed(
          2,
        )}ms.`,
      );
      this.#accumulatedTimeStepMillis = this.#safetyMaxTimeStep;
    }

    if (this.#accumulatedTimeStepMillis >= this.#expectedTimeStepMillis) {
      const actualFps = 1000 / this.#accumulatedTimeStepMillis;
      this.fpsCounter.track(actualFps);

      if (
        actualFps > this.#desiredFps * 1.1 &&
        this.#adjustedFps > this.#desiredFps / 2
      ) {
        this.#adjustedFps -= 1;
        this.#expectedTimeStepMillis = 1000 / this.#adjustedFps;
      } else if (
        actualFps < this.#desiredFps / 1.1 &&
        this.#adjustedFps < this.#desiredFps * 2
      ) {
        this.#adjustedFps += 1;
        this.#expectedTimeStepMillis = 1000 / this.#adjustedFps;
      }
    }

    const numberOfUpdates = Math.floor(
      this.#accumulatedTimeStepMillis / this.#expectedTimeStepMillis,
    );
    if (numberOfUpdates > 0) {
      const dt = this.#accumulatedDeltaTimeMillis / numberOfUpdates;
      Logger.debugBeetPx(
        `dt: ${this.#accumulatedDeltaTimeMillis.toFixed(0)}ms${
          numberOfUpdates > 1
            ? ` (to be split across ${numberOfUpdates} updates)`
            : ""
        }`,
      );
      for (let updateIndex = 0; updateIndex < numberOfUpdates; updateIndex++) {
        this.#callbacks.updateFn(this.fpsCounter.averageFps, dt);
        this.#accumulatedTimeStepMillis -= this.#expectedTimeStepMillis;
      }
      this.#accumulatedDeltaTimeMillis = 0;
    }

    this.#callbacks.renderFn();

    this.#requestAnimationFrameFn(this.#tick);
  };
}
