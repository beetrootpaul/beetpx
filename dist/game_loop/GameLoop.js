var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GameLoop_desiredFps, _GameLoop_adjustedFps, _GameLoop_requestAnimationFrameFn, _GameLoop_previousTimeMillis, _GameLoop_expectedTimeStepMillis, _GameLoop_safetyMaxTimeStep, _GameLoop_accumulatedTimeStepMillis, _GameLoop_accumulatedDeltaTimeMillis, _GameLoop_callbacks, _GameLoop_tick;
import { Logger } from "../logger/Logger";
import { FpsCounter } from "./FpsCounter";
// TODO: consider aggregating a total time from the very beginning and then adjusting FPS to match it in order to sync with audio
// TODO: consider using `requestIdleCallback` (not supported by Safari yet) as described in https://www.clicktorelease.com/blog/calculating-fps-with-requestIdleCallback/
export class GameLoop {
    constructor(options) {
        _GameLoop_desiredFps.set(this, void 0);
        _GameLoop_adjustedFps.set(this, void 0);
        _GameLoop_requestAnimationFrameFn.set(this, void 0);
        _GameLoop_previousTimeMillis.set(this, void 0);
        _GameLoop_expectedTimeStepMillis.set(this, void 0);
        _GameLoop_safetyMaxTimeStep.set(this, void 0);
        _GameLoop_accumulatedTimeStepMillis.set(this, void 0);
        _GameLoop_accumulatedDeltaTimeMillis.set(this, void 0);
        _GameLoop_callbacks.set(this, void 0);
        // TODO: rework all of this. The variety of time-related state is confusing.
        // Keep this function as an arrow one in order to avoid issues with `this`.
        _GameLoop_tick.set(this, (currentTimeMillis) => {
            var _a;
            // In the 1st frame, we don't have this.#previousTimeMillis yet, therefore we take
            //   currentTimeMillis and remove 1 to avoid delta time of 0 and FPS of Infinity:
            const deltaTimeMillis = currentTimeMillis - ((_a = __classPrivateFieldGet(this, _GameLoop_previousTimeMillis, "f")) !== null && _a !== void 0 ? _a : currentTimeMillis - 1);
            __classPrivateFieldSet(this, _GameLoop_accumulatedDeltaTimeMillis, __classPrivateFieldGet(this, _GameLoop_accumulatedDeltaTimeMillis, "f") + deltaTimeMillis, "f");
            // A safety net in case of a long time spent on another tab, letting delta accumulate a lot in this one:
            if (__classPrivateFieldGet(this, _GameLoop_accumulatedDeltaTimeMillis, "f") > __classPrivateFieldGet(this, _GameLoop_safetyMaxTimeStep, "f")) {
                Logger.warnBeetPx(`Accumulated delta time of ${__classPrivateFieldGet(this, _GameLoop_accumulatedDeltaTimeMillis, "f").toFixed(2)}ms was greater than safety max time step of ${__classPrivateFieldGet(this, _GameLoop_safetyMaxTimeStep, "f").toFixed(2)}ms.`);
                __classPrivateFieldSet(this, _GameLoop_accumulatedDeltaTimeMillis, __classPrivateFieldGet(this, _GameLoop_safetyMaxTimeStep, "f"), "f");
            }
            __classPrivateFieldSet(this, _GameLoop_previousTimeMillis, currentTimeMillis, "f");
            __classPrivateFieldSet(this, _GameLoop_accumulatedTimeStepMillis, __classPrivateFieldGet(this, _GameLoop_accumulatedTimeStepMillis, "f") + deltaTimeMillis, "f");
            // A safety net in case of a long time spent on another tab, letting delta accumulate a lot in this one:
            if (__classPrivateFieldGet(this, _GameLoop_accumulatedTimeStepMillis, "f") > __classPrivateFieldGet(this, _GameLoop_safetyMaxTimeStep, "f")) {
                Logger.warnBeetPx(`Accumulated time step of ${__classPrivateFieldGet(this, _GameLoop_accumulatedTimeStepMillis, "f").toFixed(2)}ms was greater than safety max time step of ${__classPrivateFieldGet(this, _GameLoop_safetyMaxTimeStep, "f").toFixed(2)}ms.`);
                __classPrivateFieldSet(this, _GameLoop_accumulatedTimeStepMillis, __classPrivateFieldGet(this, _GameLoop_safetyMaxTimeStep, "f"), "f");
            }
            if (__classPrivateFieldGet(this, _GameLoop_accumulatedTimeStepMillis, "f") >= __classPrivateFieldGet(this, _GameLoop_expectedTimeStepMillis, "f")) {
                const actualFps = 1000 / __classPrivateFieldGet(this, _GameLoop_accumulatedTimeStepMillis, "f");
                this.fpsCounter.track(actualFps);
                if (actualFps > __classPrivateFieldGet(this, _GameLoop_desiredFps, "f") * 1.1 &&
                    __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f") > __classPrivateFieldGet(this, _GameLoop_desiredFps, "f") / 2) {
                    __classPrivateFieldSet(this, _GameLoop_adjustedFps, __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f") - 1, "f");
                    __classPrivateFieldSet(this, _GameLoop_expectedTimeStepMillis, 1000 / __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f"), "f");
                }
                else if (actualFps < __classPrivateFieldGet(this, _GameLoop_desiredFps, "f") / 1.1 &&
                    __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f") < __classPrivateFieldGet(this, _GameLoop_desiredFps, "f") * 2) {
                    __classPrivateFieldSet(this, _GameLoop_adjustedFps, __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f") + 1, "f");
                    __classPrivateFieldSet(this, _GameLoop_expectedTimeStepMillis, 1000 / __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f"), "f");
                }
            }
            const numberOfUpdates = Math.floor(__classPrivateFieldGet(this, _GameLoop_accumulatedTimeStepMillis, "f") / __classPrivateFieldGet(this, _GameLoop_expectedTimeStepMillis, "f"));
            if (numberOfUpdates > 0) {
                const dt = __classPrivateFieldGet(this, _GameLoop_accumulatedDeltaTimeMillis, "f") / numberOfUpdates;
                Logger.debugBeetPx(`dt: ${__classPrivateFieldGet(this, _GameLoop_accumulatedDeltaTimeMillis, "f").toFixed(0)}ms${numberOfUpdates > 1
                    ? ` (to be split across ${numberOfUpdates} updates)`
                    : ""}`);
                for (let updateIndex = 0; updateIndex < numberOfUpdates; updateIndex++) {
                    __classPrivateFieldGet(this, _GameLoop_callbacks, "f").updateFn(this.fpsCounter.averageFps, dt);
                    __classPrivateFieldSet(this, _GameLoop_accumulatedTimeStepMillis, __classPrivateFieldGet(this, _GameLoop_accumulatedTimeStepMillis, "f") - __classPrivateFieldGet(this, _GameLoop_expectedTimeStepMillis, "f"), "f");
                }
                __classPrivateFieldSet(this, _GameLoop_accumulatedDeltaTimeMillis, 0, "f");
            }
            __classPrivateFieldGet(this, _GameLoop_callbacks, "f").renderFn();
            __classPrivateFieldGet(this, _GameLoop_requestAnimationFrameFn, "f").call(this, __classPrivateFieldGet(this, _GameLoop_tick, "f"));
        });
        __classPrivateFieldSet(this, _GameLoop_desiredFps, options.desiredFps, "f");
        __classPrivateFieldSet(this, _GameLoop_adjustedFps, options.desiredFps, "f");
        __classPrivateFieldSet(this, _GameLoop_requestAnimationFrameFn, options.requestAnimationFrameFn, "f");
        this.fpsCounter = new FpsCounter({ bufferSize: 3 * __classPrivateFieldGet(this, _GameLoop_desiredFps, "f") });
        __classPrivateFieldSet(this, _GameLoop_expectedTimeStepMillis, 1000 / __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f"), "f");
        __classPrivateFieldSet(this, _GameLoop_safetyMaxTimeStep, 5 * __classPrivateFieldGet(this, _GameLoop_expectedTimeStepMillis, "f"), "f");
        __classPrivateFieldSet(this, _GameLoop_accumulatedTimeStepMillis, __classPrivateFieldGet(this, _GameLoop_expectedTimeStepMillis, "f"), "f");
        __classPrivateFieldSet(this, _GameLoop_accumulatedDeltaTimeMillis, 0, "f");
        __classPrivateFieldSet(this, _GameLoop_callbacks, {
            updateFn: () => { },
            renderFn: () => { },
        }, "f");
    }
    start(callbacks) {
        __classPrivateFieldSet(this, _GameLoop_callbacks, callbacks, "f");
        __classPrivateFieldSet(this, _GameLoop_accumulatedDeltaTimeMillis, 0, "f");
        __classPrivateFieldGet(this, _GameLoop_requestAnimationFrameFn, "f").call(this, __classPrivateFieldGet(this, _GameLoop_tick, "f"));
    }
}
_GameLoop_desiredFps = new WeakMap(), _GameLoop_adjustedFps = new WeakMap(), _GameLoop_requestAnimationFrameFn = new WeakMap(), _GameLoop_previousTimeMillis = new WeakMap(), _GameLoop_expectedTimeStepMillis = new WeakMap(), _GameLoop_safetyMaxTimeStep = new WeakMap(), _GameLoop_accumulatedTimeStepMillis = new WeakMap(), _GameLoop_accumulatedDeltaTimeMillis = new WeakMap(), _GameLoop_callbacks = new WeakMap(), _GameLoop_tick = new WeakMap();
