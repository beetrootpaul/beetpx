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
var _AudioPlayback_instances, _AudioPlayback_isMutedByEngine, _AudioPlayback_isMutedByGame, _AudioPlayback_audioContext, _AudioPlayback_targetNode, _AudioPlayback_gainNode, _AudioPlayback_muteImpl, _AudioPlayback_unmuteImpl, _AudioPlayback_pauseImpl, _AudioPlayback_resumeImpl;
import { Logger } from "../logger/Logger";
import { AudioApi } from "./AudioApi";
import { AudioHelpers } from "./AudioHelpers";
export class AudioPlayback {
    constructor(audioContext, target, muteOnStart, onGamePause, onEnded) {
        _AudioPlayback_instances.add(this);
        _AudioPlayback_isMutedByEngine.set(this, void 0);
        _AudioPlayback_isMutedByGame.set(this, void 0);
        _AudioPlayback_audioContext.set(this, void 0);
        _AudioPlayback_targetNode.set(this, void 0);
        _AudioPlayback_gainNode.set(this, void 0);
        
        if (onGamePause === "pause") {
            AudioPlayback.playbacksToPauseOnGamePause.add(this);
        }
        else if (onGamePause === "mute") {
            AudioPlayback.playbacksToMuteOnGamePause.add(this);
        }
        this.onEnded = () => {
            onEnded();
            AudioPlayback.playbacksToPauseOnGamePause.delete(this);
            AudioPlayback.playbacksToMuteOnGamePause.delete(this);
        };
        __classPrivateFieldSet(this, _AudioPlayback_audioContext, audioContext, "f");
        __classPrivateFieldSet(this, _AudioPlayback_targetNode, target, "f");
        __classPrivateFieldSet(this, _AudioPlayback_gainNode, __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").createGain(), "f");
        __classPrivateFieldGet(this, _AudioPlayback_gainNode, "f").gain.value = muteOnStart ? 0 : 1;
        __classPrivateFieldGet(this, _AudioPlayback_gainNode, "f").connect(__classPrivateFieldGet(this, _AudioPlayback_targetNode, "f"));
        this.isPausedByGame = false;
        this.isPausedByEngine = false;
        __classPrivateFieldSet(this, _AudioPlayback_isMutedByGame, false, "f");
        __classPrivateFieldSet(this, _AudioPlayback_isMutedByEngine, false, "f");
        this.startedAtMs = __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime * 1000;
        this.pausedAtMs = null;
        this.accumulatedPauseMs = 0;
    }
    mute(fadeOutMillis) {
        Logger.debugBeetPx(`AudioPlayback.mute (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`);
        if (__classPrivateFieldGet(this, _AudioPlayback_isMutedByGame, "f"))
            return;
        __classPrivateFieldSet(this, _AudioPlayback_isMutedByGame, true, "f");
        if (__classPrivateFieldGet(this, _AudioPlayback_isMutedByEngine, "f"))
            return;
        if (this.isPausedByGame || this.isPausedByEngine) {
            return;
        }
        __classPrivateFieldGet(this, _AudioPlayback_instances, "m", _AudioPlayback_muteImpl).call(this, fadeOutMillis);
    }
    muteByEngine() {
        Logger.debugBeetPx(`AudioPlayback.muteByEngine (id: ${this.id}, type: ${this.type})`);
        if (__classPrivateFieldGet(this, _AudioPlayback_isMutedByEngine, "f"))
            return;
        __classPrivateFieldSet(this, _AudioPlayback_isMutedByEngine, true, "f");
        if (__classPrivateFieldGet(this, _AudioPlayback_isMutedByGame, "f"))
            return;
        if (this.isPausedByGame || this.isPausedByEngine) {
            return;
        }
        __classPrivateFieldGet(this, _AudioPlayback_instances, "m", _AudioPlayback_muteImpl).call(this, AudioApi.muteUnmuteDefaultFadeMillis);
    }
    unmute(fadeInMillis) {
        Logger.debugBeetPx(`AudioPlayback.unmute (id: ${this.id}, type: ${this.type}, fadeInMillis: ${fadeInMillis})`);
        if (!__classPrivateFieldGet(this, _AudioPlayback_isMutedByGame, "f"))
            return;
        __classPrivateFieldSet(this, _AudioPlayback_isMutedByGame, false, "f");
        if (__classPrivateFieldGet(this, _AudioPlayback_isMutedByEngine, "f"))
            return;
        if (this.isPausedByGame || this.isPausedByEngine) {
            return;
        }
        __classPrivateFieldGet(this, _AudioPlayback_instances, "m", _AudioPlayback_unmuteImpl).call(this, fadeInMillis);
    }
    unmuteByEngine() {
        Logger.debugBeetPx(`AudioPlayback.unmuteByEngine (id: ${this.id}, type: ${this.type})`);
        if (!__classPrivateFieldGet(this, _AudioPlayback_isMutedByEngine, "f"))
            return;
        __classPrivateFieldSet(this, _AudioPlayback_isMutedByEngine, false, "f");
        if (__classPrivateFieldGet(this, _AudioPlayback_isMutedByGame, "f"))
            return;
        if (this.isPausedByGame || this.isPausedByEngine) {
            return;
        }
        __classPrivateFieldGet(this, _AudioPlayback_instances, "m", _AudioPlayback_unmuteImpl).call(this, AudioApi.muteUnmuteDefaultFadeMillis);
    }
    stop(fadeOutMillis) {
        Logger.debugBeetPx(`AudioPlayback.stop (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`);
        if (this.isPausedByGame || this.isPausedByEngine) {
            this.onEnded();
            return;
        }
        AudioHelpers.muteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, fadeOutMillis, () => {
            this.stopAllNodes();
            if (!this.isPausedByGame && !this.isPausedByEngine) {
                this.onEnded();
            }
        });
    }
    pause() {
        Logger.debugBeetPx(`AudioPlayback.pause (id: ${this.id}, type: ${this.type}})`);
        if (this.isPausedByGame)
            return;
        this.isPausedByGame = true;
        if (this.isPausedByEngine)
            return;
        __classPrivateFieldGet(this, _AudioPlayback_instances, "m", _AudioPlayback_pauseImpl).call(this);
    }
    pauseByEngine() {
        Logger.debugBeetPx(`AudioPlayback.pauseByEngine (id: ${this.id}, type: ${this.type}})`);
        if (this.isPausedByEngine)
            return;
        this.isPausedByEngine = true;
        if (this.isPausedByGame)
            return;
        __classPrivateFieldGet(this, _AudioPlayback_instances, "m", _AudioPlayback_pauseImpl).call(this);
    }
    resume() {
        Logger.debugBeetPx(`AudioPlayback.resume (id: ${this.id}, type: ${this.type})`);
        if (!this.isPausedByGame)
            return;
        this.isPausedByGame = false;
        if (this.isPausedByEngine)
            return;
        __classPrivateFieldGet(this, _AudioPlayback_instances, "m", _AudioPlayback_resumeImpl).call(this);
    }
    resumeByEngine() {
        Logger.debugBeetPx(`AudioPlayback.resumeByEngine (id: ${this.id}, type: ${this.type})`);
        if (!this.isPausedByEngine)
            return;
        this.isPausedByEngine = false;
        if (this.isPausedByGame)
            return;
        __classPrivateFieldGet(this, _AudioPlayback_instances, "m", _AudioPlayback_resumeImpl).call(this);
    }
    createSourceNode() {
        return __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").createBufferSource();
    }
    connectToMainGainNode(audioNode) {
        audioNode.connect(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"));
    }
    disconnectFromOutput() {
        __classPrivateFieldGet(this, _AudioPlayback_gainNode, "f").disconnect();
    }
}
_AudioPlayback_isMutedByEngine = new WeakMap(), _AudioPlayback_isMutedByGame = new WeakMap(), _AudioPlayback_audioContext = new WeakMap(), _AudioPlayback_targetNode = new WeakMap(), _AudioPlayback_gainNode = new WeakMap(), _AudioPlayback_instances = new WeakSet(), _AudioPlayback_muteImpl = function _AudioPlayback_muteImpl(fadeOutMillis) {
    AudioHelpers.muteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, fadeOutMillis);
}, _AudioPlayback_unmuteImpl = function _AudioPlayback_unmuteImpl(fadeInMillis) {
    AudioHelpers.unmuteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, fadeInMillis);
}, _AudioPlayback_pauseImpl = function _AudioPlayback_pauseImpl() {
    this.pausedAtMs = __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime * 1000;
    AudioHelpers.muteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, AudioApi.muteUnmuteDefaultFadeMillis, () => {
        this.stopAllNodes();
    });
}, _AudioPlayback_resumeImpl = function _AudioPlayback_resumeImpl() {
    __classPrivateFieldSet(this, _AudioPlayback_gainNode, __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").createGain(), "f");
    __classPrivateFieldGet(this, _AudioPlayback_gainNode, "f").gain.value =
        __classPrivateFieldGet(this, _AudioPlayback_isMutedByGame, "f") || this.isPausedByEngine ? 0 : 1;
    __classPrivateFieldGet(this, _AudioPlayback_gainNode, "f").connect(__classPrivateFieldGet(this, _AudioPlayback_targetNode, "f"));
    this.setupAndStartNodes();
    if (this.pausedAtMs != null) {
        this.accumulatedPauseMs +=
            __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime * 1000 - this.pausedAtMs;
        this.pausedAtMs = null;
    }
    if (!__classPrivateFieldGet(this, _AudioPlayback_isMutedByGame, "f") && !this.isPausedByEngine) {
        AudioHelpers.unmuteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, AudioApi.muteUnmuteDefaultFadeMillis, () => { });
    }
};
AudioPlayback.playbacksToPauseOnGamePause = new Set();
AudioPlayback.playbacksToMuteOnGamePause = new Set();

AudioPlayback.nextPlaybackId = 1;
