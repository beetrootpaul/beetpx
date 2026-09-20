import { Logger } from "../logger/Logger";
import { AudioApi } from "./AudioApi";
import { AudioHelpers } from "./AudioHelpers";
export class AudioPlayback {
    static playbacksToPauseOnGamePause = new Set();
    static playbacksToMuteOnGamePause = new Set();
    static nextPlaybackId = 1;
    onEnded;
    startedAtMs;
    pausedAtMs;
    accumulatedPauseMs;
    isPausedByFramework;
    isPausedByGame;
    #isMutedByFramework;
    #isMutedByGame;
    #audioContext;
    #targetNode;
    #gainNode;
    constructor(audioContext, target, muteOnStart, onGamePause, onEnded) {
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
        this.#audioContext = audioContext;
        this.#targetNode = target;
        this.#gainNode = this.#audioContext.createGain();
        this.#gainNode.gain.value = muteOnStart ? 0 : 1;
        this.#gainNode.connect(this.#targetNode);
        this.isPausedByGame = false;
        this.isPausedByFramework = false;
        this.#isMutedByGame = muteOnStart;
        this.#isMutedByFramework = false;
        this.startedAtMs = this.#audioContext.currentTime * 1000;
        this.pausedAtMs = null;
        this.accumulatedPauseMs = 0;
    }
    mute(fadeOutMillis) {
        Logger.debugBeetPx(`AudioPlayback.mute (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`);
        if (this.#isMutedByGame)
            return;
        this.#isMutedByGame = true;
        if (this.#isMutedByFramework)
            return;
        if (this.isPausedByGame || this.isPausedByFramework) {
            return;
        }
        this.#muteImpl(fadeOutMillis);
    }
    muteByFramework() {
        Logger.debugBeetPx(`AudioPlayback.muteByFramework (id: ${this.id}, type: ${this.type})`);
        if (this.#isMutedByFramework)
            return;
        this.#isMutedByFramework = true;
        if (this.#isMutedByGame)
            return;
        if (this.isPausedByGame || this.isPausedByFramework) {
            return;
        }
        this.#muteImpl(AudioApi.muteUnmuteDefaultFadeMillis);
    }
    #muteImpl(fadeOutMillis) {
        AudioHelpers.muteGain(this.#gainNode, this.#audioContext.currentTime, fadeOutMillis);
    }
    unmute(fadeInMillis) {
        Logger.debugBeetPx(`AudioPlayback.unmute (id: ${this.id}, type: ${this.type}, fadeInMillis: ${fadeInMillis})`);
        if (!this.#isMutedByGame)
            return;
        this.#isMutedByGame = false;
        if (this.#isMutedByFramework)
            return;
        if (this.isPausedByGame || this.isPausedByFramework) {
            return;
        }
        this.#unmuteImpl(fadeInMillis);
    }
    unmuteByFramework() {
        Logger.debugBeetPx(`AudioPlayback.unmuteByFramework (id: ${this.id}, type: ${this.type})`);
        if (!this.#isMutedByFramework)
            return;
        this.#isMutedByFramework = false;
        if (this.#isMutedByGame)
            return;
        if (this.isPausedByGame || this.isPausedByFramework) {
            return;
        }
        this.#unmuteImpl(AudioApi.muteUnmuteDefaultFadeMillis);
    }
    #unmuteImpl(fadeInMillis) {
        AudioHelpers.unmuteGain(this.#gainNode, this.#audioContext.currentTime, fadeInMillis);
    }
    stop(fadeOutMillis) {
        Logger.debugBeetPx(`AudioPlayback.stop (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`);
        if (this.isPausedByGame || this.isPausedByFramework) {
            this.onEnded();
            return;
        }
        AudioHelpers.muteGain(this.#gainNode, this.#audioContext.currentTime, fadeOutMillis, () => {
            this.stopAllNodes();
            if (!this.isPausedByGame && !this.isPausedByFramework) {
                this.onEnded();
            }
        });
    }
    pause() {
        Logger.debugBeetPx(`AudioPlayback.pause (id: ${this.id}, type: ${this.type}})`);
        if (this.isPausedByGame)
            return;
        this.isPausedByGame = true;
        if (this.isPausedByFramework)
            return;
        this.#pauseImpl();
    }
    pauseByFramework() {
        Logger.debugBeetPx(`AudioPlayback.pauseByFramework (id: ${this.id}, type: ${this.type}})`);
        if (this.isPausedByFramework)
            return;
        this.isPausedByFramework = true;
        if (this.isPausedByGame)
            return;
        this.#pauseImpl();
    }
    #pauseImpl() {
        this.pausedAtMs = this.#audioContext.currentTime * 1000;
        AudioHelpers.muteGain(this.#gainNode, this.#audioContext.currentTime, AudioApi.muteUnmuteDefaultFadeMillis, () => {
            this.stopAllNodes();
        });
    }
    resume() {
        Logger.debugBeetPx(`AudioPlayback.resume (id: ${this.id}, type: ${this.type})`);
        if (!this.isPausedByGame)
            return;
        this.isPausedByGame = false;
        if (this.isPausedByFramework)
            return;
        this.#resumeImpl();
    }
    resumeByFramework() {
        Logger.debugBeetPx(`AudioPlayback.resumeByFramework (id: ${this.id}, type: ${this.type})`);
        if (!this.isPausedByFramework)
            return;
        this.isPausedByFramework = false;
        if (this.isPausedByGame)
            return;
        this.#resumeImpl();
    }
    #resumeImpl() {
        this.#gainNode = this.#audioContext.createGain();
        this.#gainNode.gain.value =
            this.#isMutedByGame || this.isPausedByFramework ? 0 : 1;
        this.#gainNode.connect(this.#targetNode);
        this.setupAndStartNodes();
        if (this.pausedAtMs != null) {
            this.accumulatedPauseMs +=
                this.#audioContext.currentTime * 1000 - this.pausedAtMs;
            this.pausedAtMs = null;
        }
        if (!this.#isMutedByGame && !this.isPausedByFramework) {
            AudioHelpers.unmuteGain(this.#gainNode, this.#audioContext.currentTime, AudioApi.muteUnmuteDefaultFadeMillis, () => { });
        }
    }
    createSourceNode() {
        return this.#audioContext.createBufferSource();
    }
    connectToMainGainNode(audioNode) {
        audioNode.connect(this.#gainNode);
    }
    disconnectFromOutput() {
        this.#gainNode.disconnect();
    }
}
//# sourceMappingURL=AudioPlayback.js.map