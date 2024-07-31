var _a;
import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";
import { ScopedLocaleStorage } from "../storage/ScopedLocaleStorage";
import { AudioHelpers } from "./AudioHelpers";
import { AudioPlaybackLooped } from "./AudioPlaybackLooped";
import { AudioPlaybackOnce } from "./AudioPlaybackOnce";
import { AudioPlaybackSequence } from "./AudioPlaybackSequence";
export class AudioApi {
    static #storageMuteUnmuteKey = "audio_api__muted";
    static #storageMuteUnmuteTrue = "yes";
    
    
    static muteUnmuteDefaultFadeMillis = 100;
    #assets;
    #audioContext;
    #globalGainNode;
    #playbacks = new Map();
    #isMuted;
    constructor(assets, audioContext) {
        this.#assets = assets;
        this.#audioContext = audioContext;
        this.#isMuted = this.#loadStoredGlobalMuteUnmuteState();
        HtmlTemplate.updateMutedClass(this.#isMuted);
        this.#globalGainNode = this.#audioContext.createGain();
        this.#globalGainNode.gain.value = this.#isMuted ? 0 : 1;
        this.#globalGainNode.connect(this.#audioContext.destination);
    }
    restart() {
        this.#stopAllPlaybacks();
        this.#playbacks.clear();
    }
    
    
    
    async tryToResumeAudioContextSuspendedByBrowserForSecurityReasons() {
        Logger.debugBeetPx("AudioApi.tryToResumeAudioContextSuspendedByBrowserForSecurityReasons");
        if (this.#audioContext.state === "running") {
            Logger.debugBeetPx("Audio Context is already running");
            return Promise.resolve(true);
        }
        return this.#audioContext
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
        opts ??= {};
        opts.muteOnStart ??= false;
        opts.onGamePause ??= "pause";
        Logger.debugBeetPx(`AudioApi.startPlayback (muteOnStart: ${opts.muteOnStart}, onGamePause: ${opts.onGamePause})`);
        const playback = new AudioPlaybackOnce(soundUrl, {
            assets: this.#assets,
            audioContext: this.#audioContext,
            target: this.#globalGainNode,
            muteOnStart: opts.muteOnStart,
            onGamePause: opts.onGamePause,
            onEnded: () => {
                Logger.debugBeetPx(`AudioApi: deleting playback ${playback.id}`);
                this.#playbacks.delete(playback.id);
            },
        });
        this.#playbacks.set(playback.id, playback);
        return playback.id;
    }
    startPlaybackLooped(soundUrl, opts) {
        opts ??= {};
        opts.muteOnStart ??= false;
        opts.onGamePause ??= "pause";
        Logger.debugBeetPx(`AudioApi.startPlaybackLooped (muteOnStart: ${opts.muteOnStart}, onGamePause: ${opts.onGamePause})`);
        const playback = new AudioPlaybackLooped(soundUrl, {
            assets: this.#assets,
            audioContext: this.#audioContext,
            target: this.#globalGainNode,
            muteOnStart: opts.muteOnStart,
            onGamePause: opts.onGamePause,
            onEnded: () => {
                Logger.debugBeetPx(`AudioApi: deleting playback ${playback.id}`);
                this.#playbacks.delete(playback.id);
            },
        });
        this.#playbacks.set(playback.id, playback);
        return playback.id;
    }
    startPlaybackSequence(soundSequence, opts) {
        opts ??= {};
        opts.muteOnStart ??= false;
        opts.onGamePause ??= "pause";
        Logger.debugBeetPx(`AudioApi.startPlaybackSequence (muteOnStart: ${opts.muteOnStart}, onGamePause: ${opts.onGamePause})`);
        const playback = new AudioPlaybackSequence(soundSequence, {
            assets: this.#assets,
            audioContext: this.#audioContext,
            target: this.#globalGainNode,
            muteOnStart: opts.muteOnStart,
            onGamePause: opts.onGamePause,
            onEnded: () => {
                Logger.debugBeetPx(`AudioApi: deleting playback ${playback.id}`);
                this.#playbacks.delete(playback.id);
            },
        });
        this.#playbacks.set(playback.id, playback);
        return playback.id;
    }
    isAudioMuted() {
        return this.#isMuted;
    }
    muteAudio(opts) {
        opts ??= {};
        Logger.debugBeetPx(`AudioApi.muteAudio (fadeOutMillis: ${opts.fadeOutMillis})`);
        if (this.#isMuted)
            return;
        this.#storeGlobalMuteUnmuteState(true);
        this.#isMuted = true;
        HtmlTemplate.updateMutedClass(this.#isMuted);
        AudioHelpers.muteGain(this.#globalGainNode, this.#audioContext.currentTime, opts.fadeOutMillis ?? _a.muteUnmuteDefaultFadeMillis);
    }
    unmuteAudio(opts) {
        opts ??= {};
        Logger.debugBeetPx(`AudioApi.unmuteAudio (fadeInMillis: ${opts.fadeInMillis})`);
        if (!this.#isMuted)
            return;
        this.#storeGlobalMuteUnmuteState(false);
        this.#isMuted = false;
        HtmlTemplate.updateMutedClass(this.#isMuted);
        AudioHelpers.unmuteGain(this.#globalGainNode, this.#audioContext.currentTime, opts.fadeInMillis ?? _a.muteUnmuteDefaultFadeMillis);
    }
    mutePlayback(playbackId, opts) {
        opts ??= {};
        Logger.debugBeetPx(`AudioApi.mutePlayback (fadeOutMillis: ${opts.fadeOutMillis})`);
        this.#playbacks
            .get(playbackId)
            ?.mute(opts.fadeOutMillis ?? _a.muteUnmuteDefaultFadeMillis);
    }
    unmutePlayback(playbackId, opts) {
        opts ??= {};
        Logger.debugBeetPx(`AudioApi.unmutePlayback (fadeInMillis: ${opts.fadeInMillis})`);
        this.#playbacks
            .get(playbackId)
            ?.unmute(opts.fadeInMillis ?? _a.muteUnmuteDefaultFadeMillis);
    }
    #stopAllPlaybacks(opts) {
        opts ??= {};
        Logger.debugBeetPx(`AudioApi.#stopAllPlaybacks (fadeOutMillis: ${opts.fadeOutMillis})`);
        for (const playback of this.#playbacks.values()) {
            playback.stop(this.#isMuted ? 0 : ((opts.fadeOutMillis ?? _a.muteUnmuteDefaultFadeMillis)));
        }
    }
    stopPlayback(playbackId, opts) {
        opts ??= {};
        Logger.debugBeetPx(`AudioApi.stopPlayback (fadeOutMillis: ${opts.fadeOutMillis})`);
        this.#playbacks
            .get(playbackId)
            ?.stop(this.#isMuted ? 0 : ((opts.fadeOutMillis ?? _a.muteUnmuteDefaultFadeMillis)));
    }
    pausePlayback(playbackId) {
        Logger.debugBeetPx(`AudioApi.pausePlayback`);
        this.#playbacks.get(playbackId)?.pause();
    }
    resumePlayback(playbackId) {
        Logger.debugBeetPx(`AudioApi.resumePlayback`);
        this.#playbacks.get(playbackId)?.resume();
    }
    #loadStoredGlobalMuteUnmuteState() {
        return (ScopedLocaleStorage.getItem(_a.#storageMuteUnmuteKey) ===
            _a.#storageMuteUnmuteTrue);
    }
    #storeGlobalMuteUnmuteState(muted) {
        if (muted) {
            ScopedLocaleStorage.setItem(_a.#storageMuteUnmuteKey, _a.#storageMuteUnmuteTrue);
        }
        else {
            ScopedLocaleStorage.removeItem(_a.#storageMuteUnmuteKey);
        }
    }
    getAudioContext() {
        return this.#audioContext;
    }
    getGlobalGainNode() {
        return this.#globalGainNode;
    }
}
_a = AudioApi;
