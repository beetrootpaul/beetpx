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
var _AudioPlayback_audioContext, _AudioPlayback_gainNode;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioPlayback = void 0;
const Logger_1 = require("../logger/Logger");
const AudioHelpers_1 = require("./AudioHelpers");
class AudioPlayback {
    constructor(audioContext, target, muteOnStart) {
        _AudioPlayback_audioContext.set(this, void 0);
        _AudioPlayback_gainNode.set(this, void 0);
        __classPrivateFieldSet(this, _AudioPlayback_audioContext, audioContext, "f");
        __classPrivateFieldSet(this, _AudioPlayback_gainNode, __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").createGain(), "f");
        __classPrivateFieldGet(this, _AudioPlayback_gainNode, "f").gain.value = muteOnStart ? 0 : 1;
        __classPrivateFieldGet(this, _AudioPlayback_gainNode, "f").connect(target);
    }
    mute(fadeOutMillis) {
        Logger_1.Logger.debugBeetPx(`AudioPlayback.mute (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`);
        AudioHelpers_1.AudioHelpers.muteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, fadeOutMillis);
    }
    unmute(fadeInMillis) {
        Logger_1.Logger.debugBeetPx(`AudioPlayback.unmute (id: ${this.id}, type: ${this.type}, fadeInMillis: ${fadeInMillis})`);
        AudioHelpers_1.AudioHelpers.unmuteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, fadeInMillis);
    }
    stop(fadeOutMillis) {
        Logger_1.Logger.debugBeetPx(`AudioPlayback.stop (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`);
        AudioHelpers_1.AudioHelpers.muteGain(__classPrivateFieldGet(this, _AudioPlayback_gainNode, "f"), __classPrivateFieldGet(this, _AudioPlayback_audioContext, "f").currentTime, fadeOutMillis, () => {
            this.stopAllNodes();
        });
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
exports.AudioPlayback = AudioPlayback;
_AudioPlayback_audioContext = new WeakMap(), _AudioPlayback_gainNode = new WeakMap();

AudioPlayback.nextPlaybackId = 1;
