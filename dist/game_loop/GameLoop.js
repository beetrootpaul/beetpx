var _a;
import { Logger } from "../logger/Logger";
export class GameLoop {
    static renderFpsResultCap = 999;
    #requestAnimationFrameFn;
    #documentVisibilityStateProvider;
    #callbacks = {
        updateFn: () => { },
        renderFn: () => { },
    };
    #expectedTimeStepMillis;
    #previousTimeMillis;
    #accumulatedDeltaTimeMillis = 0;
    #updateCallsCounter = 0;
    #updateCallsLimit = 5;
    constructor(options) {
        this.#requestAnimationFrameFn = options.rafFn;
        this.#documentVisibilityStateProvider =
            options.documentVisibilityStateProvider;
        this.#expectedTimeStepMillis = 1000 / options.fixedTimestepFps;
    }
    start(callbacks) {
        this.#callbacks.updateFn = callbacks.updateFn;
        this.#callbacks.renderFn = callbacks.renderFn;
        this.#previousTimeMillis = undefined;
        this.#accumulatedDeltaTimeMillis = 0;
        this.#requestAnimationFrameFn(this.#tick);
    }
    
    #tick = (currentTimeMillis) => {
        if (this.#documentVisibilityStateProvider.visibilityState === "hidden") {
            this.#previousTimeMillis = currentTimeMillis;
            this.#requestAnimationFrameFn(this.#tick);
            return;
        }
        const deltaTimeMillis = currentTimeMillis - (this.#previousTimeMillis ?? currentTimeMillis);
        this.#accumulatedDeltaTimeMillis += deltaTimeMillis;
        this.#previousTimeMillis = currentTimeMillis;
        this.#updateCallsCounter = 0;
        while (this.#accumulatedDeltaTimeMillis >= this.#expectedTimeStepMillis) {
            this.#updateCallsCounter += 1;
            if (this.#updateCallsCounter <= this.#updateCallsLimit) {
                this.#callbacks.updateFn();
                this.#accumulatedDeltaTimeMillis -= this.#expectedTimeStepMillis;
            }
            else {
                this.#accumulatedDeltaTimeMillis = 0;
                Logger.warnBeetPx(`Reached the safety limit of ${this.#updateCallsLimit} update calls`);
            }
        }
        const renderingFps = Math.floor(Math.min(1000 / deltaTimeMillis, _a.renderFpsResultCap));
        this.#callbacks.renderFn(renderingFps);
        this.#requestAnimationFrameFn(this.#tick);
    };
}
_a = GameLoop;
