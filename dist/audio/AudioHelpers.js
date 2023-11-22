"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _AudioHelpers_tryNTimes;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioHelpers = void 0;
const Logger_1 = require("../logger/Logger");
const Utils_1 = require("../Utils");
class AudioHelpers {
    static muteGain(gainNode, audioContextCurrentTime, fadeOutMillis, onMuted = Utils_1.u_.noop) {
        fadeOutMillis = Math.max(0, fadeOutMillis);
        Logger_1.Logger.debugBeetPx(`AudioHelpers.muteGain (audioContextCurrentTime: ${audioContextCurrentTime}, fadeOutMillis: ${fadeOutMillis})`);
        __classPrivateFieldGet(_a, _a, "m", _AudioHelpers_tryNTimes).call(_a, 15, 100, () => {
            if (fadeOutMillis > 0) {
                gainNode.gain.setValueCurveAtTime([gainNode.gain.value, 0], audioContextCurrentTime, fadeOutMillis / 1000);
            }
            else {
                gainNode.gain.setValueAtTime(0, audioContextCurrentTime);
            }
        }).catch(() => { });
        setTimeout(() => {
            onMuted();
        }, fadeOutMillis);
    }
    static unmuteGain(gainNode, audioContextCurrentTime, fadeInMillis, onUnmuted = Utils_1.u_.noop) {
        fadeInMillis = Math.max(0, fadeInMillis);
        Logger_1.Logger.debugBeetPx(`AudioHelpers.unmuteGain (audioContextCurrentTime: ${audioContextCurrentTime}, fadeInMillis: ${fadeInMillis})`);
        __classPrivateFieldGet(_a, _a, "m", _AudioHelpers_tryNTimes).call(_a, 15, 100, () => {
            if (fadeInMillis > 0) {
                gainNode.gain.setValueCurveAtTime([gainNode.gain.value, 1], audioContextCurrentTime, fadeInMillis / 1000);
            }
            else {
                gainNode.gain.setValueAtTime(1, audioContextCurrentTime);
            }
        }).catch((err) => { });
        setTimeout(() => {
            onUnmuted();
        }, fadeInMillis);
    }
}
exports.AudioHelpers = AudioHelpers;
_a = AudioHelpers, _AudioHelpers_tryNTimes = async function _AudioHelpers_tryNTimes(n, millisBetweenTrials, action) {
    if (n <= 0) {
        Logger_1.Logger.warnBeetPx(`AudioHelpers.#tryNTimes: Failed to perform the action in N trials.`);
        return Promise.reject();
    }
    try {
        action();
    }
    catch (err) {
        Logger_1.Logger.debugBeetPx(`AudioHelpers.#tryNTimes: err:`, err);
        return new Promise((resolve, reject) => {
            Logger_1.Logger.debugBeetPx(`AudioHelpers.#tryNTimes: Failed to perform the action, trying ${n} more times…`);
            setTimeout(() => {
                __classPrivateFieldGet(this, _a, "m", _AudioHelpers_tryNTimes).call(this, n - 1, millisBetweenTrials, action).then(resolve, reject);
            }, millisBetweenTrials);
        });
    }
};
