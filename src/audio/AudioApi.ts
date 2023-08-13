import { Assets, SoundAsset, SoundUrl } from "../Assets";
import { StorageApi } from "../storage/StorageApi";
import { Utils } from "../Utils";
import { SoundSequence, SoundSequenceEntry } from "./SoundSequence";

export class AudioApi {
  static readonly #storageMuteUnmuteKey = "audio_api__muted";

  readonly #assets: Assets;
  readonly #audioContext: AudioContext;
  readonly #storageApi: StorageApi;

  readonly #globalGainNode: GainNode;

  readonly #muteUnmuteExponentialTimeConstant = 0.1;

  #isGloballyMuted: boolean;

  readonly #loopedSounds: Map<
    SoundUrl,
    { sourceNode: AudioBufferSourceNode; gainNode: GainNode }
  > = new Map();

  readonly #muteUnmuteTimeConstant = 0.1;

  get audioContext(): AudioContext {
    return this.#audioContext;
  }

  get globalGainNode(): GainNode {
    return this.#globalGainNode;
  }

  constructor(
    assets: Assets,
    audioContext: AudioContext,
    storageApi: StorageApi,
  ) {
    this.#assets = assets;
    this.#audioContext = audioContext;
    this.#storageApi = storageApi;

    this.#isGloballyMuted = this.#loadStoredGlobalMuteUnmuteState();

    this.#globalGainNode = this.#audioContext.createGain();
    this.#globalGainNode.gain.value = this.#isGloballyMuted ? 0 : 1;
    this.#globalGainNode.connect(this.#audioContext.destination);
  }

  // In some browsers audio should start in result of user interaction (e.g. button click).
  // Since we cannot assure it for every game setup, let' expose a function which tries to
  // resume the AudioContext and call it on every user interaction detected by this framework.
  resumeAudioContextIfNeeded(): void {
    if (this.#audioContext.state === "suspended") {
      this.#audioContext.resume().catch((err) => {
        console.error(err);
      });
      this.#unmute();
    }
  }

  // TODO: remember mute/unmute state between page reloads
  toggleMuteUnmute(): void {
    if (this.#isGloballyMuted) {
      this.#unmute();
    } else {
      this.#mute();
    }
  }

  #mute(): void {
    this.#storeGlobalMuteUnmuteState(true);
    this.#isGloballyMuted = true;
    this.#globalGainNode.gain.setTargetAtTime(
      0,
      this.#audioContext.currentTime,
      this.#muteUnmuteExponentialTimeConstant,
    );
  }

  #unmute(): void {
    this.#storeGlobalMuteUnmuteState(false);
    this.#isGloballyMuted = false;
    this.#globalGainNode.gain.setTargetAtTime(
      1,
      this.#audioContext.currentTime,
      this.#muteUnmuteExponentialTimeConstant,
    );
  }

  #loadStoredGlobalMuteUnmuteState(): boolean {
    return (
      window.localStorage.getItem(AudioApi.#storageMuteUnmuteKey) === "yes"
    );
  }

  #storeGlobalMuteUnmuteState(muted: boolean): void {
    if (muted) {
      window.localStorage.setItem(AudioApi.#storageMuteUnmuteKey, "yes");
    } else {
      window.localStorage.removeItem(AudioApi.#storageMuteUnmuteKey);
    }
  }

  playSoundOnce(soundUrl: SoundUrl): void {
    const soundAsset = this.#assets.getSoundAsset(soundUrl);

    const sourceNode = this.#newSourceNode(soundAsset);
    sourceNode.connect(this.#globalGainNode);
    sourceNode.start();
  }

  playSoundLooped(soundUrl: SoundUrl, muteOnStart: boolean = false): void {
    const soundAsset = this.#assets.getSoundAsset(soundUrl);

    const gainNode = this.#audioContext.createGain();
    gainNode.gain.value = muteOnStart ? 0 : 1;
    gainNode.connect(this.#globalGainNode);

    const sourceNode = this.#newSourceNode(soundAsset);
    sourceNode.loop = true;
    sourceNode.connect(gainNode);
    sourceNode.start();

    this.#loopedSounds.set(soundUrl, { sourceNode, gainNode });
  }

  playSoundSequence(soundSequence: SoundSequence): void {
    const intro = soundSequence.sequence ?? [];
    const loop = soundSequence.sequenceLooped ?? [];

    const playbackFns: Array<() => void> = Array.from({
      length: intro.length + loop.length,
    });

    for (let i = 0; i < intro.length; i++) {
      playbackFns[i] = () => {
        this.#playSoundSequenceEntry(intro[i]!, () => playbackFns[i + 1]!());
      };
    }

    const firstLoopedIndex = intro.length;
    for (let i = 0; i < loop.length; i++) {
      playbackFns[firstLoopedIndex + i] = () => {
        this.#playSoundSequenceEntry(
          loop[i]!,
          i < loop.length - 1
            ? () => playbackFns[firstLoopedIndex + i + 1]!()
            : () => playbackFns[firstLoopedIndex]!(),
        );
      };
    }

    // one more fn just to make loops above simpler, since there is always something on index `i+1`
    playbackFns.push(Utils.noop);

    playbackFns[0]?.();
  }

  #playSoundSequenceEntry(
    entry: SoundSequenceEntry,
    onEntryEnded?: () => void,
  ): void {
    const [mainSound, ...additionalSounds] = entry;

    const mainSoundAsset = this.#assets.getSoundAsset(mainSound.url);
    const durationMs = mainSound.durationMs(
      mainSoundAsset.audioBuffer.duration * 1000,
    );

    const sourceNodes: AudioBufferSourceNode[] = [];

    const mainSourceNode = this.#newSourceNode(
      this.#assets.getSoundAsset(mainSound.url),
    );
    mainSourceNode.connect(this.#globalGainNode);
    if (onEntryEnded) {
      // TODO: this approach doesn't seem as the precise one… so far the audio output sounds OK and on time
      //       When needed, consider reworking it based on:
      //       - https://web.dev/audio-scheduling/
      //       - https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques
      mainSourceNode.addEventListener("ended", onEntryEnded);
    }
    sourceNodes.push(mainSourceNode);

    additionalSounds.forEach((sound) => {
      const sourceNode = this.#newSourceNode(
        this.#assets.getSoundAsset(sound.url),
      );
      sourceNode.connect(this.#globalGainNode);
      sourceNodes.push(sourceNode);
    });

    sourceNodes.forEach((sn) => {
      sn.start(0, 0, durationMs / 1000);
    });
  }

  #newSourceNode(soundAsset: SoundAsset): AudioBufferSourceNode {
    const sourceNode = this.#audioContext.createBufferSource();
    sourceNode.buffer = soundAsset.audioBuffer;
    return sourceNode;
  }

  // TODO: better API to make clear that only looped sounds can be muted individually?
  muteSound(loopedSoundUrl: SoundUrl): void {
    const nodes = this.#loopedSounds.get(loopedSoundUrl);
    if (nodes) {
      nodes.gainNode.gain.setTargetAtTime(
        0,
        this.#audioContext.currentTime,
        this.#muteUnmuteTimeConstant,
      );
    }
  }

  // TODO: better API to make clear that only looped sounds can be muted individually?
  unmuteSound(loopedSoundUrl: SoundUrl): void {
    const nodes = this.#loopedSounds.get(loopedSoundUrl);
    if (nodes) {
      nodes.gainNode.gain.setTargetAtTime(
        1,
        this.#audioContext.currentTime,
        this.#muteUnmuteTimeConstant,
      );
    }
  }
}
