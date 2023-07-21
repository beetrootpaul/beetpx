import { Assets, SoundUrl } from "../Assets";

export class Audio {
  readonly #assets: Assets;

  readonly #audioContext: AudioContext;

  readonly #globalGainNode: GainNode;

  readonly #muteUnmuteExponentialTimeConstant = 0.1;

  #isGloballyMuted: boolean;

  readonly #loopedSounds: Map<
    SoundUrl,
    { sourceNode: AudioBufferSourceNode; gainNode: GainNode }
  > = new Map();

  readonly #muteUnmuteTimeConstant = 0.1;

  constructor(assets: Assets, audioContext: AudioContext) {
    this.#assets = assets;
    this.#audioContext = audioContext;

    this.#globalGainNode = this.#audioContext.createGain();
    this.#globalGainNode.gain.value = 1;
    this.#globalGainNode.connect(this.#audioContext.destination);

    this.#isGloballyMuted = false;
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

  toggleMuteUnmute(): void {
    if (this.#isGloballyMuted) {
      this.#unmute();
    } else {
      this.#mute();
    }
  }

  #mute(): void {
    this.#isGloballyMuted = true;
    this.#globalGainNode.gain.setTargetAtTime(
      0,
      this.#audioContext.currentTime,
      this.#muteUnmuteExponentialTimeConstant,
    );
  }

  #unmute(): void {
    this.#isGloballyMuted = false;
    this.#globalGainNode.gain.setTargetAtTime(
      1,
      this.#audioContext.currentTime,
      this.#muteUnmuteExponentialTimeConstant,
    );
  }

  playSoundOnce(soundUrl: SoundUrl): void {
    const soundAsset = this.#assets.getSound(soundUrl);

    const sourceNode = this.#audioContext.createBufferSource();
    sourceNode.buffer = soundAsset.audioBuffer;
    sourceNode.connect(this.#globalGainNode);
    sourceNode.start();
  }

  playSoundLooped(soundUrl: SoundUrl, muteOnStart: boolean = false): void {
    const soundAsset = this.#assets.getSound(soundUrl);

    const gainNode = this.#audioContext.createGain();
    gainNode.gain.value = muteOnStart ? 0 : 1;
    gainNode.connect(this.#globalGainNode);

    const sourceNode = this.#audioContext.createBufferSource();
    sourceNode.buffer = soundAsset.audioBuffer;
    sourceNode.loop = true;
    sourceNode.connect(gainNode);
    sourceNode.start();

    this.#loopedSounds.set(soundUrl, { sourceNode, gainNode });
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
