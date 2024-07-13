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
var _AudioPlaybackLooped_soundAsset, _AudioPlaybackLooped_sourceNode, _AudioPlaybackLooped_loopDurationMs;
import { AudioPlayback } from "./AudioPlayback";
export class AudioPlaybackLooped extends AudioPlayback {
    constructor(soundUrl, params) {
        super(params.audioContext, params.target, params.muteOnStart, params.onGamePause, params.onEnded);
        this.id = AudioPlayback.nextPlaybackId++;
        this.type = "looped";
        _AudioPlaybackLooped_soundAsset.set(this, void 0);
        _AudioPlaybackLooped_sourceNode.set(this, void 0);
        _AudioPlaybackLooped_loopDurationMs.set(this, void 0);
        __classPrivateFieldSet(this, _AudioPlaybackLooped_soundAsset, params.assets.getSoundAsset(soundUrl), "f");
        __classPrivateFieldSet(this, _AudioPlaybackLooped_loopDurationMs, __classPrivateFieldGet(this, _AudioPlaybackLooped_soundAsset, "f").audioBuffer.duration * 1000, "f");
        __classPrivateFieldSet(this, _AudioPlaybackLooped_sourceNode, this.createSourceNode(), "f");
        this.setupAndStartNodes();
    }
    stopAllNodes() {
        __classPrivateFieldGet(this, _AudioPlaybackLooped_sourceNode, "f").stop();
    }
    setupAndStartNodes() {
        if (this.pausedAtMs != null) {
            __classPrivateFieldSet(this, _AudioPlaybackLooped_sourceNode, this.createSourceNode(), "f");
        }
        __classPrivateFieldGet(this, _AudioPlaybackLooped_sourceNode, "f").buffer = __classPrivateFieldGet(this, _AudioPlaybackLooped_soundAsset, "f").audioBuffer;
        __classPrivateFieldGet(this, _AudioPlaybackLooped_sourceNode, "f").loop = true;
        this.connectToMainGainNode(__classPrivateFieldGet(this, _AudioPlaybackLooped_sourceNode, "f"));
        __classPrivateFieldGet(this, _AudioPlaybackLooped_sourceNode, "f").addEventListener("ended", () => {
            __classPrivateFieldGet(this, _AudioPlaybackLooped_sourceNode, "f").disconnect();
            this.disconnectFromOutput();
            if (!this.isPausedByGame && !this.isPausedByEngine) {
                this.onEnded();
            }
        });
        const offsetMs = this.pausedAtMs ?
            (this.pausedAtMs - this.startedAtMs - this.accumulatedPauseMs) %
                __classPrivateFieldGet(this, _AudioPlaybackLooped_loopDurationMs, "f")
            : 0;
        __classPrivateFieldGet(this, _AudioPlaybackLooped_sourceNode, "f").start(0, offsetMs / 1000);
    }
}
_AudioPlaybackLooped_soundAsset = new WeakMap(), _AudioPlaybackLooped_sourceNode = new WeakMap(), _AudioPlaybackLooped_loopDurationMs = new WeakMap();
