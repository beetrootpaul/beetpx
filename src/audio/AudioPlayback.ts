import { Logger } from "../logger/Logger";
import { AudioHelpers } from "./AudioHelpers";

export type BpxAudioPlaybackId = number;

export abstract class AudioPlayback {
  // start from 1 to avoid a case when someone checks for ID being truthy and gets `false`, because of value `0`
  protected static nextPlaybackId = 1;

  abstract readonly id: BpxAudioPlaybackId;
  abstract readonly type: string;

  readonly #audioContext: AudioContext;
  readonly #gainNode: GainNode;

  protected constructor(
    audioContext: AudioContext,
    target: AudioNode,
    muteOnStart: boolean,
  ) {
    this.#audioContext = audioContext;

    this.#gainNode = this.#audioContext.createGain();
    this.#gainNode.gain.value = muteOnStart ? 0 : 1;
    this.#gainNode.connect(target);
  }

  mute(fadeOutMillis: number): void {
    Logger.debugBeetPx(
      `AudioPlayback.mute (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`,
    );
    AudioHelpers.muteGain(
      this.#gainNode,
      this.#audioContext.currentTime,
      fadeOutMillis,
    );
  }

  unmute(fadeInMillis: number): void {
    Logger.debugBeetPx(
      `AudioPlayback.unmute (id: ${this.id}, type: ${this.type}, fadeInMillis: ${fadeInMillis})`,
    );
    AudioHelpers.unmuteGain(
      this.#gainNode,
      this.#audioContext.currentTime,
      fadeInMillis,
    );
  }

  stop(fadeOutMillis: number): void {
    Logger.debugBeetPx(
      `AudioPlayback.stop (id: ${this.id}, type: ${this.type}, fadeOutMillis: ${fadeOutMillis})`,
    );
    AudioHelpers.muteGain(
      this.#gainNode,
      this.#audioContext.currentTime,
      fadeOutMillis,
      () => {
        this.stopAllNodes();
      },
    );
  }

  protected createSourceNode(): AudioBufferSourceNode {
    return this.#audioContext.createBufferSource();
  }

  protected connectToMainGainNode(audioNode: AudioNode): void {
    audioNode.connect(this.#gainNode);
  }

  protected disconnectFromOutput(): void {
    this.#gainNode.disconnect();
  }

  protected abstract stopAllNodes(): void;
}
