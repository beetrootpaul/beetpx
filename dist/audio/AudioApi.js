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
        
        __classPrivateFieldSet(this, _AudioApi_isPaused, false, "f");
        AudioHelpers.unmuteGain(__classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f"), __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, 0);
        __classPrivateFieldGet(this, _AudioApi_audioContext, "f").resume().catch(err => {
            Logger.errorBeetPx(err);
        });
    }
    
    
    
    async tryToResumeAudioContextSuspendedByBrowserForSecurityReasons() {
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
            .catch(err => {
            Logger.errorBeetPx(err);
            return false;
        });
    }
    startPlayback(soundUrl, opts) {
        opts ?? (opts = {});
        opts.muteOnStart ?? (opts.muteOnStart = false);
        Logger.debugBeetPx(`AudioApi.startPlayback (muteOnStart: ${opts.muteOnStart})`);
        const playback = new AudioPlaybackOnce(soundUrl, {
            assets: __classPrivateFieldGet(this, _AudioApi_assets, "f"),
            audioContext: __classPrivateFieldGet(this, _AudioApi_audioContext, "f"),
            target: __classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f"),
            muteOnStart: opts.muteOnStart,
            onEnded: () => {
                __classPrivateFieldGet(this, _AudioApi_playbacks, "f").delete(playback.id);
            },
        });
        __classPrivateFieldGet(this, _AudioApi_playbacks, "f").set(playback.id, playback);
        return playback.id;
    }
    startPlaybackLooped(soundUrl, opts) {
        opts ?? (opts = {});
        opts.muteOnStart ?? (opts.muteOnStart = false);
        Logger.debugBeetPx(`AudioApi.startPlaybackLooped (muteOnStart: ${opts.muteOnStart})`);
        const playback = new AudioPlaybackLooped(soundUrl, {
            assets: __classPrivateFieldGet(this, _AudioApi_assets, "f"),
            audioContext: __classPrivateFieldGet(this, _AudioApi_audioContext, "f"),
            target: __classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f"),
            muteOnStart: opts.muteOnStart,
            onEnded: () => {
                __classPrivateFieldGet(this, _AudioApi_playbacks, "f").delete(playback.id);
            },
        });
        __classPrivateFieldGet(this, _AudioApi_playbacks, "f").set(playback.id, playback);
        return playback.id;
    }
    startPlaybackSequence(soundSequence, opts) {
        opts ?? (opts = {});
        opts.muteOnStart ?? (opts.muteOnStart = false);
        Logger.debugBeetPx(`AudioApi.startPlaybackSequence (muteOnStart: ${opts.muteOnStart})`);
        const playback = new AudioPlaybackSequence(soundSequence, {
            assets: __classPrivateFieldGet(this, _AudioApi_assets, "f"),
            audioContext: __classPrivateFieldGet(this, _AudioApi_audioContext, "f"),
            target: __classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f"),
            muteOnStart: opts.muteOnStart,
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
        Logger.debugBeetPx(`AudioApi.muteAudio (fadeOutMillis: ${opts.fadeOutMillis})`);
        if (__classPrivateFieldGet(this, _AudioApi_isMuted, "f"))
            return;
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_storeGlobalMuteUnmuteState).call(this, true);
        __classPrivateFieldSet(this, _AudioApi_isMuted, true, "f");
        HtmlTemplate.updateMutedClass(__classPrivateFieldGet(this, _AudioApi_isMuted, "f"));
        AudioHelpers.muteGain(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"), __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(this, _AudioApi_isPaused, "f") ? 0 : (opts.fadeOutMillis ?? __classPrivateFieldGet(_a, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis)));
    }
    unmuteAudio(opts = {}) {
        Logger.debugBeetPx(`AudioApi.unmuteAudio (fadeInMillis: ${opts.fadeInMillis})`);
        if (!__classPrivateFieldGet(this, _AudioApi_isMuted, "f"))
            return;
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_storeGlobalMuteUnmuteState).call(this, false);
        __classPrivateFieldSet(this, _AudioApi_isMuted, false, "f");
        HtmlTemplate.updateMutedClass(__classPrivateFieldGet(this, _AudioApi_isMuted, "f"));
        AudioHelpers.unmuteGain(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"), __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(this, _AudioApi_isPaused, "f") ? 0 : (opts.fadeInMillis ?? __classPrivateFieldGet(_a, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis)));
    }
    mutePlayback(playbackId, opts = {}) {
        Logger.debugBeetPx(`AudioApi.mutePlayback (fadeOutMillis: ${opts.fadeOutMillis})`);
        __classPrivateFieldGet(this, _AudioApi_playbacks, "f")
            .get(playbackId)
            ?.mute(__classPrivateFieldGet(this, _AudioApi_isPaused, "f") ? 0 : (opts.fadeOutMillis ?? __classPrivateFieldGet(_a, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis)));
    }
    unmutePlayback(playbackId, opts = {}) {
        Logger.debugBeetPx(`AudioApi.unmutePlayback (fadeInMillis: ${opts.fadeInMillis})`);
        __classPrivateFieldGet(this, _AudioApi_playbacks, "f")
            .get(playbackId)
            ?.unmute(__classPrivateFieldGet(this, _AudioApi_isPaused, "f") ? 0 : (opts.fadeInMillis ?? __classPrivateFieldGet(_a, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis)));
    }
    pauseAudio() {
        Logger.debugBeetPx("AudioApi.pauseAudio");
        if (__classPrivateFieldGet(this, _AudioApi_isPaused, "f"))
            return;
        __classPrivateFieldSet(this, _AudioApi_isPaused, true, "f");
        AudioHelpers.muteGain(__classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f"), __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(_a, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis), () => {
            __classPrivateFieldGet(this, _AudioApi_audioContext, "f").suspend().catch(err => {
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
            AudioHelpers.unmuteGain(__classPrivateFieldGet(this, _AudioApi_pauseFadeNode, "f"), __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(_a, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis));
        })
            .catch(err => {
            Logger.errorBeetPx(err);
        });
    }
    stopAllPlaybacks(opts = {}) {
        Logger.debugBeetPx(`AudioApi.stopAllPlaybacks (fadeOutMillis: ${opts.fadeOutMillis})`);
        for (const playback of __classPrivateFieldGet(this, _AudioApi_playbacks, "f").values()) {
            playback.stop(__classPrivateFieldGet(this, _AudioApi_isPaused, "f") || __classPrivateFieldGet(this, _AudioApi_isMuted, "f") ?
                0
                : opts.fadeOutMillis ?? __classPrivateFieldGet(_a, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis));
        }
    }
    stopPlayback(playbackId, opts = {}) {
        Logger.debugBeetPx(`AudioApi.stopPlayback (fadeOutMillis: ${opts.fadeOutMillis})`);
        __classPrivateFieldGet(this, _AudioApi_playbacks, "f")
            .get(playbackId)
            ?.stop(__classPrivateFieldGet(this, _AudioApi_isPaused, "f") || __classPrivateFieldGet(this, _AudioApi_isMuted, "f") ?
            0
            : opts.fadeOutMillis ?? __classPrivateFieldGet(_a, _a, "f", _AudioApi_muteUnmuteDefaultFadeMillis));
    }
    getAudioContext() {
        return __classPrivateFieldGet(this, _AudioApi_audioContext, "f");
    }
    getGlobalGainNode() {
        return __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f");
    }
}
_a = AudioApi, _AudioApi_assets = new WeakMap(), _AudioApi_audioContext = new WeakMap(), _AudioApi_globalGainNode = new WeakMap(), _AudioApi_pauseFadeNode = new WeakMap(), _AudioApi_playbacks = new WeakMap(), _AudioApi_isPaused = new WeakMap(), _AudioApi_isMuted = new WeakMap(), _AudioApi_instances = new WeakSet(), _AudioApi_loadStoredGlobalMuteUnmuteState = function _AudioApi_loadStoredGlobalMuteUnmuteState() {
    return (window.localStorage.getItem(__classPrivateFieldGet(_a, _a, "f", _AudioApi_storageMuteUnmuteKey)) ===
        __classPrivateFieldGet(_a, _a, "f", _AudioApi_storageMuteUnmuteTrue));
}, _AudioApi_storeGlobalMuteUnmuteState = function _AudioApi_storeGlobalMuteUnmuteState(muted) {
    if (muted) {
        window.localStorage.setItem(__classPrivateFieldGet(_a, _a, "f", _AudioApi_storageMuteUnmuteKey), __classPrivateFieldGet(_a, _a, "f", _AudioApi_storageMuteUnmuteTrue));
    }
    else {
        window.localStorage.removeItem(__classPrivateFieldGet(_a, _a, "f", _AudioApi_storageMuteUnmuteKey));
    }
};
_AudioApi_storageMuteUnmuteKey = { value: "audio_api__muted" };
_AudioApi_storageMuteUnmuteTrue = { value: "yes" };


_AudioApi_muteUnmuteDefaultFadeMillis = { value: 100 };
