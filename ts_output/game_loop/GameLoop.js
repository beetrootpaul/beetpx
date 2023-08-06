"use strict";
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
var _GameLoop_desiredFps, _GameLoop_adjustedFps, _GameLoop_requestAnimationFrameFn, _GameLoop_fpsLogger, _GameLoop_previousTime, _GameLoop_expectedTimeStep, _GameLoop_safetyMaxTimeStep, _GameLoop_accumulatedTimeStep, _GameLoop_frameNumber, _GameLoop_callbacks, _GameLoop_tick;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLoop = void 0;
const BeetPx_1 = require("../BeetPx");
const FpsLogger_1 = require("./FpsLogger");
// TODO: consider aggregating a total time from the very beginning and then adjusting FPS to match it in order to sync with audio
class GameLoop {
    constructor(options) {
        _GameLoop_desiredFps.set(this, void 0);
        _GameLoop_adjustedFps.set(this, void 0);
        _GameLoop_requestAnimationFrameFn.set(this, void 0);
        _GameLoop_fpsLogger.set(this, void 0);
        _GameLoop_previousTime.set(this, void 0);
        _GameLoop_expectedTimeStep.set(this, void 0);
        _GameLoop_safetyMaxTimeStep.set(this, void 0);
        _GameLoop_accumulatedTimeStep.set(this, void 0);
        _GameLoop_frameNumber.set(this, void 0);
        _GameLoop_callbacks.set(this, void 0);
        // Keep this function as an arrow one in order to avoid issues with `this`.
        _GameLoop_tick.set(this, (currentTime) => {
            // In the 1st frame, we don't have this.#previousTime yet, therefore we take currentTime
            //   and remove 1 to avoid delta time of 0 and FPS of Infinity:
            const deltaTime = currentTime - (__classPrivateFieldGet(this, _GameLoop_previousTime, "f") ?? currentTime - 1);
            __classPrivateFieldSet(this, _GameLoop_previousTime, currentTime, "f");
            __classPrivateFieldSet(this, _GameLoop_accumulatedTimeStep, __classPrivateFieldGet(this, _GameLoop_accumulatedTimeStep, "f") + deltaTime, "f");
            // A safety net in case of a long time spent on another tab, letting delta accumulate a lot in this one:
            if (__classPrivateFieldGet(this, _GameLoop_accumulatedTimeStep, "f") > __classPrivateFieldGet(this, _GameLoop_safetyMaxTimeStep, "f")) {
                if (BeetPx_1.BeetPx.debug) {
                    console.debug(`Accumulated time step of ${__classPrivateFieldGet(this, _GameLoop_accumulatedTimeStep, "f")} was greater than safety max time step of ${__classPrivateFieldGet(this, _GameLoop_safetyMaxTimeStep, "f")}.`);
                }
                __classPrivateFieldSet(this, _GameLoop_accumulatedTimeStep, __classPrivateFieldGet(this, _GameLoop_safetyMaxTimeStep, "f"), "f");
            }
            if (__classPrivateFieldGet(this, _GameLoop_accumulatedTimeStep, "f") >= __classPrivateFieldGet(this, _GameLoop_expectedTimeStep, "f")) {
                const actualFps = 1000 / __classPrivateFieldGet(this, _GameLoop_accumulatedTimeStep, "f");
                __classPrivateFieldGet(this, _GameLoop_fpsLogger, "f").track(actualFps);
                // TODO: make sure console.debug are not spammed on prod build
                if (actualFps > __classPrivateFieldGet(this, _GameLoop_desiredFps, "f") * 1.1 &&
                    __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f") > __classPrivateFieldGet(this, _GameLoop_desiredFps, "f") / 2) {
                    __classPrivateFieldSet(this, _GameLoop_adjustedFps, __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f") - 1, "f");
                    __classPrivateFieldSet(this, _GameLoop_expectedTimeStep, 1000 / __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f"), "f");
                    // TODO: commenting this out for now, since it's pretty annoying to see constant logs in the console
                    // if (BeetPx.debug) {
                    //   console.debug(
                    //     `Decreasing the adjusted FPS by 1. New = ${this.#adjustedFps}`,
                    //   );
                    // }
                }
                else if (actualFps < __classPrivateFieldGet(this, _GameLoop_desiredFps, "f") / 1.1 &&
                    __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f") < __classPrivateFieldGet(this, _GameLoop_desiredFps, "f") * 2) {
                    __classPrivateFieldSet(this, _GameLoop_adjustedFps, __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f") + 1, "f");
                    __classPrivateFieldSet(this, _GameLoop_expectedTimeStep, 1000 / __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f"), "f");
                    // TODO: commenting this out for now, since it's pretty annoying to see constant logs in the console
                    // if (BeetPx.debug) {
                    //   console.debug(
                    //     `Increasing the adjusted FPS by 1. New = ${this.#adjustedFps}`,
                    //   );
                    // }
                }
            }
            while (__classPrivateFieldGet(this, _GameLoop_accumulatedTimeStep, "f") >= __classPrivateFieldGet(this, _GameLoop_expectedTimeStep, "f")) {
                __classPrivateFieldGet(this, _GameLoop_callbacks, "f").updateFn(__classPrivateFieldGet(this, _GameLoop_frameNumber, "f"), __classPrivateFieldGet(this, _GameLoop_fpsLogger, "f").mostRecentAverageFps);
                __classPrivateFieldSet(this, _GameLoop_frameNumber, __classPrivateFieldGet(this, _GameLoop_frameNumber, "f") == Number.MAX_SAFE_INTEGER
                    ? 0
                    : __classPrivateFieldGet(this, _GameLoop_frameNumber, "f") + 1, "f");
                __classPrivateFieldSet(this, _GameLoop_accumulatedTimeStep, __classPrivateFieldGet(this, _GameLoop_accumulatedTimeStep, "f") - __classPrivateFieldGet(this, _GameLoop_expectedTimeStep, "f"), "f");
            }
            __classPrivateFieldGet(this, _GameLoop_callbacks, "f").renderFn();
            __classPrivateFieldGet(this, _GameLoop_requestAnimationFrameFn, "f").call(this, __classPrivateFieldGet(this, _GameLoop_tick, "f"));
        });
        __classPrivateFieldSet(this, _GameLoop_desiredFps, options.desiredFps, "f");
        __classPrivateFieldSet(this, _GameLoop_adjustedFps, options.desiredFps, "f");
        __classPrivateFieldSet(this, _GameLoop_requestAnimationFrameFn, options.requestAnimationFrameFn, "f");
        __classPrivateFieldSet(this, _GameLoop_fpsLogger, options.logActualFps
            ? new FpsLogger_1.FpsLoggerAverage()
            : new FpsLogger_1.FpsLoggerNoop(), "f");
        __classPrivateFieldSet(this, _GameLoop_expectedTimeStep, 1000 / __classPrivateFieldGet(this, _GameLoop_adjustedFps, "f"), "f");
        __classPrivateFieldSet(this, _GameLoop_safetyMaxTimeStep, 5 * __classPrivateFieldGet(this, _GameLoop_expectedTimeStep, "f"), "f");
        __classPrivateFieldSet(this, _GameLoop_accumulatedTimeStep, __classPrivateFieldGet(this, _GameLoop_expectedTimeStep, "f"), "f");
        __classPrivateFieldSet(this, _GameLoop_frameNumber, 0, "f");
        __classPrivateFieldSet(this, _GameLoop_callbacks, {
            updateFn: () => { },
            renderFn: () => { },
        }, "f");
    }
    start(callbacks) {
        __classPrivateFieldSet(this, _GameLoop_callbacks, callbacks, "f");
        __classPrivateFieldGet(this, _GameLoop_requestAnimationFrameFn, "f").call(this, __classPrivateFieldGet(this, _GameLoop_tick, "f"));
    }
}
exports.GameLoop = GameLoop;
_GameLoop_desiredFps = new WeakMap(), _GameLoop_adjustedFps = new WeakMap(), _GameLoop_requestAnimationFrameFn = new WeakMap(), _GameLoop_fpsLogger = new WeakMap(), _GameLoop_previousTime = new WeakMap(), _GameLoop_expectedTimeStep = new WeakMap(), _GameLoop_safetyMaxTimeStep = new WeakMap(), _GameLoop_accumulatedTimeStep = new WeakMap(), _GameLoop_frameNumber = new WeakMap(), _GameLoop_callbacks = new WeakMap(), _GameLoop_tick = new WeakMap();
