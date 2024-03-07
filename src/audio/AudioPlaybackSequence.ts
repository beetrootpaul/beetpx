import * as ABU from "audio-buffer-utils";
import { Assets } from "../assets/Assets";
import { clamp } from "../utils/clamp";
import { AudioPlayback, BpxAudioPlaybackId } from "./AudioPlayback";
import { BpxSoundSequence, BpxSoundSequenceEntry } from "./SoundSequence";

type EntryBuffers = {
  firstBuffer: AudioBuffer;
  otherBuffers: AudioBuffer[];
  durationMs: number;
};

export class AudioPlaybackSequence extends AudioPlayback {
  readonly id: BpxAudioPlaybackId = AudioPlayback.nextPlaybackId++;
  readonly type: string = "sequence";

  readonly #sourceNode: AudioBufferSourceNode;

  constructor(
    soundSequence: BpxSoundSequence,
    params: {
      assets: Assets;
      audioContext: AudioContext;
      target: AudioNode;
      muteOnStart: boolean;
      onEnded: () => void;
    },
  ) {
    super(params.audioContext, params.target, params.muteOnStart);

    const introSequence = soundSequence.intro ?? [];
    const loopSequence = soundSequence.loop ?? [];
    if (introSequence.length + loopSequence.length <= 0) {
      throw Error("Cannot play an empty sound sequence");
    }

    const intro: EntryBuffers[] = introSequence.map((entry) =>
      this.#intoEntryBuffersWithEqualDurations(entry, params.assets),
    );
    const loop: EntryBuffers[] = loopSequence.map((entry) =>
      this.#intoEntryBuffersWithEqualDurations(entry, params.assets),
    );

    const combinedBuffer: AudioBuffer = this.#combineBuffers([
      ...intro,
      ...loop,
    ]);

    this.#sourceNode = this.createSourceNode();
    this.#sourceNode.buffer = combinedBuffer;
    this.#sourceNode.loop = true;
    this.#sourceNode.loopStart =
      intro.reduce((total, nextEntry) => total + nextEntry.durationMs, 0) /
      1000;
    this.#sourceNode.loopEnd = combinedBuffer.duration;
    this.connectToMainGainNode(this.#sourceNode);

    this.#sourceNode.addEventListener("ended", () => {
      this.#sourceNode.disconnect();
      this.disconnectFromOutput();
      params.onEnded();
    });

    this.#sourceNode.start();
  }

  protected stopAllNodes(): void {
    this.#sourceNode.stop();
  }

  #intoEntryBuffersWithEqualDurations(
    entry: BpxSoundSequenceEntry,
    assets: Assets,
  ): EntryBuffers {
    if (entry.length < 1) {
      throw Error("Each intro sequence entry needs at least 1 sound");
    }

    const [firstSound, ...otherSounds] = entry;

    const mainSoundUrl: string =
      typeof firstSound !== "string" ? firstSound.url : firstSound;
    const mainSoundBuffer = assets.getSoundAsset(mainSoundUrl).audioBuffer;
    const mainSoundDurationMs: number = mainSoundBuffer.duration * 1000;

    const durationMs: number =
      typeof firstSound !== "string" && firstSound.durationMs
        ? firstSound.durationMs(mainSoundDurationMs)
        : mainSoundDurationMs;

    const firstBuffer: AudioBuffer = ABU.resize(
      mainSoundBuffer,
      (durationMs / 1000) * mainSoundBuffer.sampleRate,
    );

    const otherBuffers: AudioBuffer[] = otherSounds
      .map((sound) => (typeof sound === "string" ? { url: sound } : sound))
      .map(({ url }) => assets.getSoundAsset(url).audioBuffer)
      .map((originalBuffer) =>
        ABU.resize(
          originalBuffer,
          (durationMs / 1000) * originalBuffer.sampleRate,
        ),
      );

    return { firstBuffer, otherBuffers, durationMs };
  }

  #combineBuffers(entries: EntryBuffers[]): AudioBuffer {
    const sumBuffers = (lValue: number, rValue: number): number =>
      clamp(-1, lValue + rValue, 1);
    const mixedBuffers: AudioBuffer[] = entries.map((entry) =>
      entry.otherBuffers.reduce(
        (mixedBuffer, nextBuffer) =>
          ABU.mix(mixedBuffer, nextBuffer, sumBuffers),
        ABU.clone(entry.firstBuffer),
      ),
    );
    return ABU.concat(...mixedBuffers);
  }
}
