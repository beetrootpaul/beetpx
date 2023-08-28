import { Logger } from "../logger/Logger";
import { FpsCounter } from "./FpsCounter";

export type GameLoopCallbacks = {
  updateFn: () => void;
  renderFn: (renderFps: number) => void;
};

type GameLoopOptions = {
  desiredUpdateFps: number;
  requestAnimationFrameFn: AnimationFrameProvider["requestAnimationFrame"];
  documentVisibilityStateProvider: { visibilityState: DocumentVisibilityState };
};

export class GameLoop {
  readonly #requestAnimationFrameFn: AnimationFrameProvider["requestAnimationFrame"];
  readonly #documentVisibilityStateProvider: {
    visibilityState: DocumentVisibilityState;
  };

  readonly #callbacks: GameLoopCallbacks = {
    updateFn: () => {},
    renderFn: () => {},
  };

  readonly #expectedTimeStepMillis: number;
  #previousTimeMillis?: DOMHighResTimeStamp;
  #accumulatedDeltaTimeMillis: number = 0;

  #updateCallsCounter: number = 0;
  readonly #updateCallsLimit: number = 5;

  // TODO: REMOVE?
  readonly fpsCounter: FpsCounter;

  constructor(options: GameLoopOptions) {
    this.#requestAnimationFrameFn = options.requestAnimationFrameFn;
    this.#documentVisibilityStateProvider =
      options.documentVisibilityStateProvider;

    this.#expectedTimeStepMillis = 1000 / options.desiredUpdateFps;

    this.fpsCounter = new FpsCounter({
      historySize: options.desiredUpdateFps,
    });
  }

  start(callbacks: GameLoopCallbacks): void {
    this.#callbacks.updateFn = callbacks.updateFn;
    this.#callbacks.renderFn = callbacks.renderFn;

    this.#previousTimeMillis = undefined;
    this.#accumulatedDeltaTimeMillis = 0;

    this.#requestAnimationFrameFn(this.#tick);
  }

  // Keep this function as an arrow one in order to avoid issues with `this`.
  #tick = (currentTimeMillis: DOMHighResTimeStamp): void => {
    if (this.#documentVisibilityStateProvider.visibilityState === "hidden") {
      this.#previousTimeMillis = currentTimeMillis;
      this.#requestAnimationFrameFn(this.#tick);
      return;
    }

    const deltaTimeMillis =
      currentTimeMillis - (this.#previousTimeMillis ?? currentTimeMillis);
    this.#accumulatedDeltaTimeMillis += deltaTimeMillis;
    this.#previousTimeMillis = currentTimeMillis;

    this.fpsCounter.track(deltaTimeMillis);

    this.#updateCallsCounter = 0;
    while (this.#accumulatedDeltaTimeMillis >= this.#expectedTimeStepMillis) {
      this.#updateCallsCounter += 1;
      if (this.#updateCallsCounter <= this.#updateCallsLimit) {
        this.#callbacks.updateFn();
        this.#accumulatedDeltaTimeMillis -= this.#expectedTimeStepMillis;
      } else {
        Logger.warnBeetPx(
          `Reached the safety limit of ${this.#updateCallsLimit} update calls`,
        );
        this.#accumulatedDeltaTimeMillis = 0;
      }
    }

    const renderFps = Math.floor(Math.min(1000 / deltaTimeMillis, 999));
    this.#callbacks.renderFn(renderFps);

    this.#requestAnimationFrameFn(this.#tick);
  };
}
