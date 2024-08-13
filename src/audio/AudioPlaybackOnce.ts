import { Assets, BpxSoundAsset, BpxSoundUrl } from "../assets/Assets";
import { AudioPlayback, BpxAudioPlaybackId } from "./AudioPlayback";

export class AudioPlaybackOnce extends AudioPlayback {
  readonly id: BpxAudioPlaybackId = AudioPlayback.nextPlaybackId++;
  readonly type: string = "once";

  readonly #soundAsset: BpxSoundAsset;

  #sourceNode: AudioBufferSourceNode;

  constructor(
    soundUrl: BpxSoundUrl,
    params: {
      assets: Assets;
      audioContext: AudioContext;
      target: AudioNode;
      muteOnStart: boolean;
      onGamePause: "pause" | "mute" | "ignore";
      onEnded: () => void;
    },
  ) {
    super(
      params.audioContext,
      params.target,
      params.muteOnStart,
      params.onGamePause,
      params.onEnded,
    );

    this.#soundAsset = params.assets.getSoundAsset(soundUrl);

    this.#sourceNode = this.createSourceNode();
    this.setupAndStartNodes();
  }

  protected stopAllNodes(): void {
    this.#sourceNode.stop();
  }

  protected setupAndStartNodes(): void {
    if (this.pausedAtMs != null) {
      this.#sourceNode = this.createSourceNode();
    }
    this.#sourceNode.buffer = this.#soundAsset.audioBuffer;
    this.connectToMainGainNode(this.#sourceNode);

    this.#sourceNode.addEventListener("ended", () => {
      this.#sourceNode.disconnect();
      this.disconnectFromOutput();
      if (!this.isPausedByGame && !this.isPausedByEngine) {
        this.onEnded();
      }
    });

    const offsetMs = this.pausedAtMs
      ? this.pausedAtMs - this.startedAtMs - this.accumulatedPauseMs
      : 0;
    this.#sourceNode.start(0, offsetMs / 1000);
  }
}
