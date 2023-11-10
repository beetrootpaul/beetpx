var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _AudioApi_instances, _a, _AudioApi_storageMuteUnmuteKey, _AudioApi_storageMuteUnmuteTrue, _AudioApi_muteUnmuteDefaultFadeMillis, _AudioApi_assets, _AudioApi_audioContext, _AudioApi_globalGainNode, _AudioApi_pauseFadeNode, _AudioApi_playbacks, _AudioApi_isPaused, _AudioApi_isMuted, _AudioApi_loadStoredGlobalMuteUnmuteState, _AudioApi_storeGlobalMuteUnmuteState;
import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";
import { AudioHelpers } from "./AudioHelpers";
import { AudioPlaybackLooped } from "./AudioPlaybackLooped";
import { AudioPlaybackOnce } from "./AudioPlaybackOnce";
import { AudioPlaybackSequence } from "./AudioPlaybackSequence";
export class AudioApi {
    constructor(assets, audioContext) {
        _AudioApi_instances.add(this);
        _AudioApi_assets.set(this, void 0);
        _AudioApi_audioContext.set(this, void 0);
        _AudioApi_globalGainNode.set(this, void 0);
        _AudioApi_pauseFadeNode.set(this, void 0);
        _AudioApi_playbacks.set(this, new Map());
        _AudioApi_isPaused.set(this, false);
        _AudioApi_isMuted.set(this, void 0);
        __classPrivateFieldSet(this, _AudioApi_assets, assets, "f");
        __classPrivateFieldSet(this, _AudioApi_audioContext, audioContext, "f");
        __classPrivateFieldSet(this, _AudioApi_isMuted, __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_loadStoredGlobalMuteUnmuteState).call(this), "f");
        HtmlTemplate.updateMutedClass(__classPrivateFieldGet(this, _AudioApi_isMuted, "f"));
        __classPrivateFieldSet(this, _AudioApi_globalGainNode, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").createGain(), "f");
        __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").gain.value = __classPrivateFieldGet(this, _AudioApi_isMuted, "f") ? 0 : 1;
        __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").connect(__classPrivateFieldGet(this, _AudioApi_audioContext, "f").destination);
        __classPrivateFieldSet(this, _AudioApi_pauseFadeNode, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").createGain(), "f");
        __classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f").gain.value = 1;
        __classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f").connect(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"));
    }
    restart() {
        this.stopAllPlaybacks();
        __classPrivateFieldGet(this, _AudioApi_playbacks, "f").clear();
        // in case audio was paused
        __classPrivateFieldSet(this, _AudioApi_isPaused, false, "f");
        AudioHelpers.unmuteGain(__classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f"), __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, 0);
        __classPrivateFieldGet(this, _AudioApi_audioContext, "f").resume().catch((err) => {
            Logger.errorBeetPx(err);
        });
    }
    // In some browsers audio should start in result of user interaction (e.g. button click).
    // Since we cannot assure it for every game setup, let' expose a function which tries to
    // resume the AudioContext and call it on every user interaction detected by this framework.
    tryToResumeAudioContextSuspendedByBrowserForSecurityReasons() {
        return __awaiter(this, void 0, void 0, function* () {
            Logger.debugBeetPx("AudioApi.tryToResumeAudioContextSuspendedByBrowserForSecurityReasons");
            if (__classPrivateFieldGet(this, _AudioApi_audioContext, "f").state === "running") {
                Logger.debugBeetPx("Audio Context is already running");
                return Promise.resolve(true);
            }
            if (__classPrivateFieldGet(this, _AudioApi_isPaused, "f")) {
                Logger.debugBeetPx("Cannot detect if Audio Context requires resuming, because it is intentionally paused (suspended) right now");
                return Promise.resolve(false);
            }
            return __classPrivateFieldGet(this, _AudioApi_audioContext, "f")
                .resume()
                .then(() => {
                Logger.debugBeetPx("Audio Context got resumed");
                return true;
            })
                .catch((err) => {
                Logger.errorBeetPx(err);
                return false;
            });
        });
    }
    playSoundOnce(soundUrl, muteOnStart = false) {
        Logger.debugBeetPx(`AudioApi.playSoundOnce (muteOnStart: ${muteOnStart})`);
        const playback = new AudioPlaybackOnce(soundUrl, {
            assets: __classPrivateFieldGet(this, _AudioApi_assets, "f"),
            audioContext: __classPrivateFieldGet(this, _AudioApi_audioContext, "f"),
            target: __classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f"),
            muteOnStart,
            onEnded: () => {
                __classPrivateFieldGet(this, _AudioApi_playbacks, "f").delete(playback.id);
            },
        });
        __classPrivateFieldGet(this, _AudioApi_playbacks, "f").set(playback.id, playback);
        return playback.id;
    }
    playSoundLooped(soundUrl, muteOnStart = false) {
        Logger.debugBeetPx(`AudioApi.playSoundLooped (muteOnStart: ${muteOnStart})`);
        const playback = new AudioPlaybackLooped(soundUrl, {
            assets: __classPrivateFieldGet(this, _AudioApi_assets, "f"),
            audioContext: __classPrivateFieldGet(this, _AudioApi_audioContext, "f"),
            target: __classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f"),
            muteOnStart,
            onEnded: () => {
                __classPrivateFieldGet(this, _AudioApi_playbacks, "f").delete(playback.id);
            },
        });
        __classPrivateFieldGet(this, _AudioApi_playbacks, "f").set(playback.id, playback);
        return playback.id;
    }
    playSoundSequence(soundSequence, muteOnStart = false) {
        Logger.debugBeetPx(`AudioApi.playSoundSequence (muteOnStart: ${muteOnStart})`);
        const playback = new AudioPlaybackSequence(soundSequence, {
            assets: __classPrivateFieldGet(this, _AudioApi_assets, "f"),
            audioContext: __classPrivateFieldGet(this, _AudioApi_audioContext, "f"),
            target: __classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f"),
            muteOnStart,
            onEnded: () => {
                __classPrivateFieldGet(this, _AudioApi_playbacks, "f").delete(playback.id);
            },
        });
        __classPrivateFieldGet(this, _AudioApi_playbacks, "f").set(playback.id, playback);
        return playback.id;
    }
    isAudioMuted() {
        return __classPrivateFieldGet(this, _AudioApi_isMuted, "f");
    }
    muteAudio(opts = {}) {
        var _b;
        Logger.debugBeetPx(`AudioApi.muteAudio (fadeOutMillis: ${opts.fadeOutMillis})`);
        if (__classPrivateFieldGet(this, _AudioApi_isMuted, "f"))
            return;
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_storeGlobalMuteUnmuteState).call(this, true);
        __classPrivateFieldSet(this, _AudioApi_isMuted, true, "f");
        HtmlTemplate.updateMutedClass(__classPrivateFieldGet(this, _AudioApi_isMuted, "f"));
        AudioHelpers.muteGain(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"), __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(this, _AudioApi_isPaused, "f")
            ? 0
            : (_b = opts.fadeOutMillis) !== null && _b !== void 0 ? _b : __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis));
    }
    unmuteAudio(opts = {}) {
        var _b;
        Logger.debugBeetPx(`AudioApi.unmuteAudio (fadeInMillis: ${opts.fadeInMillis})`);
        if (!__classPrivateFieldGet(this, _AudioApi_isMuted, "f"))
            return;
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_storeGlobalMuteUnmuteState).call(this, false);
        __classPrivateFieldSet(this, _AudioApi_isMuted, false, "f");
        HtmlTemplate.updateMutedClass(__classPrivateFieldGet(this, _AudioApi_isMuted, "f"));
        AudioHelpers.unmuteGain(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"), __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(this, _AudioApi_isPaused, "f")
            ? 0
            : (_b = opts.fadeInMillis) !== null && _b !== void 0 ? _b : __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis));
    }
    mutePlayback(playbackId, opts = {}) {
        var _b, _c;
        Logger.debugBeetPx(`AudioApi.mutePlayback (fadeOutMillis: ${opts.fadeOutMillis})`);
        (_b = __classPrivateFieldGet(this, _AudioApi_playbacks, "f")
            .get(playbackId)) === null || _b === void 0 ? void 0 : _b.mute(__classPrivateFieldGet(this, _AudioApi_isPaused, "f")
            ? 0
            : (_c = opts.fadeOutMillis) !== null && _c !== void 0 ? _c : __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis));
    }
    unmutePlayback(playbackId, opts = {}) {
        var _b, _c;
        Logger.debugBeetPx(`AudioApi.unmutePlayback (fadeInMillis: ${opts.fadeInMillis})`);
        (_b = __classPrivateFieldGet(this, _AudioApi_playbacks, "f")
            .get(playbackId)) === null || _b === void 0 ? void 0 : _b.unmute(__classPrivateFieldGet(this, _AudioApi_isPaused, "f")
            ? 0
            : (_c = opts.fadeInMillis) !== null && _c !== void 0 ? _c : __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis));
    }
    pauseAudio() {
        Logger.debugBeetPx("AudioApi.pauseAudio");
        if (__classPrivateFieldGet(this, _AudioApi_isPaused, "f"))
            return;
        __classPrivateFieldSet(this, _AudioApi_isPaused, true, "f");
        AudioHelpers.muteGain(__classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f"), __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis), () => {
            __classPrivateFieldGet(this, _AudioApi_audioContext, "f").suspend().catch((err) => {
                Logger.errorBeetPx(err);
            });
        });
    }
    resumeAudio() {
        Logger.debugBeetPx("AudioApi.resumeAudio");
        if (!__classPrivateFieldGet(this, _AudioApi_isPaused, "f"))
            return;
        __classPrivateFieldSet(this, _AudioApi_isPaused, false, "f");
        __classPrivateFieldGet(this, _AudioApi_audioContext, "f")
            .resume()
            .then(() => {
            AudioHelpers.unmuteGain(__classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f"), __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis));
        })
            .catch((err) => {
            Logger.errorBeetPx(err);
        });
    }
    stopAllPlaybacks(opts = {}) {
        var _b;
        Logger.debugBeetPx(`AudioApi.stopAllPlaybacks (fadeOutMillis: ${opts.fadeOutMillis})`);
        for (const playback of __classPrivateFieldGet(this, _AudioApi_playbacks, "f").values()) {
            playback.stop(__classPrivateFieldGet(this, _AudioApi_isPaused, "f") || __classPrivateFieldGet(this, _AudioApi_isMuted, "f")
                ? 0
                : (_b = opts.fadeOutMillis) !== null && _b !== void 0 ? _b : __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis));
        }
    }
    stopPlayback(playbackId, opts = {}) {
        var _b, _c;
        Logger.debugBeetPx(`AudioApi.stopPlayback (fadeOutMillis: ${opts.fadeOutMillis})`);
        (_b = __classPrivateFieldGet(this, _AudioApi_playbacks, "f")
            .get(playbackId)) === null || _b === void 0 ? void 0 : _b.stop(__classPrivateFieldGet(this, _AudioApi_isPaused, "f") || __classPrivateFieldGet(this, _AudioApi_isMuted, "f")
            ? 0
            : (_c = opts.fadeOutMillis) !== null && _c !== void 0 ? _c : __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis));
    }
    __internal__audioContext() {
        return __classPrivateFieldGet(this, _AudioApi_audioContext, "f");
    }
    __internal__globalGainNode() {
        return __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f");
    }
}
_a = AudioApi, _AudioApi_assets = new WeakMap(), _AudioApi_audioContext = new WeakMap(), _AudioApi_globalGainNode = new WeakMap(), _AudioApi_pauseFadeNode = new WeakMap(), _AudioApi_playbacks = new WeakMap(), _AudioApi_isPaused = new WeakMap(), _AudioApi_isMuted = new WeakMap(), _AudioApi_instances = new WeakSet(), _AudioApi_loadStoredGlobalMuteUnmuteState = function _AudioApi_loadStoredGlobalMuteUnmuteState() {
    return (window.localStorage.getItem(__classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteKey)) ===
        __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteTrue));
}, _AudioApi_storeGlobalMuteUnmuteState = function _AudioApi_storeGlobalMuteUnmuteState(muted) {
    if (muted) {
        window.localStorage.setItem(__classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteKey), __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteTrue));
    }
    else {
        window.localStorage.removeItem(__classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteKey));
    }
};
_AudioApi_storageMuteUnmuteKey = { value: "audio_api__muted" };
_AudioApi_storageMuteUnmuteTrue = { value: "yes" };
// We use a short fade in/out when muting/unmuting in order to avoid some
//   of audio artifacts that would happen on a instant volume change.
_AudioApi_muteUnmuteDefaultFadeMillis = { value: 100 };
