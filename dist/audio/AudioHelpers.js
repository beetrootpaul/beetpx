var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _AudioHelpers_tryNTimes;
import { Logger } from "../logger/Logger";
import { u_ } from "../Utils";
export class AudioHelpers {
    static muteGain(gainNode, audioContextStartTime, fadeOutMillis, onMuted = u_.noop) {
        fadeOutMillis = Math.max(0, fadeOutMillis);
        __classPrivateFieldGet(AudioHelpers, _a, "m", _AudioHelpers_tryNTimes).call(AudioHelpers, 15, 100, () => {
            if (fadeOutMillis > 0) {
                gainNode.gain.setValueCurveAtTime([gainNode.gain.value, 0], audioContextStartTime / 1000, fadeOutMillis / 1000);
            }
            else {
                gainNode.gain.setValueAtTime(0, audioContextStartTime);
            }
        }).catch(() => { });
        setTimeout(() => {
            onMuted();
        }, fadeOutMillis);
    }
    static unmuteGain(gainNode, audioContextStartTime, fadeInMillis, onUnmuted = u_.noop) {
        fadeInMillis = Math.max(0, fadeInMillis);
        __classPrivateFieldGet(AudioHelpers, _a, "m", _AudioHelpers_tryNTimes).call(AudioHelpers, 15, 100, () => {
            if (fadeInMillis > 0) {
                gainNode.gain.setValueCurveAtTime([gainNode.gain.value, 1], audioContextStartTime / 1000, fadeInMillis / 1000);
            }
            else {
                gainNode.gain.setValueAtTime(1, audioContextStartTime);
            }
        }).catch((err) => { });
        setTimeout(() => {
            onUnmuted();
        }, fadeInMillis);
    }
}
_a = AudioHelpers, _AudioHelpers_tryNTimes = function _AudioHelpers_tryNTimes(n, millisBetweenTrials, action) {
    return __awaiter(this, void 0, void 0, function* () {
        if (n <= 0) {
            Logger.warnBeetPx(`AudioHelpers.#tryNTimes: Failed to perform the action in N trials.`);
            return Promise.reject();
        }
        try {
            action();
        }
        catch (err) {
            Logger.debugBeetPx(`AudioHelpers.#tryNTimes: err:`, err);
            return new Promise((resolve, reject) => {
                Logger.debugBeetPx(`AudioHelpers.#tryNTimes: Failed to perform the action, trying ${n} more times…`);
                setTimeout(() => {
                    __classPrivateFieldGet(this, _a, "m", _AudioHelpers_tryNTimes).call(this, n - 1, millisBetweenTrials, action).then(resolve, reject);
                }, millisBetweenTrials);
            });
        }
    });
};
