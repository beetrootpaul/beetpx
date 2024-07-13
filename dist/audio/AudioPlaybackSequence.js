var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _AudioPlaybackSequence_instances, _AudioPlaybackSequence_combinedBuffer, _AudioPlaybackSequence_introDurationMs, _AudioPlaybackSequence_loopDurationMs, _AudioPlaybackSequence_sourceNode, _AudioPlaybackSequence_intoEntryBuffersWithEqualDurations, _AudioPlaybackSequence_combineBuffers;
import * as ABU from "audio-buffer-utils";
import { clamp } from "../utils/clamp";
import { AudioPlayback } from "./AudioPlayback";
export class AudioPlaybackSequence extends AudioPlayback {
    constructor(soundSequence, params) {
        super(params.audioContext, params.target, params.muteOnStart, params.onGamePause, params.onEnded);
        _AudioPlaybackSequence_instances.add(this);
        this.id = AudioPlayback.nextPlaybackId++;
        this.type = "sequence";
        _AudioPlaybackSequence_combinedBuffer.set(this, void 0);
        _AudioPlaybackSequence_introDurationMs.set(this, void 0);
        _AudioPlaybackSequence_loopDurationMs.set(this, void 0);
        _AudioPlaybackSequence_sourceNode.set(this, void 0);
        const introSequence = soundSequence.intro ?? [];
        const loopSequence = soundSequence.loop ?? [];
        if (introSequence.length + loopSequence.length <= 0) {
            throw Error("Cannot play an empty sound sequence");
        }
        const intro = introSequence.map(entry => __classPrivateFieldGet(this, _AudioPlaybackSequence_instances, "m", _AudioPlaybackSequence_intoEntryBuffersWithEqualDurations).call(this, entry, params.assets));
        const loop = loopSequence.map(entry => __classPrivateFieldGet(this, _AudioPlaybackSequence_instances, "m", _AudioPlaybackSequence_intoEntryBuffersWithEqualDurations).call(this, entry, params.assets));
        __classPrivateFieldSet(this, _AudioPlaybackSequence_combinedBuffer, __classPrivateFieldGet(this, _AudioPlaybackSequence_instances, "m", _AudioPlaybackSequence_combineBuffers).call(this, [...intro, ...loop]), "f");
        __classPrivateFieldSet(this, _AudioPlaybackSequence_introDurationMs, intro.reduce((total, nextEntry) => total + nextEntry.durationMs, 0), "f");
        __classPrivateFieldSet(this, _AudioPlaybackSequence_loopDurationMs, loop.reduce((total, nextEntry) => total + nextEntry.durationMs, 0), "f");
        __classPrivateFieldSet(this, _AudioPlaybackSequence_sourceNode, this.createSourceNode(), "f");
        this.setupAndStartNodes();
    }
    stopAllNodes() {
        __classPrivateFieldGet(this, _AudioPlaybackSequence_sourceNode, "f").stop();
    }
    setupAndStartNodes() {
        if (this.pausedAtMs != null) {
            __classPrivateFieldSet(this, _AudioPlaybackSequence_sourceNode, this.createSourceNode(), "f");
        }
        __classPrivateFieldGet(this, _AudioPlaybackSequence_sourceNode, "f").buffer = __classPrivateFieldGet(this, _AudioPlaybackSequence_combinedBuffer, "f");
        if (__classPrivateFieldGet(this, _AudioPlaybackSequence_loopDurationMs, "f") > 0) {
            __classPrivateFieldGet(this, _AudioPlaybackSequence_sourceNode, "f").loop = true;
            __classPrivateFieldGet(this, _AudioPlaybackSequence_sourceNode, "f").loopStart = __classPrivateFieldGet(this, _AudioPlaybackSequence_introDurationMs, "f") / 1000;
            __classPrivateFieldGet(this, _AudioPlaybackSequence_sourceNode, "f").loopEnd = __classPrivateFieldGet(this, _AudioPlaybackSequence_combinedBuffer, "f").duration;
        }
        this.connectToMainGainNode(__classPrivateFieldGet(this, _AudioPlaybackSequence_sourceNode, "f"));
        __classPrivateFieldGet(this, _AudioPlaybackSequence_sourceNode, "f").addEventListener("ended", () => {
            __classPrivateFieldGet(this, _AudioPlaybackSequence_sourceNode, "f").disconnect();
            this.disconnectFromOutput();
            if (!this.isPausedByGame && !this.isPausedByEngine) {
                this.onEnded();
            }
        });
        let offsetMs = this.pausedAtMs ?
            this.pausedAtMs - this.startedAtMs - this.accumulatedPauseMs
            : 0;
        if (offsetMs > __classPrivateFieldGet(this, _AudioPlaybackSequence_introDurationMs, "f")) {
            offsetMs =
                ((offsetMs - __classPrivateFieldGet(this, _AudioPlaybackSequence_introDurationMs, "f")) % __classPrivateFieldGet(this, _AudioPlaybackSequence_loopDurationMs, "f")) +
                    __classPrivateFieldGet(this, _AudioPlaybackSequence_introDurationMs, "f");
        }
        __classPrivateFieldGet(this, _AudioPlaybackSequence_sourceNode, "f").start(0, offsetMs / 1000);
    }
}
_AudioPlaybackSequence_combinedBuffer = new WeakMap(), _AudioPlaybackSequence_introDurationMs = new WeakMap(), _AudioPlaybackSequence_loopDurationMs = new WeakMap(), _AudioPlaybackSequence_sourceNode = new WeakMap(), _AudioPlaybackSequence_instances = new WeakSet(), _AudioPlaybackSequence_intoEntryBuffersWithEqualDurations = function _AudioPlaybackSequence_intoEntryBuffersWithEqualDurations(entry, assets) {
    if (entry.length < 1) {
        throw Error("Each intro sequence entry needs at least 1 sound");
    }
    const [firstSound, ...otherSounds] = entry;
    const mainSoundUrl = typeof firstSound !== "string" ? firstSound.url : firstSound;
    const mainSoundBuffer = assets.getSoundAsset(mainSoundUrl).audioBuffer;
    const mainSoundDurationMs = mainSoundBuffer.duration * 1000;
    const durationMs = typeof firstSound !== "string" && firstSound.durationMs ?
        firstSound.durationMs(mainSoundDurationMs)
        : mainSoundDurationMs;
    const firstBuffer = ABU.resize(mainSoundBuffer, (durationMs / 1000) * mainSoundBuffer.sampleRate);
    const otherBuffers = otherSounds
        .map(sound => (typeof sound === "string" ? { url: sound } : sound))
        .map(({ url }) => assets.getSoundAsset(url).audioBuffer)
        .map(originalBuffer => ABU.resize(originalBuffer, (durationMs / 1000) * originalBuffer.sampleRate));
    return { firstBuffer, otherBuffers, durationMs };
}, _AudioPlaybackSequence_combineBuffers = function _AudioPlaybackSequence_combineBuffers(entries) {
    const sumBuffers = (lValue, rValue) => clamp(-1, lValue + rValue, 1);
    const mixedBuffers = entries.map(entry => entry.otherBuffers.reduce((mixedBuffer, nextBuffer) => ABU.mix(mixedBuffer, nextBuffer, sumBuffers), ABU.clone(entry.firstBuffer)));
    return ABU.concat(...mixedBuffers);
};
