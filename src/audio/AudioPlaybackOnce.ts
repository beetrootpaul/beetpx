import { Assets, BpxSoundUrl } from "../misc/Assets";
import { AudioPlayback, BpxAudioPlaybackId } from "./AudioPlayback";

export class AudioPlaybackOnce extends AudioPlayback {
  readonly id: BpxAudioPlaybackId = AudioPlayback.nextPlaybackId++;
  readonly type: string = "once";

  readonly #sourceNode: AudioBufferSourceNode;

  constructor(
    soundUrl: BpxSoundUrl,
    params: {
      assets: Assets;
      audioContext: AudioContext;
      target: AudioNode;
      muteOnStart: boolean;
      onEnded: () => void;
    },
  ) {
    super(params.audioContext, params.target, params.muteOnStart);

    this.#sourceNode = this.createSourceNode();
    this.#sourceNode.buffer = params.assets.getSoundAsset(soundUrl).audioBuffer;
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
}
