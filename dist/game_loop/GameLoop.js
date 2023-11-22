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
var _a, _GameLoop_requestAnimationFrameFn, _GameLoop_documentVisibilityStateProvider, _GameLoop_callbacks, _GameLoop_expectedTimeStepMillis, _GameLoop_previousTimeMillis, _GameLoop_accumulatedDeltaTimeMillis, _GameLoop_updateCallsCounter, _GameLoop_updateCallsLimit, _GameLoop_tick;
import { Logger } from "../logger/Logger";
export class GameLoop {
    constructor(options) {
        _GameLoop_requestAnimationFrameFn.set(this, void 0);
        _GameLoop_documentVisibilityStateProvider.set(this, void 0);
        _GameLoop_callbacks.set(this, {
            updateFn: () => { },
            renderFn: () => { },
        });
        _GameLoop_expectedTimeStepMillis.set(this, void 0);
        _GameLoop_previousTimeMillis.set(this, void 0);
        _GameLoop_accumulatedDeltaTimeMillis.set(this, 0);
        _GameLoop_updateCallsCounter.set(this, 0);
        _GameLoop_updateCallsLimit.set(this, 5);
        
        _GameLoop_tick.set(this, (currentTimeMillis) => {
            if (__classPrivateFieldGet(this, _GameLoop_documentVisibilityStateProvider, "f").visibilityState === "hidden") {
                __classPrivateFieldSet(this, _GameLoop_previousTimeMillis, currentTimeMillis, "f");
                __classPrivateFieldGet(this, _GameLoop_requestAnimationFrameFn, "f").call(this, __classPrivateFieldGet(this, _GameLoop_tick, "f"));
                return;
            }
            const deltaTimeMillis = currentTimeMillis - (__classPrivateFieldGet(this, _GameLoop_previousTimeMillis, "f") ?? currentTimeMillis);
            __classPrivateFieldSet(this, _GameLoop_accumulatedDeltaTimeMillis, __classPrivateFieldGet(this, _GameLoop_accumulatedDeltaTimeMillis, "f") + deltaTimeMillis, "f");
            __classPrivateFieldSet(this, _GameLoop_previousTimeMillis, currentTimeMillis, "f");
            __classPrivateFieldSet(this, _GameLoop_updateCallsCounter, 0, "f");
            while (__classPrivateFieldGet(this, _GameLoop_accumulatedDeltaTimeMillis, "f") >= __classPrivateFieldGet(this, _GameLoop_expectedTimeStepMillis, "f")) {
                __classPrivateFieldSet(this, _GameLoop_updateCallsCounter, __classPrivateFieldGet(this, _GameLoop_updateCallsCounter, "f") + 1, "f");
                if (__classPrivateFieldGet(this, _GameLoop_updateCallsCounter, "f") <= __classPrivateFieldGet(this, _GameLoop_updateCallsLimit, "f")) {
                    __classPrivateFieldGet(this, _GameLoop_callbacks, "f").updateFn();
                    __classPrivateFieldSet(this, _GameLoop_accumulatedDeltaTimeMillis, __classPrivateFieldGet(this, _GameLoop_accumulatedDeltaTimeMillis, "f") - __classPrivateFieldGet(this, _GameLoop_expectedTimeStepMillis, "f"), "f");
                }
                else {
                    __classPrivateFieldSet(this, _GameLoop_accumulatedDeltaTimeMillis, 0, "f");
                    Logger.warnBeetPx(`Reached the safety limit of ${__classPrivateFieldGet(this, _GameLoop_updateCallsLimit, "f")} update calls`);
                }
            }
            const renderFps = Math.floor(Math.min(1000 / deltaTimeMillis, _a.renderFpsResultCap));
            __classPrivateFieldGet(this, _GameLoop_callbacks, "f").renderFn(renderFps);
            __classPrivateFieldGet(this, _GameLoop_requestAnimationFrameFn, "f").call(this, __classPrivateFieldGet(this, _GameLoop_tick, "f"));
        });
        __classPrivateFieldSet(this, _GameLoop_requestAnimationFrameFn, options.rafFn, "f");
        __classPrivateFieldSet(this, _GameLoop_documentVisibilityStateProvider, options.documentVisibilityStateProvider, "f");
        __classPrivateFieldSet(this, _GameLoop_expectedTimeStepMillis, 1000 / options.desiredUpdateFps, "f");
    }
    start(callbacks) {
        __classPrivateFieldGet(this, _GameLoop_callbacks, "f").updateFn = callbacks.updateFn;
        __classPrivateFieldGet(this, _GameLoop_callbacks, "f").renderFn = callbacks.renderFn;
        __classPrivateFieldSet(this, _GameLoop_previousTimeMillis, undefined, "f");
        __classPrivateFieldSet(this, _GameLoop_accumulatedDeltaTimeMillis, 0, "f");
        __classPrivateFieldGet(this, _GameLoop_requestAnimationFrameFn, "f").call(this, __classPrivateFieldGet(this, _GameLoop_tick, "f"));
    }
}
_a = GameLoop, _GameLoop_requestAnimationFrameFn = new WeakMap(), _GameLoop_documentVisibilityStateProvider = new WeakMap(), _GameLoop_callbacks = new WeakMap(), _GameLoop_expectedTimeStepMillis = new WeakMap(), _GameLoop_previousTimeMillis = new WeakMap(), _GameLoop_accumulatedDeltaTimeMillis = new WeakMap(), _GameLoop_updateCallsCounter = new WeakMap(), _GameLoop_updateCallsLimit = new WeakMap(), _GameLoop_tick = new WeakMap();
GameLoop.renderFpsResultCap = 999;
