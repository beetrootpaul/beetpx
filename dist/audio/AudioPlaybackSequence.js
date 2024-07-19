import * as ABU from "audio-buffer-utils";
import { clamp } from "../utils/clamp";
import { AudioPlayback } from "./AudioPlayback";
export class AudioPlaybackSequence extends AudioPlayback {
    id = AudioPlayback.nextPlaybackId++;
    type = "sequence";
    #combinedBuffer;
    #introDurationMs;
    #loopDurationMs;
    #sourceNode;
    constructor(soundSequence, params) {
        super(params.audioContext, params.target, params.muteOnStart, params.onGamePause, params.onEnded);
        const introSequence = soundSequence.intro ?? [];
        const loopSequence = soundSequence.loop ?? [];
        if (introSequence.length + loopSequence.length <= 0) {
            throw Error("Cannot play an empty sound sequence");
        }
        const intro = introSequence.map(entry => this.#intoEntryBuffersWithEqualDurations(entry, params.assets));
        const loop = loopSequence.map(entry => this.#intoEntryBuffersWithEqualDurations(entry, params.assets));
        this.#combinedBuffer = this.#combineBuffers([...intro, ...loop]);
        this.#introDurationMs = intro.reduce((total, nextEntry) => total + nextEntry.durationMs, 0);
        this.#loopDurationMs = loop.reduce((total, nextEntry) => total + nextEntry.durationMs, 0);
        this.#sourceNode = this.createSourceNode();
        this.setupAndStartNodes();
    }
    stopAllNodes() {
        this.#sourceNode.stop();
    }
    setupAndStartNodes() {
        if (this.pausedAtMs != null) {
            this.#sourceNode = this.createSourceNode();
        }
        this.#sourceNode.buffer = this.#combinedBuffer;
        if (this.#loopDurationMs > 0) {
            this.#sourceNode.loop = true;
            this.#sourceNode.loopStart = this.#introDurationMs / 1000;
            this.#sourceNode.loopEnd = this.#combinedBuffer.duration;
        }
        this.connectToMainGainNode(this.#sourceNode);
        this.#sourceNode.addEventListener("ended", () => {
            this.#sourceNode.disconnect();
            this.disconnectFromOutput();
            if (!this.isPausedByGame && !this.isPausedByEngine) {
                this.onEnded();
            }
        });
        let offsetMs = this.pausedAtMs ?
            this.pausedAtMs - this.startedAtMs - this.accumulatedPauseMs
            : 0;
        if (offsetMs > this.#introDurationMs) {
            offsetMs =
                ((offsetMs - this.#introDurationMs) % this.#loopDurationMs) +
                    this.#introDurationMs;
        }
        this.#sourceNode.start(0, offsetMs / 1000);
    }
    #intoEntryBuffersWithEqualDurations(entry, assets) {
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
    }
    #combineBuffers(entries) {
        const sumBuffers = (lValue, rValue) => clamp(-1, lValue + rValue, 1);
        const mixedBuffers = entries.map(entry => entry.otherBuffers.reduce((mixedBuffer, nextBuffer) => ABU.mix(mixedBuffer, nextBuffer, sumBuffers), ABU.clone(entry.firstBuffer)));
        return ABU.concat(...mixedBuffers);
    }
}
