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
var _AudioPlayback_isMuted, _AudioPlayback_audioContext, _AudioPlayback_targetNode, _AudioPlayback_gainNode;
import { Logger } from "../logger/Logger";
import { AudioApi } from "./AudioApi";
import { AudioHelpers } from "./AudioHelpers";
export class AudioPlayback {
    constructor(audioContext, target, muteOnStart, onEnded) {
        _AudioPlayback_isMuted.set(this, void 0);
        _AudioPlayback_audioContext.set(this, void 0);
        _AudioPlayback_targetNode.set(this, void 0);
        _AudioPlayback_gainNode.set(this, void 0);
        this.onEnded = onEnded;
        __classPrivateFieldSet(this, _AudioPlayback_audioContext, audioContext, "f");
        __classPrivateFieldSet(this, _AudioPlayback_targetNode, target, "f");
        __classPrivateFieldSet(this, _AudioPlayback_gainNode, __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").createGain(), "f");
        __classPrivateFieldGet(this, _AudioPlayback_gainNode, "f").gain.value = muteOnStart ? 0 : 1;
        __classPrivateFieldGet(this, _AudioPlayback_gainNode, "f").connect(__classPrivateFieldGet(this, _AudioPlayback_targetNode, "f"));
        this.isPaused = false;
        __classPrivateFieldSet(this, _AudioPlayback_isMuted, false, "f");
        this.startedAtMs = __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime * 1000;
        this.pausedAtMs = null;
        this.accumulatedPauseMs = 0;
    }
    mute(fadeOutMillis) {
        Logger.debugBeetPx(`AudioPlayback.mute (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`);
        if (__classPrivateFieldGet(this, _AudioPlayback_isMuted, "f"))
            return;
        __classPrivateFieldSet(this, _AudioPlayback_isMuted, true, "f");
        if (this.isPaused) {
            return;
        }
        AudioHelpers.muteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, fadeOutMillis);
    }
    unmute(fadeInMillis) {
        Logger.debugBeetPx(`AudioPlayback.unmute (id: ${this.id}, type: ${this.type}, fadeInMillis: ${fadeInMillis})`);
        if (!__classPrivateFieldGet(this, _AudioPlayback_isMuted, "f"))
            return;
        __classPrivateFieldSet(this, _AudioPlayback_isMuted, false, "f");
        if (this.isPaused) {
            return;
        }
        AudioHelpers.unmuteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, fadeInMillis);
    }
    stop(fadeOutMillis) {
        Logger.debugBeetPx(`AudioPlayback.stop (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`);
        if (this.isPaused) {
            this.onEnded();
            return;
        }
        AudioHelpers.muteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, fadeOutMillis, () => {
            this.stopAllNodes();
            if (!this.isPaused) {
                this.onEnded();
            }
        });
    }
    pause() {
        Logger.debugBeetPx(`AudioPlayback.pause (id: ${this.id}, type: ${this.type}})`);
        if (this.isPaused)
            return;
        this.pausedAtMs = __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime * 1000;
        AudioHelpers.muteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, AudioApi.muteUnmuteDefaultFadeMillis, () => {
            this.isPaused = true;
            this.stopAllNodes();
        });
    }
    resume() {
        Logger.debugBeetPx(`AudioPlayback.resume (id: ${this.id}, type: ${this.type})`);
        if (!this.isPaused)
            return;
        this.isPaused = false;
        __classPrivateFieldSet(this, _AudioPlayback_gainNode, __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").createGain(), "f");
        __classPrivateFieldGet(this, _AudioPlayback_gainNode, "f").gain.value = __classPrivateFieldGet(this, _AudioPlayback_isMuted, "f") ? 0 : 1;
        __classPrivateFieldGet(this, _AudioPlayback_gainNode, "f").connect(__classPrivateFieldGet(this, _AudioPlayback_targetNode, "f"));
        this.setupAndStartNodes();
        if (this.pausedAtMs != null) {
            this.accumulatedPauseMs +=
                __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime * 1000 - this.pausedAtMs;
            this.pausedAtMs = null;
        }
        if (!__classPrivateFieldGet(this, _AudioPlayback_isMuted, "f")) {
            AudioHelpers.unmuteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, AudioApi.muteUnmuteDefaultFadeMillis, () => { });
        }
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
_AudioPlayback_isMuted = new WeakMap(), _AudioPlayback_audioContext = new WeakMap(), _AudioPlayback_targetNode = new WeakMap(), _AudioPlayback_gainNode = new WeakMap();

AudioPlayback.nextPlaybackId = 1;
